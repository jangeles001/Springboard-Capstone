process.env.NODE_ENV = "test";

import { expect } from "chai";
import mongoose from "mongoose";
import { User } from "../models/userModel.js";
import { Workout } from "../models/workoutModel.js";
import { WorkoutLog } from "../models/workoutLogModel.js";
import { WorkoutCollection } from "../models/workoutCollectionModel.js";
import { Meal } from "../models/mealModel.js";
import { MealLog } from "../models/mealLogModel.js";
import { MealCollection } from "../models/mealCollectionModel.js";
import { userA, userB } from "./helpers/axiosClients.js";
import { getEnv } from "../config/envConfig.js";
import { registerNewUser } from "../services/userService.js";
import redisClient from "../config/redisClient.js";

const BASE_URL = `http://localhost:${getEnv("PORT")}`;
let newUserA;
let newUserB;
let newWorkoutA;
let newMealA;

describe("Workout Creation, Logging, and Deletion Tests", function () {
  before(async function () {
    await mongoose.connect(getEnv("MONGO_TEST_URI"));
  });

  beforeEach(async () => {
    // Clear all collections
    await Promise.all([
      User.deleteMany({}),
      Workout.deleteMany({}),
      WorkoutLog.deleteMany({}),
      WorkoutCollection.deleteMany({}),
      Meal.deleteMany({}),
      MealLog.deleteMany({}),
      MealCollection.deleteMany({}),
      redisClient.flushDb(),
      userA.jar.removeAllCookies(),
      userB.jar.removeAllCookies(),
    ]);

    // Create User A
    const userDataA = {
      firstName: "Alice",
      lastName: "Anderson",
      username: "alice_fitness",
      password: "password123",
      email: "alice@fitness.com",
      promoConsent: true,
      agreeToTerms: true,
      profile: {
        heightInches: 66, // 5'6"
        weightLbs: 140,
        age: 28,
        gender: "female",
        activityLevel: "moderate",
        goalType: "maintain",
        lastAiRecommendationAt: null,
      },
    };

    const { accessToken, refreshToken } = await registerNewUser(userDataA);

    await userA.jar.setCookie(`accessToken=${accessToken}`, BASE_URL);
    await userA.jar.setCookie(`refreshToken=${refreshToken}`, BASE_URL);

    // Get user data from database
    const userARecord = await User.findOne({ email: userDataA.email });
    newUserA = {
      username: userARecord.username,
      publicId: userARecord.publicId,
    };

    // Create User B
    const userDataB = {
      firstName: "Bob",
      lastName: "Builder",
      username: "bob_lifts",
      password: "password456",
      email: "bob@fitness.com",
      promoConsent: true,
      agreeToTerms: true,
      profile: {
        heightInches: 70, // 5'10"
        weightLbs: 180,
        age: 32,
        gender: "male",
        activityLevel: "active",
        goalType: "bulk",
        lastAiRecommendationAt: null,
      },
    };

    const userBTokens = await registerNewUser(userDataB);
    await userB.jar.setCookie(
      `accessToken=${userBTokens.accessToken}`,
      BASE_URL,
    );
    await userB.jar.setCookie(
      `refreshToken=${userBTokens.refreshToken}`,
      BASE_URL,
    );

    // Get user data from database
    const userBRecord = await User.findOne({ email: userDataB.email });
    newUserB = {
      username: userBRecord.username,
      publicId: userBRecord.publicId,
    };

    // Create a workout for User A for testing (AFTER users are created)
    const workoutData = {
      creatorPublicId: newUserA.publicId,
      workoutName: "Leg Day",
      workoutDuration: 60,
      exercises: [
        {
          exerciseId: "57",
          exerciseName: "Squats",
          description: "Barbell squats",
          muscles: ["quadriceps", "glutes"],
          difficultyAtCreation: 7,
          reps: 10,
          weight: 185,
        },
        {
          exerciseId: "31",
          exerciseName: "Lunges",
          description: "Walking lunges",
          muscles: ["quadriceps", "glutes"],
          difficultyAtCreation: 5,
          reps: 12,
          weight: 50,
        },
      ],
    };

    const workout = await Workout.create(workoutData);
    newWorkoutA = {
      uuid: workout.uuid,
      creatorPublicId: workout.creatorPublicId,
    };

    const mealData = {
      creatorPublicId: newUserA.publicId,
      mealName: "Protein Shake",
      mealDescription: "Post-workout protein shake",
      ingredients: [
        {
          ingredientId: "12345",
          ingredientName: "Whey Protein",
          quantity: 30,
          macros: {
            protein: 24,
            fat: 1,
            carbs: 3,
            fiber: 0,
            netCarbs: 3,
            calories: 120,
          },
          caloriesPer100G: 400,
          macrosPer100G: {
            protein: 80,
            fat: 3,
            carbs: 10,
            fiber: 0,
            netCarbs: 10,
            calories: 400,
          },
        },
      ],
      mealMacros: {
        protein: 24,
        fat: 1,
        carbs: 3,
        fiber: 0,
        netCarbs: 3,
        calories: 120,
      },
    };

    const meal = await Meal.create(mealData);
    newMealA = {
      uuid: meal.uuid,
      creatorPublicId: meal.creatorPublicId,
    };
  });

  after(async function () {
    await mongoose.connection.close();
  });

  // ========== AUTH TESTS ==========

  describe("POST /api/v1/auth/register - User Registration", () => {
    it("Should return 201 and register a new user with valid data", async () => {
      const userData = {
        firstName: "John",
        lastName: "Doe",
        username: "johndoe",
        password: "securePassword123",
        email: "john@example.com",
        promoConsent: true,
        agreeToTerms: true,
        profile: {
          heightInches: 70,
          weightLbs: 180,
          age: 25,
          gender: "male",
          activityLevel: "moderate",
          goalType: "maintain",
        },
      };

      const response = await userA.client.post(
        `${BASE_URL}/api/v1/auth/register`,
        userData,
        {
          headers: { "Content-Type": "application/json" },
          validateStatus: () => true,
        },
      );

      expect(response.status).to.equal(201);
      expect(response.data.message).to.equal("Registration Successful!");

      // Verify user was created in database
      const user = await User.findOne({ email: userData.email });
      expect(user).to.exist;
      expect(user.username).to.equal("johndoe");
      expect(user.firstName).to.equal("John");
      expect(user.verified).to.be.false; // Default unverified

      // Verify cookies were set
      const cookies = response.headers["set-cookie"];
      expect(cookies).to.exist;
      expect(cookies.some((c) => c.includes("accessToken"))).to.be.true;
      expect(cookies.some((c) => c.includes("refreshToken"))).to.be.true;
    });

    it("Should return 400 for missing required fields", async () => {
      const invalidUserData = {
        firstName: "John",
        lastName: "Doe",
        // Missing username, password, email
        promoConsent: true,
        agreeToTerms: true,
        profile: {
          heightInches: 70,
          weightLbs: 180,
          age: 25,
          gender: "male",
          activityLevel: "moderate",
          goalType: "maintain",
        },
      };

      const response = await userA.client.post(
        `${BASE_URL}/api/v1/auth/register`,
        invalidUserData,
        {
          headers: { "Content-Type": "application/json" },
          validateStatus: () => true,
        },
      );

      expect(response.status).to.equal(400);
      expect(response.data.error).to.exist;
    });

    it("Should return 409 for duplicate email", async () => {
      const userData = {
        firstName: "Jane",
        lastName: "Smith",
        username: "janesmith",
        password: "password123",
        email: "duplicate@example.com",
        promoConsent: true,
        agreeToTerms: true,
        profile: {
          heightInches: 65,
          weightLbs: 130,
          age: 28,
          gender: "female",
          activityLevel: "active",
          goalType: "cut",
        },
      };

      // Register first user
      await registerNewUser(userData);

      // Try to register with same email
      const response = await userA.client.post(
        `${BASE_URL}/api/v1/auth/register`,
        userData,
        {
          headers: { "Content-Type": "application/json" },
          validateStatus: () => true,
        },
      );

      expect(response.status).to.equal(409);
      expect(response.data.message).to.include("EMAIL");
    });

    it("Should calculate nutrition goals automatically", async () => {
      const userData = {
        firstName: "Alex",
        lastName: "Fitness",
        username: "alexfit",
        password: "password123",
        email: "alex@fitness.com",
        promoConsent: true,
        agreeToTerms: true,
        profile: {
          heightInches: 68,
          weightLbs: 160,
          age: 30,
          gender: "male",
          activityLevel: "active",
          goalType: "bulk",
        },
      };

      await userA.client.post(`${BASE_URL}/api/v1/auth/register`, userData, {
        headers: { "Content-Type": "application/json" },
        validateStatus: () => true,
      });

      const user = await User.findOne({ email: userData.email });
      expect(user.nutritionGoals).to.exist;
      expect(user.nutritionGoals.calories).to.be.a("number");
      expect(user.nutritionGoals.protein).to.be.a("number");
      expect(user.nutritionGoals.carbs).to.be.a("number");
      expect(user.nutritionGoals.fats).to.be.a("number");
    });
  });

  describe("POST /api/v1/auth/login - User Login", () => {
    beforeEach(async () => {
      // Create a user for login tests
      const userData = {
        firstName: "Test",
        lastName: "User",
        username: "testuser",
        password: "password123",
        email: "test@example.com",
        promoConsent: true,
        agreeToTerms: true,
        profile: {
          heightInches: 70,
          weightLbs: 170,
          age: 27,
          gender: "male",
          activityLevel: "moderate",
          goalType: "maintain",
        },
      };

      await registerNewUser(userData);
      const user = await User.findOne({ email: userData.email });
      newUserA = { username: user.username, publicId: user.publicId };
    });

    it("Should return 200 and log in with valid credentials", async () => {
      const response = await userA.client.post(
        `${BASE_URL}/api/v1/auth/login`,
        {
          email: "test@example.com",
          password: "password123",
          reCaptchaToken: "fkjldhsakljfhdkjsahfkljdshblajfjsda",
        },
        {
          headers: { "Content-Type": "application/json" },
          validateStatus: () => true,
        },
      );

      expect(response.status).to.equal(200);
      expect(response.data.message).to.include("Logged In");

      // Verify cookies were set
      const cookies = response.headers["set-cookie"];
      expect(cookies).to.exist;
      expect(cookies.some((c) => c.includes("accessToken"))).to.be.true;
      expect(cookies.some((c) => c.includes("refreshToken"))).to.be.true;
    });

    it("Should return 401 for invalid email", async () => {
      const response = await userA.client.post(
        `${BASE_URL}/api/v1/auth/login`,
        {
          email: "nonexistent@example.com",
          password: "password123",
          reCaptchaToken: "fkjldhsakljfhdkjsahfkljdshblajfjsda",
        },
        {
          headers: { "Content-Type": "application/json" },
          validateStatus: () => true,
        },
      );

      expect(response.status).to.equal(401);
    });

    it("Should return 401 for invalid password", async () => {
      const response = await userA.client.post(
        `${BASE_URL}/api/v1/auth/login`,
        {
          email: "test@example.com",
          password: "wrongpassword",
          reCaptchaToken: "fkjldhsakljfhdkjsahfkljdshblajfjsda",
        },
        {
          headers: { "Content-Type": "application/json" },
          validateStatus: () => true,
        },
      );

      expect(response.status).to.equal(401);
    });
  });

  describe("GET /api/v1/auth/logout - User Logout", () => {
    beforeEach(async () => {
      const userData = {
        firstName: "Logout",
        lastName: "Test",
        username: "logouttest",
        password: "password123",
        email: "logout@example.com",
        promoConsent: true,
        agreeToTerms: true,
        profile: {
          heightInches: 68,
          weightLbs: 150,
          age: 26,
          gender: "female",
          activityLevel: "light",
          goalType: "cut",
        },
      };

      const tokens = await registerNewUser(userData);
      await userA.jar.setCookie(`accessToken=${tokens.accessToken}`, BASE_URL);
      await userA.jar.setCookie(
        `refreshToken=${tokens.refreshToken}`,
        BASE_URL,
      );
    });

    it("Should return 200 and clear cookies on logout", async () => {
      const response = await userA.client.get(
        `${BASE_URL}/api/v1/auth/logout`,
        {
          validateStatus: () => true,
        },
      );

      expect(response.status).to.equal(200);
      expect(response.data.message).to.equal("Log Out Successful!");

      // Verify cookies were cleared
      const cookies = response.headers["set-cookie"];
      if (cookies) {
        cookies.forEach((cookie) => {
          if (
            cookie.includes("accessToken") ||
            cookie.includes("refreshToken")
          ) {
            expect(cookie).to.match(/(Max-Age=0|Expires=Thu, 01 Jan 1970)/);
          }
        });
      }
    });
  });

  describe("GET /api/v1/auth/me - Get Current User", () => {
    beforeEach(async () => {
      const userData = {
        firstName: "Current",
        lastName: "User",
        username: "currentuser",
        password: "password123",
        email: "current@example.com",
        promoConsent: true,
        agreeToTerms: true,
        profile: {
          heightInches: 66,
          weightLbs: 140,
          age: 29,
          gender: "female",
          activityLevel: "moderate",
          goalType: "maintain",
        },
      };

      const tokens = await registerNewUser(userData);
      await userA.jar.setCookie(`accessToken=${tokens.accessToken}`, BASE_URL);
      await userA.jar.setCookie(
        `refreshToken=${tokens.refreshToken}`,
        BASE_URL,
      );

      const user = await User.findOne({ email: userData.email });
      newUserA = { username: user.username, publicId: user.publicId };
    });

    it("Should return 200 and current user data when authenticated", async () => {
      const response = await userA.client.get(`${BASE_URL}/api/v1/auth/me`, {
        validateStatus: () => true,
      });

      expect(response.status).to.equal(200);
      expect(response.data.data).to.have.property("username");
      expect(response.data.data).to.have.property("publicId");
      expect(response.data.data.username).to.equal("currentuser");
    });

    it("Should return 401 when not authenticated", async () => {
      await userA.jar.removeAllCookies();

      const response = await userA.client.get(`${BASE_URL}/api/v1/auth/me`, {
        validateStatus: () => true,
      });

      expect(response.status).to.equal(401);
    });
  });

  describe("POST /api/v1/auth/reset-password - Initiate Password Reset", () => {
    beforeEach(async () => {
      const userData = {
        firstName: "Reset",
        lastName: "Password",
        username: "resetuser",
        password: "oldpassword123",
        email: "reset@example.com",
        promoConsent: true,
        agreeToTerms: true,
        profile: {
          heightInches: 72,
          weightLbs: 190,
          age: 35,
          gender: "male",
          activityLevel: "active",
          goalType: "bulk",
        },
      };

      await registerNewUser(userData);
    });

    it("Should return 200 and send reset email for valid email", async () => {
      const response = await userA.client.post(
        `${BASE_URL}/api/v1/auth/reset-password`,
        { email: "reset@example.com" },
        {
          headers: { "Content-Type": "application/json" },
          validateStatus: () => true,
        },
      );

      expect(response.status).to.equal(200);
      expect(response.data.message).to.include("check your email");

      // Verify token was stored in Redis (in test env, emails aren't sent)
      const keys = await redisClient.keys("passwordResetVerificationToken:*");
      expect(keys.length).to.be.greaterThan(0);
    });

    it("Should return 404 for non-existent email", async () => {
      const response = await userA.client.post(
        `${BASE_URL}/api/v1/auth/reset-password`,
        { email: "nonexistent@example.com" },
        {
          headers: { "Content-Type": "application/json" },
          validateStatus: () => true,
        },
      );

      expect(response.status).to.equal(404);
    });
  });

  // ========== USER ENDPOINT TESTS ==========

  describe("GET /api/v1/users/me - Get Private User Information", () => {
    beforeEach(async () => {
      const userData = {
        firstName: "Private",
        lastName: "Info",
        username: "privateuser",
        password: "password123",
        email: "private@example.com",
        promoConsent: true,
        agreeToTerms: true,
        profile: {
          heightInches: 67,
          weightLbs: 145,
          age: 24,
          gender: "female",
          activityLevel: "moderate",
          goalType: "cut",
        },
      };

      const tokens = await registerNewUser(userData);
      await userA.jar.setCookie(`accessToken=${tokens.accessToken}`, BASE_URL);
      await userA.jar.setCookie(
        `refreshToken=${tokens.refreshToken}`,
        BASE_URL,
      );

      const user = await User.findOne({ email: userData.email });
      newUserA = { username: user.username, publicId: user.publicId };
    });

    it("Should return 200 and private user information", async () => {
      const response = await userA.client.get(`${BASE_URL}/api/v1/users/me`, {
        validateStatus: () => true,
      });

      expect(response.status).to.equal(200);
      expect(response.data.data).to.have.property("firstName");
      expect(response.data.data).to.have.property("lastName");
      expect(response.data.data).to.have.property("username");
      expect(response.data.data).to.have.property("publicId");
      expect(response.data.data.username).to.equal("privateuser");
    });

    it("Should return 401 when not authenticated", async () => {
      await userA.jar.removeAllCookies();

      const response = await userA.client.get(`${BASE_URL}/api/v1/users/me`, {
        validateStatus: () => true,
      });

      expect(response.status).to.equal(401);
    });
  });

  describe("PATCH /api/v1/users/me - Update Private User Information", () => {
    beforeEach(async () => {
      const userData = {
        firstName: "Update",
        lastName: "Test",
        username: "updateuser",
        password: "password123",
        email: "update@example.com",
        promoConsent: true,
        agreeToTerms: true,
        profile: {
          heightInches: 69,
          weightLbs: 175,
          age: 30,
          gender: "male",
          activityLevel: "moderate",
          goalType: "maintain",
        },
      };

      const tokens = await registerNewUser(userData);
      await userA.jar.setCookie(`accessToken=${tokens.accessToken}`, BASE_URL);
      await userA.jar.setCookie(
        `refreshToken=${tokens.refreshToken}`,
        BASE_URL,
      );
    });

    it("Should return 200 and update user information", async () => {
      const updateData = {
        firstName: "UpdatedFirst",
        lastName: "UpdatedLast",
      };

      const response = await userA.client.patch(
        `${BASE_URL}/api/v1/users/me`,
        updateData,
        {
          headers: { "Content-Type": "application/json" },
          validateStatus: () => true,
        },
      );

      expect(response.status).to.equal(200);
      expect(response.data.message).to.equal(
        "Information Updated Successfully!",
      );
      expect(response.data.data.firstName).to.equal("UpdatedFirst");
      expect(response.data.data.lastName).to.equal("UpdatedLast");

      // Verify in database
      const user = await User.findOne({ email: "update@example.com" });
      expect(user.firstName).to.equal("UpdatedFirst");
      expect(user.lastName).to.equal("UpdatedLast");
    });

    it("Should return 401 when not authenticated", async () => {
      await userA.jar.removeAllCookies();

      const response = await userA.client.patch(
        `${BASE_URL}/api/v1/users/me`,
        { firstName: "Test" },
        {
          headers: { "Content-Type": "application/json" },
          validateStatus: () => true,
        },
      );

      expect(response.status).to.equal(401);
    });
  });

  describe("GET /api/v1/users/:userPublicId - Get Public User Information", () => {
    beforeEach(async () => {
      const userData = {
        firstName: "Public",
        lastName: "User",
        username: "publicuser",
        password: "password123",
        email: "public@example.com",
        promoConsent: true,
        agreeToTerms: true,
        profile: {
          heightInches: 71,
          weightLbs: 185,
          age: 28,
          gender: "male",
          activityLevel: "active",
          goalType: "bulk",
        },
      };

      const tokens = await registerNewUser(userData);
      await userA.jar.setCookie(`accessToken=${tokens.accessToken}`, BASE_URL);
      await userA.jar.setCookie(
        `refreshToken=${tokens.refreshToken}`,
        BASE_URL,
      );

      const user = await User.findOne({ email: userData.email });
      newUserA = { username: user.username, publicId: user.publicId };
    });

    it("Should return 200 and public user information", async () => {
      const response = await userA.client.get(
        `${BASE_URL}/api/v1/users/${newUserA.publicId}`,
        {
          validateStatus: () => true,
        },
      );

      expect(response.status).to.equal(200);
      expect(response.data.data).to.have.property("username");
      expect(response.data.data).to.have.property("publicId");
      expect(response.data.data).to.have.property("memberSince");
      expect(response.data.data).to.not.have.property("email"); // Email is private
      expect(response.data.data).to.not.have.property("passwordHash");
    });

    it("Should return 404 for non-existent user", async () => {
      const response = await userA.client.get(
        `${BASE_URL}/api/v1/users/nonexistent-id`,
        {
          validateStatus: () => true,
        },
      );

      expect(response.status).to.equal(404);
    });
  });

  describe("GET /api/v1/users/workouts - Get User Workouts", () => {
    beforeEach(async () => {
      const userData = {
        firstName: "Workout",
        lastName: "User",
        username: "workoutuser",
        password: "password123",
        email: "workout@example.com",
        promoConsent: true,
        agreeToTerms: true,
        profile: {
          heightInches: 68,
          weightLbs: 160,
          age: 26,
          gender: "male",
          activityLevel: "active",
          goalType: "maintain",
        },
      };

      const tokens = await registerNewUser(userData);
      await userA.jar.setCookie(`accessToken=${tokens.accessToken}`, BASE_URL);
      await userA.jar.setCookie(
        `refreshToken=${tokens.refreshToken}`,
        BASE_URL,
      );

      const user = await User.findOne({ email: userData.email });
      newUserA = { username: user.username, publicId: user.publicId };

      // Create some workouts for the user
      const workout1 = await Workout.create({
        creatorPublicId: newUserA.publicId,
        workoutName: "Chest Day",
        workoutDuration: 45,
        exercises: [],
      });

      await WorkoutCollection.create({
        userPublicId: newUserA.publicId,
        workoutUUID: workout1.uuid,
      });
    });

    it("Should return 200 and user's workout collection", async () => {
      const response = await userA.client.get(
        `${BASE_URL}/api/v1/users/workouts`,
        {
          validateStatus: () => true,
        },
      );

      expect(response.status).to.equal(200);
      expect(response.data.data).to.have.property("workouts");
      expect(response.data.data.workouts).to.be.an("array");
    });

    it("Should return 401 when not authenticated", async () => {
      await userA.jar.removeAllCookies();

      const response = await userA.client.get(
        `${BASE_URL}/api/v1/users/workouts`,
        {
          validateStatus: () => true,
        },
      );

      expect(response.status).to.equal(401);
    });
  });

  describe("GET /api/v1/users/meals - Get User Meals", () => {
    beforeEach(async () => {
      const userData = {
        firstName: "Meal",
        lastName: "User",
        username: "mealuser",
        password: "password123",
        email: "meal@example.com",
        promoConsent: true,
        agreeToTerms: true,
        profile: {
          heightInches: 64,
          weightLbs: 125,
          age: 27,
          gender: "female",
          activityLevel: "moderate",
          goalType: "cut",
        },
      };

      const tokens = await registerNewUser(userData);
      await userA.jar.setCookie(`accessToken=${tokens.accessToken}`, BASE_URL);
      await userA.jar.setCookie(
        `refreshToken=${tokens.refreshToken}`,
        BASE_URL,
      );

      const user = await User.findOne({ email: userData.email });
      newUserA = { username: user.username, publicId: user.publicId };
    });

    it("Should return 200 and user's meal collection", async () => {
      const response = await userA.client.get(
        `${BASE_URL}/api/v1/users/meals`,
        {
          validateStatus: () => true,
        },
      );

      expect(response.status).to.equal(200);
      expect(response.data.data).to.have.property("meals");
      expect(response.data.data.meals).to.be.an("array");
    });

    it("Should return 401 when not authenticated", async () => {
      await userA.jar.removeAllCookies();

      const response = await userA.client.get(
        `${BASE_URL}/api/v1/users/meals`,
        {
          validateStatus: () => true,
        },
      );

      expect(response.status).to.equal(401);
    });
  });

  describe("GET /api/v1/users/reports/workouts - Generate Workout Reports", () => {
    beforeEach(async () => {
      const userData = {
        firstName: "Report",
        lastName: "User",
        username: "reportuser",
        password: "password123",
        email: "report@example.com",
        promoConsent: true,
        agreeToTerms: true,
        profile: {
          heightInches: 70,
          weightLbs: 175,
          age: 29,
          gender: "male",
          activityLevel: "active",
          goalType: "maintain",
        },
      };

      const tokens = await registerNewUser(userData);
      await userA.jar.setCookie(`accessToken=${tokens.accessToken}`, BASE_URL);
      await userA.jar.setCookie(
        `refreshToken=${tokens.refreshToken}`,
        BASE_URL,
      );

      const user = await User.findOne({ email: userData.email });
      newUserA = { username: user.username, publicId: user.publicId };
    });

    it("Should return 201 and workout report data", async () => {
      const response = await userA.client.get(
        `${BASE_URL}/api/v1/users/reports/workouts?range=all`,
        {
          validateStatus: () => true,
        },
      );

      expect(response.status).to.equal(201);
      expect(response.data.message).to.equal("Reports generated!");
      expect(response.data.data).to.exist;
    });

    it("Should return 401 when not authenticated", async () => {
      await userA.jar.removeAllCookies();

      const response = await userA.client.get(
        `${BASE_URL}/api/v1/users/reports/workouts?range=all`,
        {
          validateStatus: () => true,
        },
      );

      expect(response.status).to.equal(401);
    });
  });

  describe("GET /api/v1/users/reports/nutrition - Generate Nutrition Reports", () => {
    beforeEach(async () => {
      const userData = {
        firstName: "Nutrition",
        lastName: "User",
        username: "nutritionuser",
        password: "password123",
        email: "nutrition@example.com",
        promoConsent: true,
        agreeToTerms: true,
        profile: {
          heightInches: 65,
          weightLbs: 135,
          age: 25,
          gender: "female",
          activityLevel: "moderate",
          goalType: "maintain",
        },
      };

      const tokens = await registerNewUser(userData);
      await userA.jar.setCookie(`accessToken=${tokens.accessToken}`, BASE_URL);
      await userA.jar.setCookie(
        `refreshToken=${tokens.refreshToken}`,
        BASE_URL,
      );
    });

    it("Should return 201 and nutrition report data", async () => {
      const response = await userA.client.get(
        `${BASE_URL}/api/v1/users/reports/nutrition?range=all`,
        {
          validateStatus: () => true,
        },
      );

      expect(response.status).to.equal(201);
      expect(response.data.message).to.equal("Reports generated!");
      expect(response.data.data).to.exist;
      expect(response.data.data).to.have.property("nutritionGoals");
    });

    it("Should return 401 when not authenticated", async () => {
      await userA.jar.removeAllCookies();

      const response = await userA.client.get(
        `${BASE_URL}/api/v1/users/reports/nutrition?range=all`,
        {
          validateStatus: () => true,
        },
      );

      expect(response.status).to.equal(401);
    });
  });

  // ========== WORKOUT CREATION TESTS ==========

  describe("POST /api/v1/workouts/create - Create and Log Workout", () => {
    it("Should return 201 and create workout template, log entry, and add to collection", async () => {
      const newWorkoutData = {
        creatorPublicId: newUserA.publicId,
        workoutName: "Upper Body Blast",
        workoutDuration: 45,
        exercises: [
          {
            exerciseId: "100",
            exerciseName: "Bench Press",
            description: "Flat barbell bench press",
            muscles: ["chest", "triceps"],
            difficultyAtCreation: 8,
            reps: 8,
            weight: 225,
          },
          {
            exerciseId: "101",
            exerciseName: "Pull-ups",
            description: "Wide grip pull-ups",
            muscles: ["back", "biceps"],
            difficultyAtCreation: 7,
            reps: 10,
            weight: 0,
          },
        ],
      };

      const results = await userA.client.post(
        `${BASE_URL}/api/v1/workouts/create`,
        newWorkoutData,
        {
          headers: { "Content-Type": "application/json" },
          validateStatus: () => true,
        },
      );

      expect(results.status).to.equal(201);
      expect(results.data.message).to.equal("Workout Created!");
      expect(results.data.data).to.have.property("uuid");
      expect(results.data.data.workoutName).to.equal("Upper Body Blast");

      // Verify workout was created
      const workout = await Workout.findOne({ uuid: results.data.data.uuid });
      expect(workout).to.exist;
      expect(workout.creatorPublicId).to.equal(newUserA.publicId);

      // Verify log was created
      const log = await WorkoutLog.findOne({
        sourceWorkoutUUID: results.data.data.uuid,
      });
      expect(log).to.exist;
      expect(log.creatorPublicId).to.equal(newUserA.publicId);
      expect(log.workoutNameSnapshot).to.equal("Upper Body Blast");
      expect(log.exercisesSnapshot).to.have.lengthOf(2);

      // Verify added to collection
      const collection = await WorkoutCollection.findOne({
        userPublicId: newUserA.publicId,
        workoutUUID: results.data.data.uuid,
      });
      expect(collection).to.exist;
    });

    it("Should return 400 for validation errors (missing required fields)", async () => {
      const invalidWorkoutData = {
        // Missing workoutName
        creatorPublicId: newUserA.publicId,
        workoutDuration: 45,
        exercises: [
          {
            exerciseId: "999",
            exerciseName: "Test",
            description: "Test exercise",
            reps: 10,
          },
        ],
      };

      const results = await userA.client.post(
        `${BASE_URL}/api/v1/workouts/create`,
        invalidWorkoutData,
        {
          headers: { "Content-Type": "application/json" },
          validateStatus: () => true,
        },
      );
      expect(results.status).to.equal(400);
      expect(results.data.error).to.exist;
    });

    it("Should return 401 if user is not authenticated", async () => {
      await userA.jar.removeAllCookies();

      const newWorkoutData = {
        creatorPublicId: newUserA.publicId,
        workoutName: "Test Workout",
        workoutDuration: 30,
        exercises: [
          {
            exerciseId: "888",
            exerciseName: "Test Exercise",
            description: "Test",
            reps: 5,
          },
        ],
      };

      const results = await userA.client.post(
        `${BASE_URL}/api/v1/workouts/create`,
        newWorkoutData,
        {
          headers: { "Content-Type": "application/json" },
          validateStatus: () => true,
        },
      );

      expect(results.status).to.equal(401);
    });

    it("Should create workout with creatorPublicId from authenticated user", async () => {
      const newWorkoutData = {
        creatorPublicId: newUserA.publicId,
        workoutName: "Security Test Workout",
        workoutDuration: 40,
        exercises: [
          {
            exerciseId: "999",
            exerciseName: "Test Exercise",
            description: "Test",
            muscles: ["test"],
            difficultyAtCreation: 5,
            reps: 10,
            weight: 100,
          },
        ],
      };

      const results = await userA.client.post(
        `${BASE_URL}/api/v1/workouts/create`,
        newWorkoutData,
        {
          headers: { "Content-Type": "application/json" },
          validateStatus: () => true,
        },
      );

      expect(results.status).to.equal(201);

      // Verify workout creator is the authenticated user
      const workout = await Workout.findOne({ uuid: results.data.data.uuid });
      expect(workout.creatorPublicId).to.equal(newUserA.publicId);
    });
  });

  // ========== WORKOUT DELETION TESTS ==========

  describe("DELETE /api/v1/workouts/:workoutId - Delete Workout", () => {
    it("Should return 200 and delete workout created by user (creator deletion)", async () => {
      // Add workout to User A's collection

      await WorkoutCollection.create({
        userPublicId: newUserA.publicId,
        workoutUUID: newWorkoutA.uuid,
      });

      // Create a log for this workout
      await WorkoutLog.create({
        creatorPublicId: newUserA.publicId,
        sourceWorkoutUUID: newWorkoutA.uuid,
        workoutNameSnapshot: "Leg Day",
        workoutDuration: 60,
        exercisesSnapshot: [],
        executedAt: new Date(),
      });

      const results = await userA.client.delete(
        `${BASE_URL}/api/v1/workouts/delete/${newWorkoutA.uuid}`,
        {
          headers: { "Content-Type": "application/json" },
          validateStatus: () => true,
        },
      );
      expect(results.status).to.equal(200);
      expect(results.data.message).to.equal("Workout Deleted Successfully!");

      // Verify workout is deleted from DB
      const workout = await Workout.findOne({ uuid: newWorkoutA.uuid });
      expect(workout).to.not.exist;

      // Verify removed from user's collection
      const collectionEntry = await WorkoutCollection.findOne({
        userPublicId: newUserA.publicId,
        workoutUUID: newWorkoutA.uuid,
      });
      expect(collectionEntry).to.not.exist;

      // Verify logs are marked as deleted
      const logs = await WorkoutLog.find({
        creatorPublicId: newUserA.publicId,
        sourceWorkoutUUID: newWorkoutA.uuid,
      });
      logs.forEach((log) => {
        expect(log.isDeleted).to.be.true;
      });

      // Verify snapshot was saved in other users' collections
      const otherCollections = await WorkoutCollection.find({
        workoutUUID: newWorkoutA.uuid,
        userPublicId: { $ne: newUserA.publicId },
      });
      otherCollections.forEach((col) => {
        expect(col.snapshot).to.exist;
        expect(col.snapshot.workoutName).to.equal("Leg Day");
      });
    });

    it("Should return 200 and remove from collection when user deletes someone else's workout", async () => {
      // User B adds User A's workout to their collection
      await WorkoutCollection.create({
        userPublicId: newUserB.publicId,
        workoutUUID: newWorkoutA.uuid,
      });

      // User B creates a log for User A's workout
      await WorkoutLog.create({
        creatorPublicId: newUserB.publicId,
        sourceWorkoutUUID: newWorkoutA.uuid,
        workoutNameSnapshot: "Leg Day",
        workoutDuration: 60,
        exercisesSnapshot: [],
        executedAt: new Date(),
      });

      const results = await userB.client.delete(
        `${BASE_URL}/api/v1/workouts/delete/${newWorkoutA.uuid}`,
        {
          headers: { "Content-Type": "application/json" },
          validateStatus: () => true,
        },
      );

      expect(results.status).to.equal(200);
      expect(results.data.message).to.equal("Workout Deleted Successfully!");

      // Verify original workout still exists
      const workout = await Workout.findOne({ uuid: newWorkoutA.uuid });
      expect(workout).to.exist;

      // Verify removed from User B's collection
      const collectionEntry = await WorkoutCollection.findOne({
        userPublicId: newUserB.publicId,
        workoutUUID: newWorkoutA.uuid,
      });
      expect(collectionEntry).to.not.exist;

      // Verify User B's logs are marked deleted
      const userBLogs = await WorkoutLog.find({
        creatorPublicId: newUserB.publicId,
        sourceWorkoutUUID: newWorkoutA.uuid,
      });
      userBLogs.forEach((log) => {
        expect(log.isDeleted).to.be.false;
      });
    });

    it("Should return 200 and handle deletion when only collection entry exists (workout already deleted)", async () => {
      // Add workout to User A's collection
      await WorkoutCollection.create({
        userPublicId: newUserA.publicId,
        workoutUUID: newWorkoutA.uuid,
      });

      // Delete the actual workout
      await Workout.deleteOne({ uuid: newWorkoutA.uuid });

      const results = await userA.client.delete(
        `${BASE_URL}/api/v1/workouts/delete/${newWorkoutA.uuid}`,
        {
          headers: { "Content-Type": "application/json" },
          validateStatus: () => true,
        },
      );

      expect(results.status).to.equal(200);
      expect(results.data.message).to.equal("Workout Deleted Successfully!");

      // Verify removed from collection
      const collectionEntry = await WorkoutCollection.findOne({
        userPublicId: newUserA.publicId,
        workoutUUID: newWorkoutA.uuid,
      });
      expect(collectionEntry).to.not.exist;
    });

    it("Should return 404 if workout and collection entry don't exist", async () => {
      const nonExistentUUID = "00000000-0000-0000-0000-000000000000";

      const results = await userA.client.delete(
        `${BASE_URL}/api/v1/workouts/delete/${nonExistentUUID}`,
        {
          headers: { "Content-Type": "application/json" },
          validateStatus: () => true,
        },
      );

      console.log(results);

      expect(results.status).to.equal(404);
      expect(results.data.message).to.equal("WORKOUT_NOT_FOUND");
    });

    it("should return 401 if user is not authenticated", async () => {
      await userA.jar.removeAllCookies();

      const results = await userA.client.delete(
        `${BASE_URL}/api/v1/workouts/delete/${newWorkoutA.uuid}`,
        {
          headers: { "Content-Type": "application/json" },
          validateStatus: () => true,
        },
      );

      expect(results.status).to.equal(401);
    });

    it("Should mark multiple logs as deleted when deleting a workout logged multiple times", async () => {
      // Creates multiple logs for the same workout
      await WorkoutLog.create({
        creatorPublicId: newUserA.publicId,
        sourceWorkoutUUID: newWorkoutA.uuid,
        workoutNameSnapshot: "Leg Day",
        workoutDuration: 60,
        exercisesSnapshot: [],
        executedAt: new Date("2026-01-15"),
      });

      await WorkoutLog.create({
        creatorPublicId: newUserA.publicId,
        sourceWorkoutUUID: newWorkoutA.uuid,
        workoutNameSnapshot: "Leg Day",
        workoutDuration: 65,
        exercisesSnapshot: [],
        executedAt: new Date("2026-01-20"),
      });

      await WorkoutLog.create({
        creatorPublicId: newUserA.publicId,
        sourceWorkoutUUID: newWorkoutA.uuid,
        workoutNameSnapshot: "Leg Day",
        workoutDuration: 58,
        exercisesSnapshot: [],
        executedAt: new Date("2026-01-25"),
      });

      const results = await userA.client.delete(
        `${BASE_URL}/api/v1/workouts/delete/${newWorkoutA.uuid}`,
        {
          headers: { "Content-Type": "application/json" },
          validateStatus: () => true,
        },
      );

      expect(results.status).to.equal(200);

      // Verifies all logs are marked as deleted
      const logs = await WorkoutLog.find({
        sourceWorkoutUUID: newWorkoutA.uuid,
      });

      expect(logs).to.have.lengthOf(3);
      logs.forEach((log) => {
        expect(log.isDeleted).to.be.true;
      });
    });
  });

  // ========== WORKOUT DUPLICATION TESTS ==========
  describe("POST /api/v1/workouts/duplicate/:workoutId", () => {
    it("Should not create a new collection document if workout already exists in collection. A new log should be created and return 201", async () => {
      const results = await userA.client.post(
        `${BASE_URL}/api/v1/workouts/duplicate/${newWorkoutA.uuid}`,
        {},
        {
          headers: { "Content-Type": "application/json" },
          validateStatus: () => true,
        },
      );

      expect(results.status).to.equal(201);
      expect(results.data.message).to.equal("Workout Duplicated Successfully!");

      // Verifies log created
      const log = await WorkoutLog.findOne({
        creatorPublicId: newUserA.publicId,
        sourceWorkoutUUID: newWorkoutA.uuid,
      });

      expect(log).to.exist;

      // Verifies added to collection
      const collectionEntry = await WorkoutCollection.findOne({
        userPublicId: userA.publicId,
        workoutUUID: newWorkoutA.uuid,
      });

      expect(collectionEntry).to.not.exist;
    });

    it("Should return 200 when user tries to duplicate another user's workout", async () => {
      const results = await userB.client.post(
        `${BASE_URL}/api/v1/workouts/duplicate/${newWorkoutA.uuid}`,
        {},
        {
          headers: { "Content-Type": "application/json" },
          validateStatus: () => true,
        },
      );

      expect(results.status).to.equal(201);

      const log = await WorkoutLog.find({
        creatorPublicId: newUserB.publicId,
        sourceWorkoutUUID: newWorkoutA.uuid,
      });

      expect(log).to.exist;

      const collectionEntries = await WorkoutCollection.find({
        userPublicId: newUserB.publicId,
        workoutUUID: newWorkoutA.uuid,
      });

      expect(collectionEntries.length).to.equal(1);
    });

    it("Should return 404 when workout does not exist", async () => {
      const fakeUUID = crypto.randomUUID();

      const results = await userA.client.post(
        `${BASE_URL}/api/v1/workouts/duplicate/${fakeUUID}`,
        {},
        {
          headers: { "Content-Type": "application/json" },
          validateStatus: () => true,
        },
      );

      expect(results.status).to.equal(404);
    });

    it("Should not create duplicate collection entry if workout already exists in collection", async () => {
      await WorkoutCollection.create({
        userPublicId: newUserA.publicId,
        workoutUUID: newWorkoutA.uuid,
      });

      const results = await userA.client.post(
        `${BASE_URL}/api/v1/workouts/duplicate/${newWorkoutA.uuid}`,
        {},
        {
          headers: { "Content-Type": "application/json" },
          validateStatus: () => true,
        },
      );

      expect(results.status).to.equal(201);

      const entries = await WorkoutCollection.find({
        userPublicId: newUserA.publicId,
        workoutUUID: newWorkoutA.uuid,
      });

      expect(entries.length).to.equal(1);
    });
  });

  // ========== MEAL CREATION TESTS ==========

  describe("POST /api/v1/meals/create - Create and Log Meal", () => {
    it("Should return 201 and create meal template, log entry, and add to collection", async () => {
      const newMealData = {
        mealName: "Chicken and Rice",
        mealDescription: "High protein lunch",
        ingredients: [
          {
            ingredientId: "67890",
            ingredientName: "Chicken Breast",
            quantity: 200,
            macros: {
              protein: 62,
              fat: 7,
              carbs: 0,
              fiber: 0,
              netCarbs: 0,
              calories: 330,
            },
            caloriesPer100G: 165,
            macrosPer100G: {
              protein: 31,
              fat: 3.6,
              carbs: 0,
              fiber: 0,
              netCarbs: 0,
              calories: 165,
            },
          },
          {
            ingredientId: "11111",
            ingredientName: "White Rice",
            quantity: 150,
            macros: {
              protein: 4,
              fat: 0.5,
              carbs: 42,
              fiber: 0.5,
              netCarbs: 41.5,
              calories: 195,
            },
            caloriesPer100G: 130,
            macrosPer100G: {
              protein: 2.7,
              fat: 0.3,
              carbs: 28,
              fiber: 0.4,
              netCarbs: 27.6,
              calories: 130,
            },
          },
        ],
        mealMacros: {
          protein: 66,
          fat: 7.5,
          carbs: 42,
          fiber: 0.5,
          netCarbs: 41.5,
          calories: 525,
        },
      };

      const results = await userA.client.post(
        `${BASE_URL}/api/v1/meals/create`,
        newMealData,
        {
          headers: { "Content-Type": "application/json" },
          validateStatus: () => true,
        },
      );

      expect(results.status).to.equal(201);
      expect(results.data.message).to.equal("Meal Created Successfully!");

      // Verify meal was created
      const meal = await Meal.findOne({ mealName: "Chicken and Rice" });
      expect(meal).to.exist;
      expect(meal.creatorPublicId).to.equal(newUserA.publicId);

      // Verify log was created
      const log = await MealLog.findOne({
        sourceMealUUID: meal.uuid,
      });
      expect(log).to.exist;
      expect(log.creatorPublicId).to.equal(newUserA.publicId);
      expect(log.mealNameSnapshot).to.equal("Chicken and Rice");
      expect(log.ingredientsSnapshot).to.have.lengthOf(2);

      // Verify added to collection
      const collection = await MealCollection.findOne({
        userPublicId: newUserA.publicId,
        mealUUID: meal.uuid,
      });
      expect(collection).to.exist;
    });

    it("Should return 400 for validation errors (missing required fields)", async () => {
      const invalidMealData = {
        // Missing mealName
        mealDescription: "Test meal",
        ingredients: [],
        mealMacros: {
          protein: 0,
          fat: 0,
          carbs: 0,
          fiber: 0,
          netCarbs: 0,
          calories: 0,
        },
      };

      const results = await userA.client.post(
        `${BASE_URL}/api/v1/meals/create`,
        invalidMealData,
        {
          headers: { "Content-Type": "application/json" },
          validateStatus: () => true,
        },
      );

      expect(results.status).to.equal(400);
      expect(results.data.error).to.exist;
    });

    it("Should return 401 if user is not authenticated", async () => {
      await userA.jar.removeAllCookies();

      const newMealData = {
        mealName: "Test Meal",
        mealDescription: "Test",
        ingredients: [],
        mealMacros: {
          protein: 0,
          fat: 0,
          carbs: 0,
          fiber: 0,
          netCarbs: 0,
          calories: 0,
        },
      };

      const results = await userA.client.post(
        `${BASE_URL}/api/v1/meals/create`,
        newMealData,
        {
          headers: { "Content-Type": "application/json" },
          validateStatus: () => true,
        },
      );

      expect(results.status).to.equal(401);
    });

    it("Should create meal with creatorPublicId from authenticated user", async () => {
      const newMealData = {
        mealName: "Security Test Meal",
        mealDescription: "Testing security",
        ingredients: [
          {
            ingredientId: "99999",
            ingredientName: "Test Ingredient",
            quantity: 100,
            macros: {
              protein: 10,
              fat: 5,
              carbs: 15,
              fiber: 2,
              netCarbs: 13,
              calories: 150,
            },
            caloriesPer100G: 150,
            macrosPer100G: {
              protein: 10,
              fat: 5,
              carbs: 15,
              fiber: 2,
              netCarbs: 13,
              calories: 150,
            },
          },
        ],
        mealMacros: {
          protein: 10,
          fat: 5,
          carbs: 15,
          fiber: 2,
          netCarbs: 13,
          calories: 150,
        },
      };

      const results = await userA.client.post(
        `${BASE_URL}/api/v1/meals/create`,
        newMealData,
        {
          headers: { "Content-Type": "application/json" },
          validateStatus: () => true,
        },
      );

      expect(results.status).to.equal(201);

      // Verify meal creator is the authenticated user
      const meal = await Meal.findOne({ mealName: "Security Test Meal" });
      expect(meal.creatorPublicId).to.equal(newUserA.publicId);
    });
  });

  // ========== MEAL DELETION TESTS ==========

  describe("DELETE /api/v1/meals/delete/:mealId - Delete Meal", () => {
    it("Should return 200 and delete meal created by user (creator deletion)", async () => {
      // Add meal to User A's collection
      await MealCollection.create({
        userPublicId: newUserA.publicId,
        mealUUID: newMealA.uuid,
      });

      // Create a log for this meal
      await MealLog.create({
        creatorPublicId: newUserA.publicId,
        sourceMealUUID: newMealA.uuid,
        mealNameSnapshot: "Protein Shake",
        mealDescriptionSnapshot: "Post-workout protein shake",
        ingredientsSnapshot: [],
        macrosSnapshot: {
          protein: 24,
          fat: 1,
          carbs: 3,
          fiber: 0,
          netCarbs: 3,
          calories: 120,
        },
        consumedAt: new Date(),
      });

      const results = await userA.client.delete(
        `${BASE_URL}/api/v1/meals/delete/${newMealA.uuid}`,
        {
          headers: { "Content-Type": "application/json" },
          validateStatus: () => true,
        },
      );

      expect(results.status).to.equal(200);
      expect(results.data.message).to.equal("Meal Deleted Successfully!");

      // Verify meal is deleted from DB
      const meal = await Meal.findOne({ uuid: newMealA.uuid });
      expect(meal).to.not.exist;

      // Verify removed from user's collection
      const collectionEntry = await MealCollection.findOne({
        userPublicId: newUserA.publicId,
        mealUUID: newMealA.uuid,
      });
      expect(collectionEntry).to.not.exist;

      // Verify logs are marked as deleted
      const logs = await MealLog.find({
        creatorPublicId: newUserA.publicId,
        sourceMealUUID: newMealA.uuid,
      });
      logs.forEach((log) => {
        expect(log.isDeleted).to.be.true;
      });
    });

    it("Should return 200 and remove from collection only when user deletes someone else's meal", async () => {
      // User B adds User A's meal to their collection
      await MealCollection.create({
        userPublicId: newUserB.publicId,
        mealUUID: newMealA.uuid,
      });

      // User B creates a log for User A's meal
      await MealLog.create({
        creatorPublicId: newUserB.publicId,
        sourceMealUUID: newMealA.uuid,
        mealNameSnapshot: "Protein Shake",
        mealDescriptionSnapshot: "Post-workout protein shake",
        ingredientsSnapshot: [],
        macrosSnapshot: {
          protein: 24,
          fat: 1,
          carbs: 3,
          fiber: 0,
          netCarbs: 3,
          calories: 120,
        },
        isDeleted: false,
        consumedAt: new Date(),
      });

      const results = await userB.client.delete(
        `${BASE_URL}/api/v1/meals/delete/${newMealA.uuid}`,
        {
          headers: { "Content-Type": "application/json" },
          validateStatus: () => true,
        },
      );

      expect(results.status).to.equal(200);
      expect(results.data.message).to.equal("Meal Deleted Successfully!");

      // Verify original meal still exists
      const meal = await Meal.findOne({ uuid: newMealA.uuid });
      expect(meal).to.exist;

      // Verify removed from User B's collection
      const collectionEntry = await MealCollection.findOne({
        userPublicId: newUserB.publicId,
        mealUUID: newMealA.uuid,
      });
      expect(collectionEntry).to.not.exist;

      // Verify User B's logs are marked deleted
      const userBLogs = await MealLog.find({
        creatorPublicId: newUserB.publicId,
        sourceMealUUID: newMealA.uuid,
      });

      userBLogs.forEach((log) => {
        expect(log.isDeleted).to.be.false;
      });
    });

    it("Should return 200 and handle deletion when only collection entry exists (meal already deleted)", async () => {
      // Add meal to User A's collection
      await MealCollection.create({
        userPublicId: newUserA.publicId,
        mealUUID: newMealA.uuid,
      });

      // Delete the actual meal
      await Meal.deleteOne({ uuid: newMealA.uuid });

      const results = await userA.client.delete(
        `${BASE_URL}/api/v1/meals/delete/${newMealA.uuid}`,
        {
          headers: { "Content-Type": "application/json" },
          validateStatus: () => true,
        },
      );

      expect(results.status).to.equal(200);
      expect(results.data.message).to.equal("Meal Deleted Successfully!");

      // Verify removed from collection
      const collectionEntry = await MealCollection.findOne({
        userPublicId: newUserA.publicId,
        mealUUID: newMealA.uuid,
      });
      expect(collectionEntry).to.not.exist;
    });

    it("Should return 404 if meal and collection entry don't exist", async () => {
      const nonExistentUUID = "00000000-0000-0000-0000-000000000000";

      const results = await userA.client.delete(
        `${BASE_URL}/api/v1/meals/delete/${nonExistentUUID}`,
        {
          headers: { "Content-Type": "application/json" },
          validateStatus: () => true,
        },
      );

      expect(results.status).to.equal(404);
      expect(results.data.message).to.equal("MEAL_NOT_FOUND");
    });

    it("Should return 401 if user is not authenticated", async () => {
      await userA.jar.removeAllCookies();

      const results = await userA.client.delete(
        `${BASE_URL}/api/v1/meals/delete/${newMealA.uuid}`,
        {
          headers: { "Content-Type": "application/json" },
          validateStatus: () => true,
        },
      );

      expect(results.status).to.equal(401);
    });

    it("Should mark multiple logs as deleted when deleting a meal logged multiple times", async () => {
      // Create multiple logs for the same meal
      await MealLog.create({
        creatorPublicId: newUserA.publicId,
        sourceMealUUID: newMealA.uuid,
        mealNameSnapshot: "Protein Shake",
        mealDescriptionSnapshot: "Post-workout protein shake",
        ingredientsSnapshot: [],
        macrosSnapshot: {
          protein: 24,
          fat: 1,
          carbs: 3,
          fiber: 0,
          netCarbs: 3,
          calories: 120,
        },
        consumedAt: new Date("2026-01-15"),
      });

      await MealLog.create({
        creatorPublicId: newUserA.publicId,
        sourceMealUUID: newMealA.uuid,
        mealNameSnapshot: "Protein Shake",
        mealDescriptionSnapshot: "Post-workout protein shake",
        ingredientsSnapshot: [],
        macrosSnapshot: {
          protein: 24,
          fat: 1,
          carbs: 3,
          fiber: 0,
          netCarbs: 3,
          calories: 120,
        },
        consumedAt: new Date("2026-01-20"),
      });

      await MealLog.create({
        creatorPublicId: newUserA.publicId,
        sourceMealUUID: newMealA.uuid,
        mealNameSnapshot: "Protein Shake",
        mealDescriptionSnapshot: "Post-workout protein shake",
        ingredientsSnapshot: [],
        macrosSnapshot: {
          protein: 24,
          fat: 1,
          carbs: 3,
          fiber: 0,
          netCarbs: 3,
          calories: 120,
        },
        consumedAt: new Date("2026-01-25"),
      });

      const results = await userA.client.delete(
        `${BASE_URL}/api/v1/meals/delete/${newMealA.uuid}`,
        {
          headers: { "Content-Type": "application/json" },
          validateStatus: () => true,
        },
      );

      expect(results.status).to.equal(200);

      // Verify all logs are marked as deleted
      const logs = await MealLog.find({
        sourceMealUUID: newMealA.uuid,
      });

      expect(logs).to.have.lengthOf(3);
      logs.forEach((log) => {
        expect(log.isDeleted).to.be.true;
      });
    });
  });

  // ========== MEAL DUPLICATION TESTS ==========

  describe("POST /api/v1/meals/duplicate/:mealId - Duplicate Meal", () => {
    it("Should not create a new collection document if meal already exists in collection and return 201", async () => {
      // Add meal to collection first
      await MealCollection.create({
        userPublicId: newUserA.publicId,
        mealUUID: newMealA.uuid,
      });

      const results = await userA.client.post(
        `${BASE_URL}/api/v1/meals/duplicate/${newMealA.uuid}`,
        {},
        {
          headers: { "Content-Type": "application/json" },
          validateStatus: () => true,
        },
      );

      expect(results.status).to.equal(201);
      expect(results.data.message).to.equal("Meal Duplicated Successfully!");

      // Verify log was created
      const log = await MealLog.findOne({
        creatorPublicId: newUserA.publicId,
        sourceMealUUID: newMealA.uuid,
      });

      expect(log).to.exist;

      // Verify only one collection entry exists
      const entries = await MealCollection.find({
        userPublicId: newUserA.publicId,
        mealUUID: newMealA.uuid,
      });

      expect(entries.length).to.equal(1);
    });

    it("Should return 201 when user tries to duplicate another user's meal", async () => {
      const results = await userB.client.post(
        `${BASE_URL}/api/v1/meals/duplicate/${newMealA.uuid}`,
        {},
        {
          headers: { "Content-Type": "application/json" },
          validateStatus: () => true,
        },
      );

      expect(results.status).to.equal(201);

      // Verify log was created
      const log = await MealLog.findOne({
        creatorPublicId: newUserB.publicId,
        sourceMealUUID: newMealA.uuid,
      });

      expect(log).to.exist;

      // Verify added to User B's collection
      const collectionEntry = await MealCollection.findOne({
        userPublicId: newUserB.publicId,
        mealUUID: newMealA.uuid,
      });

      expect(collectionEntry).to.exist;
    });

    it("Should return 404 when meal does not exist", async () => {
      const fakeUUID = crypto.randomUUID();

      const results = await userA.client.post(
        `${BASE_URL}/api/v1/meals/duplicate/${fakeUUID}`,
        {},
        {
          headers: { "Content-Type": "application/json" },
          validateStatus: () => true,
        },
      );

      expect(results.status).to.equal(404);
      expect(results.data.message).to.equal("MEAL_NOT_FOUND");
    });

    it("Should not create duplicate collection entry if meal already exists in collection", async () => {
      // Adds meal to collection first
      await MealCollection.create({
        userPublicId: newUserA.publicId,
        mealUUID: newMealA.uuid,
      });

      const results = await userA.client.post(
        `${BASE_URL}/api/v1/meals/duplicate/${newMealA.uuid}`,
        {},
        {
          headers: { "Content-Type": "application/json" },
          validateStatus: () => true,
        },
      );

      expect(results.status).to.equal(201);

      // Verifies only one collection entry
      const entries = await MealCollection.find({
        userPublicId: newUserA.publicId,
        mealUUID: newMealA.uuid,
      });

      expect(entries.length).to.equal(1);
    });

    it("Should return 401 if user is not authenticated", async () => {
      await userA.jar.removeAllCookies();

      const results = await userA.client.post(
        `${BASE_URL}/api/v1/meals/duplicate/${newMealA.uuid}`,
        {},
        {
          headers: { "Content-Type": "application/json" },
          validateStatus: () => true,
        },
      );

      expect(results.status).to.equal(401);
    });
  });
});
