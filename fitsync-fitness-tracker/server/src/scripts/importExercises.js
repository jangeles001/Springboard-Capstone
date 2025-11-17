import mongoose from "mongoose";
import { getEnv } from "../config/envConfig.js";
import exerciseModel from "../models/exerciseModel.js";
import { fetchAllWgerExercises } from "../utils/fetchAllWgerExercises.js";

function computeDifficulty(exercise) {
  let muscleScore = 0;
  const muscleWeights = {
    quads: 3,
    glutes: 3,
    lats: 3,
    pecs: 3,
    delts: 2,
    hamstrings: 2,
    core: 2,
    biceps: 1,
    triceps: 1,
    calves: 1,
  };

  (exercise.muscles || []).forEach((muscle) => {
    muscleScore += muscleWeights[muscle.toLowerCase()] || 1;
  });

  const categoryScoreMap = {
    strength: 6,
    plyometric: 5,
    cardio: 4,
    stretching: 1,
  };
  const typeScore = categoryScoreMap[exercise.category?.toLowerCase()] || 2;

  const metScore = exercise.met ? Math.min(exercise.met / 2, 5) : 0;
  const skillScore = exercise.skillLevel ? exercise.skillLevel : 1;

  const rawScore =
    muscleScore * 1.2 + typeScore * 1.5 + metScore * 1.0 + skillScore * 1.0;
  const normalized = Math.min(Math.max((rawScore / 20) * 10, 1), 10);
  return parseFloat(normalized.toFixed(1));
}

async function importExercises() {
  try {
    await mongoose.connect(getEnv("MONGO_URI"));
    console.log("Connected to MongoDB");

    const exercises = await fetchAllWgerExercises(); // Gets all 

    // Maps document object fields to the corresponding wger exercise objects
    for (const ex of exercises) {
      const formatted = {
        exerciseId: ex.id.toString(),
        name: ex.translations?.[0]?.name
          ? String(ex.translations?.[0]?.name).trim()
          : `Exercise ${ex.id}`, // normalizes empty names
        description: ex.translations?.[0]?.description
          ? String(ex.translations?.[0]?.description)
              .replace(/<\/?[^>]+(>|$)/g, "")
              .trim()
          : "No description available", // normalizes empty descriptions
        category: ex.category?.name || "Unknown",
        muscles: ex.muscles?.map((muscle) => muscle.name) || [],
        met: ex.met ?? 0,
        difficulty: computeDifficulty({
          muscles: ex.muscles?.map((muscle) => muscle.name) || [],
          category: ex.category?.name,
          met: ex.met,
          skillLevel: ex.skill_level,
        }),
        equipment: ex.equipment?.map((equipment) => equipment.name) || [],
        aiFeatures: {},
      };

      await exerciseModel.updateOne(
        { exerciseId: formatted.exerciseId },
        { $set: formatted },
        { upsert: true }
      );
    }

    console.log("All exercises imported/updated successfully!");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

importExercises();
