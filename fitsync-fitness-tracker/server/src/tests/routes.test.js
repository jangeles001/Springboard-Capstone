process.env.NODE_ENV = "test";

import { expect } from "chai";
import mongoose from "mongoose";
import { User } from "../models/userModel.js";
import { userA, userB } from "./helpers/axiosClients.js";
import { getEnv } from "../config/envConfig.js";
import { registerNewUser, revokeRefreshToken } from "../services/userService.js";
import redisClient from "../config/redisClient.js";

const BASE_URL = `http://localhost:${getEnv("PORT")}`;
let newUserA;

describe(" Test cases for authoriztion routes", function () {
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
    const { username, uuid, accessToken, refreshToken } = await registerNewUser(
      userData
    );

    await userA.jar.setCookie(`accessToken=${accessToken}`, BASE_URL);
    await userA.jar.setCookie(`refreshToken=${refreshToken}`, BASE_URL);

    newUserA = {
      username,
      uuid,
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
    expect(results.status).to.equal(201); // Checks proper status code
    expect(results.data.message).to.equal("Registration Successful!");

    // Checks if cookies have been set properly
    const cookies = await userB.jar.getCookies(BASE_URL);
    const cookieKeys = cookies.map((cookie) => cookie.key);
    expect(cookieKeys).to.include("accessToken");
    expect(cookieKeys).to.include("refreshToken");

    const newUserUUID = results.data.newUserInfo.uuid;
    const dbCheck = await User.findOne({ uuid: newUserUUID }); // Finds first match for newUserUUID in the database
    expect(dbCheck).to.exist; // Checks if db contains the newUser

    // Checks for well-formed newUserInfo results object
    expect(results.data.newUserInfo).to.deep.equal({
      username: newUser.username,
      uuid: newUserUUID,
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
    expect(results.status).to.equal(409); // Checks for proper 409 error code
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

    expect(results.status).to.equal(400); // Checks for proper 400 error code
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

    expect(results.status).to.equal(400); // Checks for proper 400 error code
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

    expect(results.status).to.equal(200); // Checks for proper 200 success code
    expect(results.data.message).to.equal(
      `${validatedUser.username} (UUID: ${validatedUser.uuid}) Logged In!`
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

    expect(results.status).to.equal(401); // Checks for proper 401 error code
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

    expect(results.status).to.equal(401); // Checks for proper 401 error code
    expect(results.data.error).to.equal(`INVALID_CREDENTIALS`);

    // Checks if cookies have not been set
    const cookies = await userB.jar.getCookies(BASE_URL);
    expect(cookies.length).to.equal(0); // Expects cookie jar to be empty
  });

  it("POST api/v1/auth/refresh should return 200 and a new set of access and refresh tokens should be set a cookies for the session", async () => {
    // Required to ensure a new token is generated
    await new Promise((resolve) => setTimeout(resolve, 940));
    // Stores initial cookies provided to the client upon user creation at start of test
    const initialCookies = await userA.jar.getCookies(BASE_URL);

    const results = await userA.client.post(
      `${BASE_URL}/api/v1/auth/refresh`,
      { userUUID: newUserA.uuid },
      {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
        validateStatus: () => true, // Allows for statuses outside of 200 range
      }
    );

    expect(results.status).to.equal(201); // Checks for proper 201 success code
    expect(results.data.message).to.equal(`TOKENS_REFRESHED`);

    // Checks if new cookies have been issued
    const newCookies = await userA.jar.getCookies(BASE_URL);
    expect(newCookies[0].value).to.not.equal(initialCookies[0].value);
    expect(newCookies[1].value).to.not.equal(initialCookies[1].value);
  });

  it("POST api/v1/auth/refresh should return 401 for using a revoked access token", async () => {
    // Gets cookies from userA client jar
    const cookies = await userA.jar.getCookies(BASE_URL);
    const refreshToken = cookies[1].value;

    // Revokes refreshToken, but doesn't delete it from the client session
    await revokeRefreshToken(refreshToken); 
    
    const results = await userA.client.post(
      `${BASE_URL}/api/v1/auth/refresh`, 
      { userUUID: newUserA.uuid},
      {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
        validateStatus: () => true, // Allows for statuses outside of 200 range
      });

      expect(results.status).to.equal(401); // Checks for 401 Unauthorized code
      expect(results.data.error).to.equal("UNAUTHORIZED");
  });

  it("POST api/v1/auth/refresh should return 401 for passing the incorrect userUUID for the provided refreshToken and revoke the token", async () => {
    // Gets cookies from userA client jar
    const cookies = await userA.jar.getCookies(BASE_URL);
    const refreshToken = cookies[1].value;

    // Passes userUUID that doesn't match the userUUID assigned to the token
    const results = await userA.client.post(
      `${BASE_URL}/api/v1/auth/refresh`, 
      { userUUID: "1"},
      {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
        validateStatus: () => true, // Allows for statuses outside of 200 range
      });

      expect(results.status).to.equal(401); // Checks for 401 Unauthorized code
      expect(results.data.error).to.equal("UNAUTHORIZED");

      const cookiesAfterRequest = await userA.jar.getCookies(BASE_URL);
      expect(cookiesAfterRequest.length).to.equal(0);

      // Checks cache for revoked token
      const cacheCheck = await redisClient.get(`revoked:${refreshToken}`);
      expect(cacheCheck).to.exist;
      expect(cacheCheck).to.equal("revoked");


  });

  // TODO: Test logout functionality
  // TODO: Create test for other endpoints
});
