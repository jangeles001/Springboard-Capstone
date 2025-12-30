import mongoose from "mongoose";
import { workoutExerciseSchema } from "./WorkoutModel.js";

const workoutLogSchema = new mongoose.Schema(
  {
    userPublicId: {
      type: String,
      required: true,
      index: true,
    },

    // Reference to a saved meal
    workoutUUID: {
      type: String,
    },

    // Snapshot data (DO NOT reference Meal dynamically)
    workoutNameSnapshot: {
      type: String,
      required: true,
    },

    exercisesSnapshot: {
      type: [workoutExerciseSchema],
      required: true,
    },

    reps: {
      type: Number,
      default: 1,
      min: 0.25,
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
