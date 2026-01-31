import * as userRepo from "../repositories/userRepo.js";
import * as workoutRepo from "../repositories/workoutRepo.js";
import * as mealRepo from "../repositories/mealRepo.js";
import * as mealLogRepo from "../repositories/mealLogRepo.js";
import * as workoutLogRepo from "../repositories/workoutLogRepo.js";
import * as mealCollectionRepo from "../repositories/mealCollectionRepo.js";
import * as workoutCollectionRepo from "../repositories/workoutCollectionRepo.js";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import redisClient from "../config/redisClient.js";
import { generateSalt, hashPassword, verifyPassword } from "../utils/hash.js";
import { makePublicId } from "../utils/publicIds.js";
import { getEnv } from "../config/envConfig.js";
import { getMembershipDuration } from "../utils/MembershipDuration.js";
import { ConflictError } from "../errors/ConflictError.js";
import { InvalidCredentialsError } from "../errors/InvalidCredentialsError.js";
import { NotFoundError } from "../errors/NotFoundError.js";
import { UnauthorizedError } from "../errors/UnauthorizedError.js";
import { getDateRange } from "../utils/getDateRange.js";
import { calculateMacros } from "../utils/calculateMacros.js";

export async function registerNewUser(userData) {
  // Checks if a user has already registered with the provided email
  const user = await userRepo.findOneUserByEmail(userData.email);
  if (user) throw new ConflictError("EMAIL");

  // Password Encryption
  const salt = await generateSalt();
  const passwordHash = await hashPassword(userData.password, salt);
  const newUserUUID = uuidv4(); // creates newUsers uuid
  const userPublicId = makePublicId(newUserUUID); // calls util function to create short public uuid for the newUser
  const nutritionGoals = calculateMacros(userData.profile);

  delete userData.password; // Removes the unhashed password from the userData object

  // Constructs newUser data object with the required fields for a new user
  userData = {
    ...userData,
    uuid: newUserUUID,
    publicId: userPublicId,
    passwordHash,
    nutritionGoals,
  };

  // Creates new User document with the userData object
  const newUser = await userRepo.createNewUser(userData);
  const { accessToken, refreshToken } = await generateTokens(newUser);

  return {
    accessToken,
    refreshToken,
  };
}

export async function validateCredentials(email, password) {
  // Checks if user email has been registered
  const user = await userRepo.findOneUserByEmail(email);
  if (!user) throw new InvalidCredentialsError();

  // Verifies password is correct
  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) throw new InvalidCredentialsError();

  const { accessToken, refreshToken } = await generateTokens(user);

  return {
    accessToken,
    refreshToken,
  };
}

export async function refreshTokens(refreshToken) {
  // Checks if refresh token is blacklisted
  const revoked = await redisClient.exists(`revoked:${refreshToken}`);
  if (revoked) throw new UnauthorizedError();

  // Checks if refresh token is valid
  const stored = await redisClient.get(`refreshToken:${refreshToken}`);
  if (!stored) throw new UnauthorizedError();

  // Checks if the refreshToken has expired
  const { userUUID, iat } = JSON.parse(stored);
  const now = Date.now();
  const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000;
  const timeElapsed = now - iat;
  if (timeElapsed > sevenDaysInMs) throw new UnauthorizedError();

  await revokeRefreshToken(refreshToken); // Revokes refreshToken

  // Gets user information from database **[Think about adding username to redis cache to avoid having to query db]**
  const user = await userRepo.findOneUserByUUID(userUUID);

  const tokens = await generateTokens(user);
  const newAccessToken = tokens.accessToken;
  const newRefreshToken = tokens.refreshToken;

  return { newAccessToken, newRefreshToken };
}

export async function generateTokens(user) {
  // Creates JWT payload and both the access token signed with server JWT_SECRET and refresh token.
  // Access token will expire in 15 min.
  const accessTokenPayload = {
    sub: user.uuid.toString(),
    username: user.username,
  };
  const accessToken = jwt.sign(accessTokenPayload, getEnv("JWT_SECRET"), {
    expiresIn: "15m",
  });
  const refreshToken = uuidv4(); // Opaque string

  // Sets redis key with newly generated refreshToken, user.uuid, and issued date
  await redisClient.setEx(
    `refreshToken:${refreshToken}`,
    604800,
    JSON.stringify({
      userUUID: user.uuid,
      iat: Date.now(),
    }),
  );

  return { accessToken, refreshToken };
}

