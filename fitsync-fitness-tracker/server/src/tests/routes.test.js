process.env.NODE_ENV = "test";

import { expect } from "chai";
import mongoose from "mongoose";
import { User } from "../models/userModel.js";
import { Workout } from "../models/WorkoutModel.js"
import { userA, userB } from "./helpers/axiosClients.js";
import { getEnv } from "../config/envConfig.js";
import {
  registerNewUser,
  revokeRefreshToken,
} from "../services/userService.js";
import redisClient from "../config/redisClient.js";

const BASE_URL = `http://localhost:${getEnv("PORT")}`;
let newUserA;

describe(" Test cases for ALL routes", function () {
  before(async function () {
    await mongoose.connect(getEnv("MONGO_TEST_URI"));
  });

  // Clears all users and dogs from the db before each test.
  beforeEach(async () => {
    await User.deleteMany({});
    await redisClient.flushDb();
    await userA.jar.removeAllCookies();
    await userB.jar.removeAllCookies();

    const userData = {
      firstName: "notChris",
      lastName: "Chisterson",
      username: "christersonchrischris",
      password: "abc1234",
      height: "5'9\"",
      age: 30,
      weight: 221,
      email: "chirstersonchrisss@gmail.com",
    };

    // Creates new user before each test
    const { username, publicId, accessToken, refreshToken } = await registerNewUser(
      userData
    );

    await userA.jar.setCookie(`accessToken=${accessToken}`, BASE_URL);
    await userA.jar.setCookie(`refreshToken=${refreshToken}`, BASE_URL);

    newUserA = {
      username,
      publicId,
    };
  });

  after(async function () {
    await mongoose.connection.close();
  });

  it("POST api/v1/auth/register should register a new user and set both the access and refresh token as a cookie for the session", async () => {
    const newUser = {
      firstName: "Chris",
      lastName: "Christianson",
      username: "ChrisChrisChris",
      password: "abc12345",
      height: "5'9\"",
      age: 30,
      weight: 222,
      email: "ChrisChris@gmail.com",
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

    const newUserPublicId = results.data.newUserInfo.publicId;
    const dbCheck = await User.findOne({ publicId: newUserPublicId }); // Finds first match for newUserUUID in the database
    expect(dbCheck).to.exist; // Checks if db contains the newUser

    // Checks for well-formed newUserInfo results object
    expect(results.data.newUserInfo).to.deep.equal({
      username: newUser.username,
      publicId: dbCheck.publicId,
    });
  });

  it("POST api/v1/auth/register should return 409 error since the email address is already in use", async () => {
    // Same userData as the default user created before each test
    const newUser = {
      firstName: "notChris",
      lastName: "Chisterson",
      username: "christersonchrischris",
      password: "abc1234",
      height: "5'9\"",
      age: 30,
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
    expect(results.status).to.equal(409);
    expect(results.data.error).to.equal("EMAIL_ALREADY_REGISTERED");

    // Checks if cookies not been set
    const cookies = await userB.jar.getCookies(BASE_URL);
    expect(cookies.length).to.equal(0); // Expects cookie jar to be empty
  });

  it("POST api/v1/auth/register should return 400 error validation failure age and first name is required", async () => {
    // Same userData as the default user created before each test
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
    // Same userData as the default user created before each test
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
    // Same userData as the default user created before each test
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
    expect(results.data.error).to.equal(`INVALID_CREDENTIALS`);

    // Checks if cookies have not been set
    const cookies = await userB.jar.getCookies(BASE_URL);
    expect(cookies.length).to.equal(0); // Expects cookie jar to be empty
  });

  it("POST api/v1/auth/login should return 401 invalid credentials (username)", async () => {
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
    expect(results.data.error).to.equal(`INVALID_CREDENTIALS`);

    // Checks if cookies have not been set
    const cookies = await userB.jar.getCookies(BASE_URL);
    expect(cookies.length).to.equal(0); // Expects cookie jar to be empty
  });

  it("GET api/v1/auth/refresh should return 200 and a new set of access and refresh tokens should be set a cookies for the session", async () => {
    // Required to ensure a new token is generated
    await new Promise((resolve) => setTimeout(resolve, 940));

    // Stores initial cookies provided to the client upon user creation at start of test
    const initialCookies = await userA.jar.getCookies(BASE_URL);

    const results = await userA.client.get(
      `${BASE_URL}/api/v1/auth/refresh`,
      {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
        validateStatus: () => true, // Allows for statuses outside of 200 range
      }
    );

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

    const results = await userA.client.get(
      `${BASE_URL}/api/v1/auth/refresh`,
      {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
        validateStatus: () => true, // Allows for statuses outside of 200 range
      }
    );

    expect(results.status).to.equal(401);
    expect(results.data.error).to.equal("UNAUTHORIZED");
  });

  // TODO: Test logout functionality
  it("GET api/v1/auth/logout should return 200 successful logout", async () => {
    // Gets cookies from userA client jar
    const cookies = await userA.jar.getCookies(BASE_URL);
    const refreshToken = cookies[1].value;

    const results = await userA.client.get(
      `${BASE_URL}/api/v1/auth/logout`,
      {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
        validateStatus: () => true, // Allows for statuses outside of 200 range
      }
    );

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

    const results = await userA.client.get(
      `${BASE_URL}/api/v1/auth/logout`,
      {
        headers: { "Content-Type": "application/json" },
        validateStatus: () => true, // Allows for statuses outside of 200 range
      }
    );

    expect(results.status).to.equal(200);
    expect(results.data.message).to.equal("Log Out Successful!");
  });

  it("GET api/v1/users/me should return 200 and display the private information for the user", async () => {
    const results = await userA.client.get(`${BASE_URL}/api/v1/user/${newUserA.publicId}`,
      {
        headers: { "Content-Type": "application/json"},
        validateStatus: () => true,
      }
    );

    const user = User.findOne({ publicId: newUserA.publicId })

    expect(results.status).to.equal(200)
    expect(results.data.username).to.equal(newUserA.username);
    expect(results.data.age).to.equal(user.age);
    expect(results.data.height).to.equal(user.height);
    
  })

  it("GET api/v1/users/me should return 200 and display the logged in users' private information", async () => {
    // userData used to create the test user
    const userData = {
      publicId: newUserA.publicId,
      firstName: "notChris",
      lastName: "Chisterson",
      username: "christersonchrischris",
      height: "5'9\"",
      age: 30,
      weight: 221,
    };

    const results = await userA.client.get(`${BASE_URL}/api/v1/user/me`,
      {
        headers: { "Content-Type": "application/json"},
        validateStatus: () => true,
      }
    );

    expect(results.status).to.equal(200)
    expect(results.data).to.deep.equal(userData)
  })

  it("POST api/v1/users/me should return 200 and display the logged in users' private information", async () => {
    // Gets user from database
    const user = User.findOne({ publicId: newUserA.publicId });
    
    // Saves initialPrivateData before any changes are made
    const initialPrivateData = {
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      height: user.heigth,
      age: user.age,
      weight: user.weight,
    }

    // New private data
    const newPrivateUserData = {
      firstName: "Chrisssssss",
      lastName: "Chistersonson",
      username: "actuallymightbechris",
      height: "5'7\"",
      age: 31,
      weight: 222,
    };

    const results = await userA.client.post(`${BASE_URL}/api/v1/user/me`,
      newPrivateUserData,
      {
        headers: { "Content-Type": "application/json"},
        validateStatus: () => true,
      }
    );

    expect(results.status).to.equal(200)
    expect(results.data).to.deep.equal(newPrivateUserData);
    expect(newPrivateUserData).to.not.deep.equal(initialPrivateData);
  })
  
  it("GET api/v1/users/:user should return 200 and display the public information for the user", async () => {
    const results = await userA.client.get(`${BASE_URL}/api/v1/user/${newUserA.publicId}`,
      {
        headers: { "Content-Type": "application/json"},
        validateStatus: () => true,
      }
    );

    const user = User.findOne({ publicId: newUserA.publicId })

    expect(results.status).to.equal(200)
    expect(results.data.username).to.equal(user.username);
    expect(results.data.age).to.equal(user.age);
    expect(results.data.height).to.equal(user.height);

    // TODO: Determine how much is too much information .-.
    
  })

  it("GET api/v1/users/:user/workouts should return 200 and display the created workouts for the user with the corresponding publicId", async () => {
    const workouts = await Workout.find({ userPublicId: newUserA.publicId });

    const results = await userA.client.get(`${BASE_URL}/api/v1/user/${userA.publicId}/workouts`,
      {
        headers: { "Content-Type": "application/json"},
        validateStatus: () => true,
      }
    );

    expect(results.status).to.equal(200)
    expect(results.data.workouts.length).to.equal(0);
  })

  it("GET api/v1/users/:user/workouts should return 200 and display the created workouts for the user with the corresponding publicId", async () => {
    const workoutInformation = {
      creatorPublicId: newUserA.publicId,
      workoutName: "Push Dayyyy",
      exercises:[
        {id: "57", sets: 3, reps: 8, weight:220},
        {id: "31", sets: 3, reps: 10, weight:221},
        {id: "56", sets: 3, reps: 8, weight:222},
        {id: "805", sets: 3, reps: 12, weight:223},
      ] 
    }

    const workouts = await Workout.find({ userPublicId: newUserA.publicId });

    const results = await userA.client.get(`${BASE_URL}/api/v1/user/${userA.publicId}/workouts`,
      {
        headers: { "Content-Type": "application/json"},
        validateStatus: () => true,
      }
    );

    expect(results.status).to.equal(200)
    expect(results.data.workouts.length).to.equal(workouts);
  })

  // TODO: Create test for other endpoints
});
