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
import { mailjet } from "../config/nodeMailer.js";
import * as userRepo from "../repositories/userRepo.js";
import * as mealLogRepo from "../repositories/mealLogRepo.js";
import * as workoutLogRepo from "../repositories/workoutLogRepo.js";
import * as mealCollectionRepo from "../repositories/mealCollectionRepo.js";
import * as workoutCollectionRepo from "../repositories/workoutCollectionRepo.js";

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

  // Creates new object to avoid mutating the original
  const { password, ...userDataWithoutPassword } = userData;

  // Constructs newUser data object with the required fields for a new user
  userData = {
    ...userDataWithoutPassword,
    uuid: newUserUUID,
    publicId: userPublicId,
    passwordHash,
    nutritionGoals,
  };

  // Creates new User document with the userData object
  const newUser = await userRepo.createNewUser(userData);
  const { accessToken, refreshToken } = await generateTokens(newUser);

  // Creates email verification token, stores in redis with 24 hour expiration, and sends verification email to user with link containing token
  const verificationToken = uuidv4();

  await redisClient.setEx(
    `emailVerificationToken:${verificationToken}`,
    86400,
    JSON.stringify({ uuid: newUser.uuid }),
  );

  if (getEnv("NODE_ENV") !== "test") {
    const verifyUrl = `${getEnv("CLIENT_ORIGIN")}/auth/verify/${verificationToken}`;
    await mailjet.post("send", { version: "v3.1" }).request({
      Messages: [
        {
          From: {
            Email: getEnv("MAILJET_FROM_EMAIL"),
            Name: getEnv("MAILJET_FROM_NAME"),
          },
          To: [
            {
              Email: newUser.email,
            },
          ],
          TemplateID: 7732849,
          TemplateLanguage: true,
          Variables: {
            verifyLink: verifyUrl,
          },
        },
      ],
    });
  }

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

export async function initiatePasswordReset(email) {
  // Checks if user email exists in database
  const user = await userRepo.findOneUserByEmail(email);
  if (!user) throw new NotFoundError("USER"); // throws error if email is not found

  // Creates token if user is found
  const resetToken = uuidv4();

  // Stores token in redis with 1 hour expiration time
  await redisClient.setEx(
    `passwordResetVerificationToken:${resetToken}`,
    3600,
    JSON.stringify({ uuid: user.uuid }),
  );

  if (getEnv("NODE_ENV") !== "test") {
    // Creates email verification token, stores in redis with 24 hour expiration, and sends verification email to user with link containing token
    const resetUrl = `${getEnv("CLIENT_ORIGIN")}/auth/change-password/${resetToken}`;
    await mailjet.post("send", { version: "v3.1" }).request({
      Messages: [
        {
          From: {
            Email: getEnv("MAILJET_FROM_EMAIL"),
            Name: getEnv("MAILJET_FROM_NAME"),
          },
          To: [
            {
              Email: user.email,
            },
          ],
          TemplateID: 7733362,
          TemplateLanguage: true,
          Variables: {
            resetLink: resetUrl,
          },
        },
      ],
    });
  }
  return;
}

export async function resetPassword(token, newPassword) {
  // Checks if token is valid by looking for it in cache
  const user = await redisClient.get(`passwordResetVerificationToken:${token}`);
  if (!user) throw new UnauthorizedError();

  // If token is valid, hashes new password and updates user document with new password hash and deletes the token from redis
  const uuid = JSON.parse(user).uuid;
  const salt = await generateSalt();
  const newPasswordHash = await hashPassword(newPassword, salt);

  await Promise.all([
    redisClient.del(`passwordResetVerificationToken:${token}`),
    userRepo.updateMultipleUserFieldsByUUID(uuid, {
      passwordHash: newPasswordHash,
    }),
  ]);
  return;
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

  await revokeRefreshToken(refreshToken); // Revokes refreshToken so it cannot be used again

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
    publicId: user.publicId,
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

export async function verifyUserAccount(token) {
  const user = await redisClient.get(`emailVerificationToken:${token}`);
  if (!user) throw new UnauthorizedError();

  const uuid = JSON.parse(user).uuid;

  await Promise.all([
    redisClient.del(`emailVerificationToken:${token}`),
    userRepo.updateMultipleUserFieldsByUUID(uuid, { verified: true }),
  ]);

  return;
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
  let hasNextPage = null;
  let hasPreviousPage = null;

  const { workouts, totalCount } =
    await workoutCollectionRepo.findWorkoutsInCollectionByUserPublicId(
      userPublicId,
      offset,
      pageSize,
    );

  if (offset + pageSize < totalCount - 1) hasNextPage = true;

  if (offset > 0) hasPreviousPage = true;

  return { workouts, hasPreviousPage, hasNextPage };
}

export async function getUserMeals(userPublicId, offset, pageSize) {
  let hasNextPage = null;
  let hasPreviousPage = null;
  const { meals, totalCount } =
    await mealCollectionRepo.findMealsInCollectionByUserPublicId(
      userPublicId,
      offset,
      pageSize,
    );

  if (offset + pageSize < totalCount - 1) hasNextPage = true;
  if (offset > 0) hasPreviousPage = true;
  return { meals, hasPreviousPage, hasNextPage };
}

export async function generateUserWorkoutsReport(userUUID, range = "all") {
  // Checks if user exists
  const user = await userRepo.findOneUserByUUID(userUUID);
  if (!user) throw new NotFoundError("User");

  // Gets date ranges based on requested range
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
