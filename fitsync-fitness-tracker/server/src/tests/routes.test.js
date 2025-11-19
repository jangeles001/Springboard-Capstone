process.env.NODE_ENV = "test";

import chai from "chai";
import axios from "axios";
import mongoose from "mongoose";
import expect from "chai.expect";
import User from "../schemas/newUserZodSchema.js";
import { userA, userB } from "./helpers/axiosClients.js";
import { getEnv } from "../config/envConfig.js";

const BASE_URL = `http://localhost:${getEnv("PORT")}`;

let testUserA;
let testUserB;

describe(" Test cases for Auth routes", function () {
  before(async function () {
    await mongoose.connect(getEnv("MONGO_TEST_URI"));
  });

  // Clears all users and dogs from the db before each test.
  beforeEach(async () => {
    await User.deleteMany({});

    // Creates a user to pass auth check before each test
    const { user, token } = await registerUser("User1", "abc123");

    await userA.jar.setCookie(`token=${token}`, BASE_URL);

    testUserA = user;
  });

  after(async function () {
    await mongoose.connection.close();
  });

    it("POST api/v1/auth/register should register a new user and set both the access and refresh token as a cookie to the session", async () => {
        const results = userB.client.post(`${BASE_URL}/api/v1/register`);


    });
});