export async function revokeRefreshToken(refreshToken) {
  const stored = await redisClient.get(`refreshToken:${refreshToken}`);
  if (!stored) return; // returns if redis client has already expired the token entry

  const { iat } = JSON.parse(stored);
  const now = Date.now();
  const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000;
  const timeElapsed = now - iat;
  const timeRemaining = sevenDaysInMs - timeElapsed;

  // Sets new `revoked:${refreshToken}` key with remaining lifetime in cache
  if (timeRemaining > 0) {
    await redisClient.setEx(
      `revoked:${refreshToken}`,
      Math.floor(timeRemaining / 1000),
      "revoked",
    );

    await redisClient.del(`refreshToken:${refreshToken}`); // Deletes entry after token has been revoked

    return;
  }
}

export async function getPublicUserInformation(userPublicId) {
  const user = await userRepo.findOneUserByPublicId(userPublicId);
  if (!user) throw new NotFoundError("USER");

  const publicInformation = {
    username: user.username,
    age: user.age,
    publicId: user.publicId,
    memberSince: getMembershipDuration(user.createdAt),
  };

  return { ...publicInformation };
}

export async function getPrivateUserInformation(userUUID) {
  const user = await userRepo.findOneUserByUUID(userUUID);
  if (!user) throw new NotFoundError("USER");

  const privateInformation = {
    firstName: user.firstName,
    lastName: user.lastName,
    username: user.username,
    publicId: user.publicId,
    height: user.height,
    age: user.age,
    weight: user.weight,
  };

  return { ...privateInformation };
}

export async function updatePrivateUserInformation(userUUID, updatedFields) {
  const user = await userRepo.updateMultipleUserFieldsByUUID(
    userUUID,
    updatedFields,
  );

  const updatedPrivateInformation = {
    firstName: user.firstName,
    lastName: user.lastName,
    username: user.username,
    height: user.height,
    age: user.age,
    weight: user.weight,
  };

  return { ...updatedPrivateInformation };
}

export async function getUserWorkouts(userPublicId, offset = 0, pageSize = 10) {
  const user = await userRepo.findOneUserByPublicId(userPublicId);
  if (!user) throw new NotFoundError("USER");

  let hasNextPage = null;
  let hasPreviousPage = null;

  const { workouts, totalCount } = await workoutCollectionRepo.findWorkoutsInCollectionByUserPublicId(
    userPublicId,
    offset,
    pageSize,
  );

  if (offset + pageSize < totalCount - 1) hasNextPage = true;

  if (offset > 0) hasPreviousPage = true;

  return { workouts, hasPreviousPage, hasNextPage };
}

export async function duplicateWorkout(publicId, workoutId) {
  const user = await userRepo.findOneUserByPublicId(publicId);
  if (!user) throw new NotFoundError("User");

  const workout = await workoutRepo.findOneWorkoutByUUID(workoutId);
  if (!workout) throw new NotFoundError("Workout");

  await workoutRepo.duplicateOneWorkoutByUUID(workoutId);
  return;
}

export async function deleteWorkout(publicId, workoutId) {
  let workout;
  let collectionEntry;
  const user = await userRepo.findOneUserByPublicId(publicId);
  if (!user) throw new NotFoundError("User");

  workout = await workoutRepo.findOneWorkoutByUUID(workoutId)
  if (!workout){
    collectionEntry = await workoutCollectionRepo.findWorkoutInCollectionById(publicId, workoutId);
    if(!collectionEntry){
      throw new NotFoundError("Workout");
    }
    await workoutCollectionRepo.removeOneWorkoutFromUserCollection(publicId, workoutId);
    await workoutLogRepo.updateUserDeletedWorkoutLogStatus(publicId, workoutId, true);
    return;
  }


  if (workout.creatorPublicId !== user.publicId){
    await workoutCollectionRepo.removeOneWorkoutFromUserCollection(publicId, workoutId);
    await workoutLogRepo.updateUserDeletedWorkoutLogStatus(publicId, workoutId, true);
    return;
  }


  await workoutCollectionRepo.removeOneWorkoutFromUserCollection(publicId, workoutId);
  await workoutCollectionRepo.updateDeletedWorkoutInCollection(workoutId, {
    workoutName: workout.workoutName,
    workoutDuration: workout.workoutDuration,
    exercises: workout.exercises,
  });
  await workoutRepo.deleteOneWorkoutById(workoutId);
  await workoutLogRepo.updateUserDeletedWorkoutLogStatus(publicId, workoutId, true);
  
  return;
}

