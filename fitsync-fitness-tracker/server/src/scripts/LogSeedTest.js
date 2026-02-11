import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";
import { MealLog } from "../models/mealLogModel.js";
import { WorkoutLog } from "../models/workoutLogModel.js";
import { getEnv } from "../config/envConfig.js";

const TEST_USER_ID = "LvTAPh11Rj"; // replace with a real user if needed
const NUM_DAYS = 14; // number of days of data

// Utility functions to generate past dates and random integers
function getPastDates(days) {
  const dates = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    dates.push(d);
  }
  return dates;
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Builds meal logs with 2 ingredients each, random macros, and past dates
const mealNames = [
  "Chicken Salad",
  "Beef Stir Fry",
  "Protein Smoothie",
  "Omelette",
  "Turkey Sandwich",
];
const mealDescriptions = [
  "A healthy mix of veggies and protein",
  "High protein stir fry with veggies",
  "Smoothie with protein powder, banana, and oats",
  "Egg omelette with spinach and cheese",
  "Turkey sandwich on whole grain bread",
];

function generateIngredient() {
  const protein = randomInt(5, 30);
  const carbs = randomInt(5, 60);
  const fat = randomInt(0, 20);
  const fiber = randomInt(0, 10);
  const calories = protein * 4 + carbs * 4 + fat * 9;
  return {
    ingredientId: randomInt(1000, 9999),
    ingredientName: "Ingredient " + randomInt(1, 100),
    quantity: randomInt(50, 200),
    macros: { protein, fat, carbs, fiber, netCarbs: carbs - fiber, calories },
    caloriesPer100G: calories,
    macrosPer100G: {
      protein,
      fat,
      carbs,
      fiber,
      netCarbs: carbs - fiber,
      calories,
    },
  };
}

const mealLogs = getPastDates(NUM_DAYS).map((date) => {
  const ingredients = Array.from({ length: 2 }, () => generateIngredient());

  const totalMacros = ingredients.reduce(
    (acc, ing) => ({
      protein: acc.protein + ing.macros.protein,
      fat: acc.fat + ing.macros.fat,
      carbs: acc.carbs + ing.macros.carbs,
      fiber: acc.fiber + ing.macros.fiber,
      netCarbs: acc.netCarbs + ing.macros.netCarbs,
      calories: acc.calories + ing.macros.calories,
    }),
    { protein: 0, fat: 0, carbs: 0, fiber: 0, netCarbs: 0, calories: 0 },
  );

  return {
    creatorPublicId: TEST_USER_ID,
    sourceMealUUID: uuidv4(),
    mealNameSnapshot: mealNames[randomInt(0, mealNames.length - 1)],
    mealDescriptionSnapshot:
      mealDescriptions[randomInt(0, mealDescriptions.length - 1)],
    ingredientsSnapshot: ingredients,
    macrosSnapshot: totalMacros,
    consumedAt: date,
  };
});

// Builds workout logs with 3 exercises each, random durations, and past dates
const workoutNames = [
  "Full Body Strength",
  "Upper Body Blast",
  "Leg Day",
  "Cardio Session",
  "Core & Abs",
];
const exerciseNames = [
  "Squat",
  "Bench Press",
  "Deadlift",
  "Pull-up",
  "Plank",
  "Bicep Curl",
];

function generateExercise() {
  return {
    exerciseId: uuidv4(),
    exerciseName: exerciseNames[randomInt(0, exerciseNames.length - 1)],
    muscles: ["Legs", "Back", "Chest", "Core"].slice(0, randomInt(1, 3)),
    description: "Exercise description",
    difficultyAtCreation: randomInt(3, 7),
    reps: randomInt(8, 15),
    weight: randomInt(10, 100),
    duration: randomInt(30, 120),
    aiFeatures: {},
  };
}

const workoutLogs = getPastDates(NUM_DAYS).map((date) => ({
  creatorPublicId: TEST_USER_ID,
  sourceWorkoutUUID: uuidv4(),
  workoutNameSnapshot: workoutNames[randomInt(0, workoutNames.length - 1)],
  workoutDuration: randomInt(30, 90),
  exercisesSnapshot: Array.from({ length: 3 }, () => generateExercise()),
  executedAt: date,
}));

async function seed() {
  try {
    await mongoose.connect(getEnv("MONGO_TEST_URI"));

    await MealLog.insertMany(mealLogs);
    console.log(`Inserted ${mealLogs.length} meal logs`);

    await WorkoutLog.insertMany(workoutLogs);
    console.log(`Inserted ${workoutLogs.length} workout logs`);

    await mongoose.disconnect();
    console.log("Done!");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();
