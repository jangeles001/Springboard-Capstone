process.env.NODE_ENV = "test";

//TODO: Separate based ond service type; ex. validation tests grouped, creation tests grouped, data fetching tests grouped

import { expect } from "chai";
import mongoose from "mongoose";
import { User } from "../models/userModel.js";
import { Workout } from "../models/workoutModel.js";
import { Meal } from "../models/mealModel.js";
import { Exercise } from "../models/exerciseModel.js";
import { userA, userB } from "./helpers/axiosClients.js";
import { getEnv } from "../config/envConfig.js";
import {
  registerNewUser,
  revokeRefreshToken,
} from "../services/userService.js";
import { getMembershipDuration } from "../utils/MembershipDuration.js";
import redisClient from "../config/redisClient.js";

const BASE_URL = `http://localhost:${getEnv("PORT")}`;
let newUserA;
let newWorkoutA;

describe(" Test cases for ALL routes", function () {
  before(async function(){
    await mongoose.connect(getEnv("MONGO_TEST_URI"));
  });

  // Clears all users and dogs from the db before each test.
  beforeEach(async () => {
    await User.deleteMany({});
    await Workout.deleteMany({});
    await Meal.deleteMany({});
    await redisClient.flushDb();
    await userA.jar.removeAllCookies();
    await userB.jar.removeAllCookies();

    const userData = {
      publicId: 1,
      firstName: "notChris",
      lastName: "Chisterson",
      username: "christersonchrischris",
      password: "abc1234",
      height: "5'9\"",
      age: 30,
      weight: 221,
      email: "chirstersonchrisss@gmail.com",
      promoConsent: true,
      agreeToTerms: true,
    };

    // Creates new users before each test
    const { username, publicId, accessToken, refreshToken } =
    await registerNewUser(userData);  

    await userA.jar.setCookie(`accessToken=${accessToken}`, BASE_URL);
    await userA.jar.setCookie(`refreshToken=${refreshToken}`, BASE_URL);

    newUserA = {
      username,
      publicId,
    };

    const newWorkoutData = {
      creatorPublicId: newUserA.publicId,
      workoutName: "Push Dayyyy",
      exercises: [
        {
          exerciseId: "57",
          exerciseName: "Bear Walk",
          description: "None provided",
          difficultyAtCreation: 3,
          sets: 3,
          reps: 8,
          weight: 220,
        },
        {
          exerciseId: "31",
          exerciseName: "Axe Hold",
          description: "None provided",
          difficultyAtCreation: 1,
          sets: 3,
          reps: 10,
          weight: 221,
        },
        {
          exerciseId: "56",
          exerciseName: "Abdominal Stabilization",
          description: " None Provided",
          difficultyAtCreation: 2,
          sets: 3,
          reps: 8,
          weight: 222,
        },
        {
          exerciseId: "805",
          exerciseName: "Tricep Pushdown on Cable",
          description:
            "The cable rope push-down is a popular exercise targeting the triceps muscles. It's easy to learn and perform, making it a favorite for everyone from beginners to advanced lifters. It is usually performed for moderate to high reps, such as 8-12 reps or more per set, as part of an upper-body or arm-focused workout.",
          difficultyAtCreation: 5,
          sets: 3,
          reps: 12,
          weight: 223,
        },
      ],
    };

    const { uuid, creatorPublicId } = await Workout.create(newWorkoutData);  

    newWorkoutA = {
      uuid,
      creatorPublicId
    };

  });

  after(async function () {
    await mongoose.connection.close();
  });

  it("POST api/v1/auth/register should register a new users and set both the access and refresh token as a cookie for the session", async () => {
    const newUser = {
      firstName: "Chris",
      lastName: "Christianson",
      username: "ChrisChrisChris",
      password: "abc12345",
      height: "5'9\"",
      age: 30,
      weight: 222,
      email: "ChrisChris@gmail.com",
      promoConsent: true,
      agreeToTerms: true,
    };

    const results = await userB.client.post(
      `${BASE_URL}/api/v1/auth/register`,
      newUser,
      {
        headers: { "Content-Type": "application/json" },
        validateStatus: () => true, // Allows for statuses outside of 200 range
      }
    );

    expect(results.status).to.equal(201);
    expect(results.data.message).to.equal("Registration Successful!");

    // Checks if cookies have been set properly
    const cookies = await userB.jar.getCookies(BASE_URL);
    const cookieKeys = cookies.map((cookie) => cookie.key);
    expect(cookieKeys).to.include("accessToken");
    expect(cookieKeys).to.include("refreshToken");

    const newUserPublicId = results.data.data.publicId;
    const dbCheck = await User.findOne({ publicId: newUserPublicId }); // Finds first match for newUserUUID in the database
    expect(dbCheck).to.exist; // Checks if db contains the newUser

    // Checks for well-formed newUserInfo results object
    expect(results.data.data).to.deep.equal({
      username: newUser.username,
      publicId: dbCheck.publicId,
    });
  });

  it("POST api/v1/auth/register should return 409 error since the email address is already in use", async () => {
    // Same userData as the default users created before each test
    const newUser = {
      firstName: "notChris",
      lastName: "Chisterson",
      username: "christersonchrischris",
      password: "abc1234",
      height: "5'9\"",
      age: 30,
      weight: 221,
      email: "chirstersonchrisss@gmail.com",
      promoConsent: true,
      agreeToTerms: true,
    };

    const results = await userB.client.post(
      `${BASE_URL}/api/v1/auth/register`,
      newUser,
      {
        headers: { "Content-Type": "application/json" },
        validateStatus: () => true, // Allows for statuses outside of 200 range
      }
    );

    expect(results.status).to.equal(409);
    expect(results.data.message).to.equal("EMAIL_ALREADY_REGISTERED");

    // Checks if cookies not been set
    const cookies = await userB.jar.getCookies(BASE_URL);
    expect(cookies.length).to.equal(0); // Expects cookie jar to be empty
  });

  it("POST api/v1/auth/register should return 400 error validation failure age and first name is required", async () => {
    // Same userData as the default users created before each test
    const newUser = {
      lastName: "Chisterson",
      username: "christersonchrischris",
      password: "abc1234",
      height: "5'9\"",
      weight: 221,
      email: "chirstersonchrisss@gmail.com",
    };

    const results = await userB.client.post(
      `${BASE_URL}/api/v1/auth/register`,
      newUser,
      {
        headers: { "Content-Type": "application/json" },
        validateStatus: () => true, // Allows for statuses outside of 200 range
      }
    );

    expect(results.status).to.equal(400);
    expect(results.data.error).to.equal("Validation failed!");
    expect(results.data.details).to.include("Age is required!");
    expect(results.data.details).to.include("First name is required!");

    // Checks if cookies have not been set
    const cookies = await userB.jar.getCookies(BASE_URL);
    expect(cookies.length).to.equal(0); // Expects cookie jar to be empty
  });

  it("POST api/v1/auth/register should return 400 error validation failure age and weight must be a number", async () => {
    // Same userData as the default users created before each test
    const newUser = {
      firstName: "notChris",
      lastName: "Chisterson",
      username: "christersonchrischris",
      password: "abc1234",
      height: "5'9\"",
      age: "30",
      weight: "221",
      email: "chirstersonchrisss@gmail.com",
    };

    const results = await userB.client.post(
      `${BASE_URL}/api/v1/auth/register`,
      newUser,
      {
        headers: { "Content-Type": "application/json" },
        validateStatus: () => true, // Allows for statuses outside of 200 range
      }
    );

    expect(results.status).to.equal(400);
    expect(results.data.error).to.equal("Validation failed!");
    expect(results.data.details).to.include("Age must be a number!");
    expect(results.data.details).to.include("Weight must be a number!");

    // Checks if cookies have not been set
    const cookies = await userB.jar.getCookies(BASE_URL);
    expect(cookies.length).to.equal(0); // Expects cookie jar to be empty
  });

  it("POST api/v1/auth/login should return 200 login successful and set accessToken and refreshToken cookies to the client session", async () => {
    // Same userData as the default users created before each test
    const userCredentials = {
      email: "chirstersonchrisss@gmail.com",
      password: "abc1234",
    };

    const results = await userB.client.post(
      `${BASE_URL}/api/v1/auth/login`,
      userCredentials,
      {
        headers: { "Content-Type": "application/json" },
        validateStatus: () => true, // Allows for statuses outside of 200 range
      }
    );

    const validatedUser = await User.findOne({ email: userCredentials.email });

    expect(results.status).to.equal(200);
    expect(results.data.message).to.equal(
      `${validatedUser.username} (ID: ${validatedUser.publicId}) Logged In!`
    );

    // Checks if cookies have been set properly
    const cookies = await userB.jar.getCookies(BASE_URL);
    const cookieKeys = cookies.map((cookie) => cookie.key);
    expect(cookieKeys).to.include("accessToken");
    expect(cookieKeys).to.include("refreshToken");
  });

  it("POST api/v1/auth/login should return 401 invalid credentials (password)", async () => {
    // Incorrect password is being provided for the userCredentials
    const userCredentials = {
      email: "chirstersonchrisss@gmail.com",
      password: "abc123",
    };

    const results = await userB.client.post(
      `${BASE_URL}/api/v1/auth/login`,
      userCredentials,
      {
        headers: { "Content-Type": "application/json" },
        validateStatus: () => true, // Allows for statuses outside of 200 range
      }
    );

    expect(results.status).to.equal(401);
    expect(results.data.message).to.equal(`INVALID_CREDENTIALS`);

    // Checks if cookies have not been set
    const cookies = await userB.jar.getCookies(BASE_URL);
    expect(cookies.length).to.equal(0); // Expects cookie jar to be empty
  });

  it("POST api/v1/auth/login should return 401 invalid credentials (email)", async () => {
    // Incorrect email is being provided for the userCredentials
    const userCredentials = {
      email: "chirstersonchriss@gmail.com",
      password: "abc1234",
    };

    const results = await userB.client.post(
      `${BASE_URL}/api/v1/auth/login`,
      userCredentials,
      {
        headers: { "Content-Type": "application/json" },
        validateStatus: () => true, // Allows for statuses outside of 200 range
      }
    );

    expect(results.status).to.equal(401);
    expect(results.data.message).to.equal(`INVALID_CREDENTIALS`);

    // Checks if cookies have not been set
    const cookies = await userB.jar.getCookies(BASE_URL);
    expect(cookies.length).to.equal(0); // Expects cookie jar to be empty
  });

  it("GET api/v1/auth/refresh should return 200 and a new set of access and refresh tokens should be set a cookies for the session", async () => {
    // Required to ensure a new token is generated
    await new Promise((resolve) => setTimeout(resolve, 940));

    // Stores initial cookies provided to the client upon users creation at start of test
    const initialCookies = await userA.jar.getCookies(BASE_URL);

    const results = await userA.client.get(`${BASE_URL}/api/v1/auth/refresh`, {
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
      validateStatus: () => true, // Allows for statuses outside of 200 range
    });

    expect(results.status).to.equal(201);
    expect(results.data.message).to.equal(`TOKENS_REFRESHED`);

    // Checks if new cookies have been issued
    const newCookies = await userA.jar.getCookies(BASE_URL);
    expect(newCookies[0].value).to.not.equal(initialCookies[0].value);
    expect(newCookies[1].value).to.not.equal(initialCookies[1].value);
  });

  it("GET api/v1/auth/refresh should return 401 for using a revoked access token", async () => {
    // Gets cookies from userA client jar
    const cookies = await userA.jar.getCookies(BASE_URL);
    const refreshToken = cookies[1].value;

    // Revokes refreshToken, but doesn't delete it from the client session
    await revokeRefreshToken(refreshToken);

    const results = await userA.client.get(`${BASE_URL}/api/v1/auth/refresh`, {
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
      validateStatus: () => true, // Allows for statuses outside of 200 range
    });

    expect(results.status).to.equal(403);
    expect(results.data.message).to.equal("UNAUTHORIZED_REQUEST");
  });

  // TODO: Test logout functionality
  it("GET api/v1/auth/logout should return 200 successful logout", async () => {
    // Gets cookies from userA client jar
    const cookies = await userA.jar.getCookies(BASE_URL);
    const refreshToken = cookies[1].value;

    const results = await userA.client.get(`${BASE_URL}/api/v1/auth/logout`, {
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
      validateStatus: () => true, // Allows for statuses outside of 200 range
    });

    const cookiesAfterRequest = await userA.jar.getCookies(BASE_URL);
    expect(cookiesAfterRequest.length).to.equal(0);

    // Checks cache for revoked token
    const cacheCheck = await redisClient.get(`revoked:${refreshToken}`);
    expect(cacheCheck).to.exist;
    expect(cacheCheck).to.equal("revoked");

    expect(results.status).to.equal(200);
    expect(results.data.message).to.equal("Log Out Successful!");
  });

  it("GET api/v1/auth/logout should return 200 successful logout even without the refreshToken", async () => {
    // Removes all cookies from the client jar
    await userA.jar.removeAllCookies();
    const cookies = await userA.jar.getCookies(BASE_URL);
    expect(cookies.length).to.equal(0);

    const results = await userA.client.get(`${BASE_URL}/api/v1/auth/logout`, {
      headers: { "Content-Type": "application/json" },
      validateStatus: () => true, // Allows for statuses outside of 200 range
    });

    expect(results.status).to.equal(200);
    expect(results.data.message).to.equal("Log Out Successful!");
  });

  it("GET api/v1/users/me should return 200 and display the logged in users' private information", async () => {
    // userData that will be compared to the results data
    const userData = {
      firstName: "notChris",
      lastName: "Chisterson",
      username: "christersonchrischris",
      height: "5'9\"",
      age: 30,
      weight: 221,
    };

    const results = await userA.client.get(`${BASE_URL}/api/v1/users/me`, {
      headers: { "Content-Type": "application/json" },
      validateStatus: () => true,
    });

    expect(results.status).to.equal(200);
    expect(results.data.data).to.deep.equal(userData);
  });

  it("PATCH api/v1/users/me should return 200 and the updated private user information", async () => {
    // Gets users from database
    const users = await User.findOne({ publicId: newUserA.publicId });

    // Saves initialPrivateData before any changes are made
    const initialPrivateData = {
      firstName: users.firstName,
      lastName: users.lastName,
      username: users.username,
      height: users.height,
      age: users.age,
      weight: users.weight,
    };

    // New private data
    const newPrivateUserData = {
      firstName: "Chrisssssss",
      lastName: "Chistersonson",
      username: "actuallymightbechris",
      height: "5'7\"",
      age: 31,
      weight: 222,
    };

    const results = await userA.client.patch(
      `${BASE_URL}/api/v1/users/me`,
      newPrivateUserData,
      {
        headers: { "Content-Type": "application/json" },
        validateStatus: () => true,
      }
    );

    expect(results.status).to.equal(200);
    expect(results.data.data).to.deep.equal(newPrivateUserData);
    expect(newPrivateUserData).to.not.deep.equal(initialPrivateData);
  });

  it("PATCH api/v1/users/me should return 200 and update only the provided private user information", async () => {
    // Gets users from database
    const users = await User.findOne({ publicId: newUserA.publicId });

    // Saves initialPrivateData before any changes are made
    const initialPrivateData = {
      firstName: users.firstName,
      lastName: users.lastName,
      username: users.username,
      height: users.height,
      age: users.age,
      weight: users.weight,
    };

    // New private data
    const newPrivateUserData = {
      firstName: "Chrisssssss",
      lastName: "Chistersonson",
      age: 31,
      weight: 222,
    };

    const results = await userA.client.patch(
      `${BASE_URL}/api/v1/users/me`,
      newPrivateUserData,
      {
        headers: { "Content-Type": "application/json" },
        validateStatus: () => true,
      }
    );

    const { firstName, lastName, age, weight } = results.data.data; // Destructures the updated fields
    // Creates object to test if the fields have been updated.
    const updatedFields = {
      firstName,
      lastName,
      age,
      weight,
    };

    expect(results.status).to.equal(200);
    expect(updatedFields).to.deep.equal(newPrivateUserData);
    expect(results.data.data).to.not.deep.equal(initialPrivateData);
  });

  it("GET api/v1/users/:userPublicId should return 200 and the public information for the user with the publicId provided in the url params", async () => {
    const results = await userA.client.get(
      `${BASE_URL}/api/v1/users/${newUserA.publicId}`,
      {
        headers: { "Content-Type": "application/json" },
        validateStatus: () => true,
      }
    );

    const user = await User.findOne({ publicId: newUserA.publicId });

    expect(results.status).to.equal(200);
    expect(results.data.data.username).to.equal(user.username);
    expect(results.data.data.age).to.equal(user.age);
    expect(results.data.data.memberSince).to.deep.equal(
      getMembershipDuration(user.createdAt)
    );
  });

  it("GET api/v1/users/:userPublicId should return 404 user not found", async () => {
    const results = await userA.client.get(`${BASE_URL}/api/v1/users/1`, {
      headers: { "Content-Type": "application/json" },
      validateStatus: () => true,
    });

    expect(results.status).to.equal(404);
    expect(results.data.message).to.equal("USER_NOT_FOUND");
  });

  it("GET api/v1/users/:userPublicId/workouts should return 200 and display the created workouts for the user with the corresponding publicId", async () => {
    const workouts = await Workout.find({
      creatorPublicId: newUserA.publicId,
    }).select("-__v -_id -updatedAt").lean();
    const [firstWorkout] = workouts;
    const firstWorkoutJSON = JSON.parse(JSON.stringify(firstWorkout));

    const results = await userA.client.get(
      `${BASE_URL}/api/v1/users/${newUserA.publicId}/workouts`,
      {
        headers: { "Content-Type": "application/json" },
        validateStatus: () => true,
      }
    );

    expect(results.status).to.equal(200);
    expect(results.data.data.length).to.equal(workouts.length);
    expect(results.data.data[0]).to.deep.equal(firstWorkoutJSON);
  });

  it("GET api/v1/users/:userPublicId/workouts should return 404 user not found", async () => {
    const results = await userA.client.get(
      `${BASE_URL}/api/v1/users/1/workouts`,
      {
        headers: { "Content-Type": "application/json" },
        validateStatus: () => true,
      }
    );

    expect(results.status).to.equal(404);
    expect(results.data.message).to.equal("USER_NOT_FOUND");
  });

  it("GET api/v1/users/:userPublicId/meals should return 200 and an empty list", async () => {
    const userMeals = await Meal.find({ creatorPublicId: newUserA.publicId });
    const results = await userA.client.get(
      `${BASE_URL}/api/v1/users/${newUserA.publicId}/meals`,
      {
        headers: { "Content-Type": "application/json" },
        validateStatus: () => true,
      }
    );

    expect(results.status).to.equal(200);
    expect(results.data.data).to.deep.equal(userMeals);
  });

  it("POST api/v1/exercises should return 201 status and the created exercise", async () => {
    const newExerciseData = {
      exerciseId: 11111112,
      name: "test",
      category: "strength",
    };

    const results = await userA.client.post(
      `${BASE_URL}/api/v1/exercises`,
      newExerciseData,
      {
        headers: { "Content-Type": "application/json" },
        validationStatus: () => true,
      }
    );

    const createdExercise = await Exercise.findOne({ exerciseId: newExerciseData.exerciseId }).select("-__v -_id -updatedAt").lean();
    const jsonExercise = JSON.parse(JSON.stringify(createdExercise));
    await Exercise.deleteOne({ exerciseId: 11111112 });
    expect(results.status).to.equal(201);
    expect(results.data.data).to.deep.equal(jsonExercise);
  });

  it("GET api/v1/exercises should return 200 and a list of all exercises in the database", async () => {
    const exercises = await Exercise.find({}).select("-__v -_id").lean();
    const jsonExercises = JSON.parse(JSON.stringify(exercises));
    const results = await userA.client.get(`${BASE_URL}/api/v1/exercises`, {
      headers: { "Content-Type": "application/json" },
      validateStatus: () => true,
    });

    expect(results.status).to.equal(200);
    expect(results.data.data).to.deep.equal(jsonExercises);
  });

  it("GET api/v1/exercises/:exerciseId should return 200 status and information for the exercise with the sepcified exerciseId", async () => {
    const exercise = await Exercise.findOne({ exerciseId: "57" }).select("-__v -_id -updatedAt -aiFeatures").lean();
    const jsonExercise = JSON.parse(JSON.stringify(exercise));
    const results = await userA.client.get(`${BASE_URL}/api/v1/exercises/57`, {
      headers: { "Content-Type": "application/json" },
      validateStatus: () => true,
    });

    expect(results.status).to.equal(200);
    expect(results.data.data).to.deep.equal(jsonExercise);
  });

  it("POST api/v1/workouts should return 201 and the new created workout information",async () => {
    const newWorkoutData = {
      creatorPublicId: newUserA.publicId,
      workoutName: "Pull Dayyyy",
      exercises: [
        {
          exerciseId: "57",
          exerciseName: "Bear Walk",
          description: "None provided",
          difficultyAtCreation: 3,
          sets: 3,
          reps: 8,
          weight: 220,
        },
        {
          exerciseId: "31",
          exerciseName: "Axe Hold",
          description: "None provided",
          difficultyAtCreation: 1,
          sets: 3,
          reps: 10,
          weight: 221,
        },
        {
          exerciseId: "56",
          exerciseName: "Abdominal Stabilization",
          description: " None Provided",
          difficultyAtCreation: 2,
          sets: 3,
          reps: 8,
          weight: 222,
        },
        {
          exerciseId: "805",
          exerciseName: "Tricep Pushdown on Cable",
          description:
            "The cable rope push-down is a popular exercise targeting the triceps muscles. It's easy to learn and perform, making it a favorite for everyone from beginners to advanced lifters. It is usually performed for moderate to high reps, such as 8-12 reps or more per set, as part of an upper-body or arm-focused workout.",
          difficultyAtCreation: 5,
          sets: 3,
          reps: 12,
          weight: 223,
        },
      ],
    };

    const results = await userA.client.post(`${BASE_URL}/api/v1/workouts/create`,
      newWorkoutData,
      {
        headers: { "Content-Type": "application/json" },
        validateStatus: () => true,
      }
    );

    const newWorkout = await Workout.findOne({ workoutName: "Pull Dayyyy" }).select("-__v -_id -updatedAt").lean();
    const newWorkoutJSON = JSON.parse(JSON.stringify(newWorkout));

    expect(results.status).to.equal(201);
    expect(results.data.data).to.deep.equal(newWorkoutJSON);

  });

  it("GET api/v1/workouts/:workoutId should return 200 status and the information for the workout with the specified uuid ",async () => {
    const results = await userA.client.get(`${BASE_URL}/api/v1/workouts/${ newWorkoutA.uuid }`) // TODO: Create workout before all tests
    const workout = await Workout.findOne({ uuid: newWorkoutA.uuid });
    const workoutJSON = JSON.parse(JSON.stringify(workout));
    
    expect(results.status).to.equal(200);
    expect(results.data.data).to.deep.equal(workoutJSON);
  });

  it("GET api/v1/workouts should return 200 and a list of all the workouts",async () => {
    //Finds all workouts in the database. Should only be 1.
    const workouts = await Workout.find({}).select("-__v -_id -updatedAt").lean();
    
    //Converts date objects in the mongoose document to strings
    const [firstWorkout] =  workouts;
    const firstWorkoutJSON = JSON.parse(JSON.stringify(firstWorkout));

    const results = await userA.client.get(`${BASE_URL}/api/v1/workouts`,
      {
        headers: { 'Content-Type': "application/json" },
        validateStatus: () => true,
      }
    );

    expect(results.status).to.equal(200);
    expect(results.data.data[0]).to.deep.equal(firstWorkoutJSON);

  });
  
  // TODO: Create test for other endpoints
  // it("GET api/v1/workouts/reports",async () => {});

  it("POST api/v1/meals should return 201 status and the new meal information", async () => {
    const newMealData = {
      creatorPublicId: newUserA.publicId,
      mealName: "Couse Couse",
      description: "Meal so nice they named it twice",
      ingredients: [
        {
          ingredientId: 2,
          ingredientName: "Couse Couse",
          quantity: 10,
          macros: {
            protein: 2,
            fat: 2,
            carbs: 2,
            fiber: 2,
            netCarbs: 2,
            calories: 2,
          },
          caloriesPer100G: 2,
          macrosPer100G: {
            protein: 2,
            fat: 2,
            carbs: 2,
            fiber: 2,
            netCarbs: 2,
            calories: 2,
          },
        },
      ],
      mealMacros: {
        protein: 2,
        fat: 2,
        carbs: 2,
        fiber: 2,
        netCarbs: 2,
        calories: 2,
      },
    };

    const results = await userA.client.post(
      `${BASE_URL}/api/v1/meals`,
      newMealData,
      {
        headers: { "Content-Type": "application/json" },
        validateStatus: () => true,
      }
    );

    const newMeal = await Meal.findOne({
      creatorPublicId: newUserA.publicId,
    }).lean();
    expect(newMeal).to.exist;
    expect(results.status).to.equal(201);
    expect(results.data.createdMeal).to.exist;
    expect(results.data.createdMeal).to.deep.equal({
      ...newMealData,
      uuid: newMeal.uuid,
    });
  });

  it("GET api/v1/meals returns 200 status and an empty array since no meals have been created", async () => {
    const results = await userA.client.get("api/v1/meals", {
      headers: { "Content-Type": "application/json" },
      validateStatus: () => true,
    });

    expect(results.status).to.equal(200);
    expect(results.data.allMeals.length).to.equal(0);
  });

  it("GET api/v1/meals/:mealId should return the meal information for the meal with the specified uuid", async () => {
    const mealData = {
      creatorPublicId: newUserA.publicId,
      mealName: "Couse Couse",
      description: "Meal so nice they named it twice",
      ingredients: [
        {
          ingredientId: 2,
          ingredientName: "Couse Couse",
          quantity: 10,
          macros: {
            protein: 2,
            fat: 2,
            carbs: 2,
            fiber: 2,
            netCarbs: 2,
            calories: 2,
          },
          caloriesPer100G: 2,
          macrosPer100G: {
            protein: 2,
            fat: 2,
            carbs: 2,
            fiber: 2,
            netCarbs: 2,
            calories: 2,
          },
        },
      ],
      mealMacros: {
        protein: 2,
        fat: 2,
        carbs: 2,
        fiber: 2,
        netCarbs: 2,
        calories: 2,
      },
    };

    const newMeal = await Meal.create(mealData);
    const results = await userA.client.get(`api/v1/meals/${newMeal.uuid}`, {
      headers: { "Content-Type": "application/json" },
      validationStatus: () => true,
    });

    expect(results.status).to.equal(200);
    expect(results.data.mealInfo).to.deep.equal({
      ...mealData,
      uuid: newMeal.uuid,
    });
  });

  it("GET api/v1/meals should return 200 status and an array of all created meals", async () => {
    const mealData = {
      creatorPublicId: newUserA.publicId,
      mealName: "Couse Couse",
      description: "Meal so nice they named it twice",
      ingredients: [
        {
          ingredientId: 2,
          ingredientName: "Couse Couse",
          quantity: 10,
          macros: {
            protein: 2,
            fat: 2,
            carbs: 2,
            fiber: 2,
            netCarbs: 2,
            calories: 2,
          },
          caloriesPer100G: 2,
          macrosPer100G: {
            protein: 2,
            fat: 2,
            carbs: 2,
            fiber: 2,
            netCarbs: 2,
            calories: 2,
          },
        },
      ],
      mealMacros: {
        protein: 2,
        fat: 2,
        carbs: 2,
        fiber: 2,
        netCarbs: 2,
        calories: 2,
      },
    };

    const newMeal = await Meal.create(mealData);
    const results = await userA.client.get("api/v1/meals", {
      headers: { "Content-Type": "application/json" },
      validateStatus: () => true,
    });
    expect(results.status).to.equal(200);
    expect(results.data.allMeals.length).to.equal(1);
    expect(results.data.allMeals[0]).to.deep.equal({
      ...mealData,
      uuid: newMeal.uuid,
    });
  });
});

/**
 *
 *   Use this to call populate and only get fields that are needed.
 *  .populate({
 *    path: "exerciseDetails",
 *    select: "exerciseId name difficulty category"
 *  })
 *
 *
 */


// describe("Validation Tests", function(){
//   before(function(){});
//   beforeEach(async () => {});
//   after(async () => {});
  
// });

// describe("Endpoint Database Creation Tests", function(){
//   before(function(){});
//   beforeEach(async () => {});
//   after(async () => {});
  
// });

// describe("Endpoint Database Fetching Tests", function(){
//   before(function(){});
//   beforeEach(async () => {});
//   after(async () => {});
  
// });