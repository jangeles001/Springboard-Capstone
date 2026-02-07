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
        expect(log.isDeleted).to.be.true;
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

      const log = await WorkoutLog.findOne({
        creatorPublicId: newUserB.publicId,
        sourceWorkoutUUID: newWorkoutA.uuid,
      });

      expect(log).to.exist;

      const collectionEntry = await WorkoutCollection.findOne({
        userPublicId: newUserB.publicId,
        workoutUUID: newWorkoutA.uuid,
      });

      expect(collectionEntry).to.exist;
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

    it("Should return 200 and remove from collection when user deletes someone else's meal", async () => {
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
        expect(log.isDeleted).to.be.true;
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