export async function getUserMeals(userPublicId, offset, pageSize) {
  const user = await userRepo.findOneUserByPublicId(userPublicId);
  if (!user) throw new NotFoundError("USER");

  let hasNextPage = null;
  let hasPreviousPage = null;
  const { meals, totalCount } = await mealCollectionRepo.findMealsInCollectionByUserPublicId(
    userPublicId,
    offset,
    pageSize,
  );

  if (offset + pageSize < totalCount - 1) hasNextPage = true;
  if (offset > 0) hasPreviousPage = true;
  return { meals, hasPreviousPage, hasNextPage };
}

export async function duplicateMeal(publicId, mealId) {
  const user = await userRepo.findOneUserByPublicId(publicId);
  if (!user) throw new NotFoundError("User");

  const meal = await mealRepo.findOneMealByUUID(mealId);
  if (!meal) throw new NotFoundError("Meal");

  meal.creatorPublicId = user.publicId;
  console.log(meal);
  //await mealRepo.createMeal(meal);
  

  return;
}

export async function deleteMeal(publicId, mealId) {
  const user = await userRepo.findOneUserByPublicId(publicId);
  if (!user) throw new NotFoundError("User");

  const meal = await mealRepo.findOneMealByUUID(mealId);
  if (!meal) throw new NotFoundError("Meal");

  if (meal.creatorPublicId !== user.publicId) throw new UnauthorizedError();

  await mealRepo.deleteOneMealById(mealId);
  return;
}

export async function generateUserWorkoutsReport(userUUID, range = "all") {
  const user = await userRepo.findOneUserByUUID(userUUID);
  if (!user) throw new NotFoundError("User");

  const ranges = getDateRange(range);

  if (range === "all") {
    const [daily, weekly, monthly] = await Promise.all([
      workoutLogRepo.findAllWorkoutLogsByUserPublicId(
        user.publicId,
        ranges.daily,
      ),
      workoutLogRepo.findAllWorkoutLogsByUserPublicId(
        user.publicId,
        ranges.weekly,
      ),
      workoutLogRepo.findAllWorkoutLogsByUserPublicId(
        user.publicId,
        ranges.monthly,
      ),
    ]);

    return {
      daily,
      weekly,
      monthly,
    };
  }

  return await workoutLogRepo.findAllWorkoutLogsByUserPublicId(
    user.publicId,
    ranges[range],
  );
}

export async function generateUserNutritionReport(userUUID, range) {
  const user = await userRepo.findOneUserByUUID(userUUID);
  if (!user) throw new NotFoundError("User");

  const ranges = getDateRange(range);

  // range === "all" → run all reports in parallel
  if (range === "all") {
    const [daily, weekly, monthly] = await Promise.all([
      mealLogRepo.findAllMealLogsByUserPublicId(user.publicId, ranges.daily),
      mealLogRepo.findAllMealLogsByUserPublicId(user.publicId, ranges.weekly),
      mealLogRepo.findAllMealLogsByUserPublicId(user.publicId, ranges.monthly),
    ]);

    return {
      daily,
      weekly,
      monthly,
      nutritionGoals: user.nutritionGoals,
    };
  }

  // Single-range request
  const mealLogs = await mealLogRepo.findAllMealLogsByUserPublicId(
    user.publicId,
    ranges[range],
  );

  return { [range]: mealLogs, nutritionGoals: user.nutritionGoals };
}
