process.env.NODE_ENV = "test";

import { expect } from "chai";
import mongoose from "mongoose";
import { User } from "../models/userModel.js";
import { Workout } from "../models/workoutModel.js";
import { WorkoutLog } from "../models/workoutLogModel.js";
import { WorkoutCollection } from "../models/workoutCollectionModel.js";
import { userA, userB } from "../tests/helpers/axiosClients.js";
import { getEnv } from "../config/envConfig.js";
import { registerNewUser } from "../services/userService.js";
import redisClient from "../config/redisClient.js";

const BASE_URL = `http://localhost:${getEnv("PORT")}`;
let newUserA;
let newUserB;
let newWorkoutA;

describe("Workout Creation, Logging, and Deletion Tests", function () {
  before(async function () {
    await mongoose.connect(getEnv("MONGO_TEST_URI"));
  });

  beforeEach(async () => {
    // Clear all collections
    await User.deleteMany({});
    await Workout.deleteMany({});
    await WorkoutLog.deleteMany({});
    await WorkoutCollection.deleteMany({});
    await redisClient.flushDb();
    await userA.jar.removeAllCookies();
    await userB.jar.removeAllCookies();

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
  });

  after(async function () {
    await mongoose.connection.close();
  });

  // ========== WORKOUT CREATION TESTS ==========

  describe("POST /api/v1/workouts/create - Create and Log Workout", () => {
    it("should return 201 and create workout template, log entry, and add to collection", async () => {
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

    it("should return 400 for validation errors (missing required fields)", async () => {
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

    it("should return 401 if user is not authenticated", async () => {
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

    it("should create workout with creatorPublicId from authenticated user", async () => {
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

  describe("DELETE /api/v1/users/:userPublicId/workouts/:workoutId - Delete Workout", () => {
    it("should return 200 and delete workout created by user (creator deletion)", async () => {
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
        `${BASE_URL}/api/v1/users/${newUserA.publicId}/workouts/${newWorkoutA.uuid}`,
        {
          headers: { "Content-Type": "application/json" },
          validateStatus: () => true,
        },
      );

      expect(results.status).to.equal(200);
      expect(results.data.message).to.equal("Delete Successful");

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

    it("should return 200 and remove from collection when user deletes someone else's workout", async () => {
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
        `${BASE_URL}/api/v1/users/${newUserB.publicId}/workouts/${newWorkoutA.uuid}`,
        {
          headers: { "Content-Type": "application/json" },
          validateStatus: () => true,
        },
      );

      expect(results.status).to.equal(200);
      expect(results.data.message).to.equal("Delete Successful");

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

    it("should return 200 and handle deletion when only collection entry exists (workout already deleted)", async () => {
      // Add workout to User A's collection
      await WorkoutCollection.create({
        userPublicId: newUserA.publicId,
        workoutUUID: newWorkoutA.uuid,
      });

      // Delete the actual workout
      await Workout.deleteOne({ uuid: newWorkoutA.uuid });

      const results = await userA.client.delete(
        `${BASE_URL}/api/v1/users/${newUserA.publicId}/workouts/${newWorkoutA.uuid}`,
        {
          headers: { "Content-Type": "application/json" },
          validateStatus: () => true,
        },
      );

      expect(results.status).to.equal(200);
      expect(results.data.message).to.equal("Delete Successful");

      // Verify removed from collection
      const collectionEntry = await WorkoutCollection.findOne({
        userPublicId: newUserA.publicId,
        workoutUUID: newWorkoutA.uuid,
      });
      expect(collectionEntry).to.not.exist;
    });

    it("should return 404 if workout and collection entry don't exist", async () => {
      const nonExistentUUID = "00000000-0000-0000-0000-000000000000";

      const results = await userA.client.delete(
        `${BASE_URL}/api/v1/users/${newUserA.publicId}/workouts/${nonExistentUUID}`,
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
        `${BASE_URL}/api/v1/users/${newUserA.publicId}/workouts/${newWorkoutA.uuid}`,
        {
          headers: { "Content-Type": "application/json" },
          validateStatus: () => true,
        },
      );

      expect(results.status).to.equal(401);
    });

    it("should mark multiple logs as deleted when deleting a workout logged multiple times", async () => {
      // Create multiple logs for the same workout
      const log1 = await WorkoutLog.create({
        creatorPublicId: newUserA.publicId,
        sourceWorkoutUUID: newWorkoutA.uuid,
        workoutNameSnapshot: "Leg Day",
        workoutDuration: 60,
        exercisesSnapshot: [],
        executedAt: new Date("2026-01-15"),
      });

      const log2 = await WorkoutLog.create({
        creatorPublicId: newUserA.publicId,
        sourceWorkoutUUID: newWorkoutA.uuid,
        workoutNameSnapshot: "Leg Day",
        workoutDuration: 65,
        exercisesSnapshot: [],
        executedAt: new Date("2026-01-20"),
      });

      const log3 = await WorkoutLog.create({
        creatorPublicId: newUserA.publicId,
        sourceWorkoutUUID: newWorkoutA.uuid,
        workoutNameSnapshot: "Leg Day",
        workoutDuration: 58,
        exercisesSnapshot: [],
        executedAt: new Date("2026-01-25"),
      });

      const results = await userA.client.delete(
        `${BASE_URL}/api/v1/users/${newUserA.publicId}/workouts/${newWorkoutA.uuid}`,
        {
          headers: { "Content-Type": "application/json" },
          validateStatus: () => true,
        },
      );

      expect(results.status).to.equal(200);

      // Verify all logs are marked as deleted
      const logs = await WorkoutLog.find({
        sourceWorkoutUUID: newWorkoutA.uuid,
      });

      expect(logs).to.have.lengthOf(3);
      logs.forEach((log) => {
        expect(log.isDeleted).to.be.true;
      });
    });
  });
});
