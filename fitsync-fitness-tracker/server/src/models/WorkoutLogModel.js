import mongoose from "mongoose";
import { workoutExerciseSchema } from "./WorkoutModel.js";

const workoutLogSchema = new mongoose.Schema(
  {
    creatorPublicId: {
      type: String,
      required: true,
      index: true,
    },

    // Reference to a saved meal
    sourceWorkoutUUID: {
      type: String,
    },

    // Snapshot data (DO NOT reference Meal dynamically)
    workoutNameSnapshot: {
      type: String,
      required: true,
    },

    workoutDuration: {
      type: Number,
      required: true,
    },

    exercisesSnapshot: {
      type: [workoutExerciseSchema],
      required: true,
    },

    executedAt: {
      type: Date,
      required: true,
      index: true,
    },

    // Soft deletion field
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },

    correctedFromLogId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WorkoutLog",
    },
  },
  { timestamps: true }
);

export const WorkoutLog = mongoose.model("WorkoutLog", workoutLogSchema);
