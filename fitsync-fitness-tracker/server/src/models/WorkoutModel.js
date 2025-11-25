import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const workoutExerciseSchema = new mongoose.Schema(
  {
    exercise: {
      type: String,
      required: true,
      trim: true,
    },
    difficultyAtCreation: { type: Number }, // snapshot of difficulty at workout creation
    sets: {
      type: Number,
      min: [0, "Sets cannot be negative"],
      validate: {
        validator: (v) => Number.isInteger(v),
        message: "Sets must be an integer!",
      },
    },
    reps: {
      type: Number,
      min: [0, "Reps cannot be negative!"],
      validate: {
        validator: (v) => Number.isInteger(v),
        message: "Reps must be an integer",
      },
    },
    duration: { type: Number, min: [0, "Duration cannot be negative!"] }, // for cardio/time-based exercises
    aiFeatures: { type: Object, default: {} }, // snapshot AI features
  },
  { _id: false }
); // no separate _id for each exercise entry

// Mongoose schema definition
const workoutSchema = new mongoose.Schema(
  {
    creatorPublicId: { type: String, trim: true },
    uuid: { type: String, default: uuidv4, unique: true, index: true },
    workoutName: {
      type: String,
      minlength: 1,
      required: [true, "Workout must have a name!"],
      trim: true,
      minlength: [1, "Workout name cannot be empty!"],
      maxlength: [60, "Workout name cannot exceed 60 characters!"],
    },
    exercises: {
      type: [workoutExerciseSchema],
      ref: "Exercise",
      required: true,
      default: [],

      validate: [
        {
          validator: function (arr) {
            return arr.length <= 50;
          },
          message: "A workout cannot contain more than 50 exercises.",
        },
        {
          validator: function (arr) {
            // Ensures no duplicate exerciseId entries
            const ids = arr.map((e) => e.exerciseId);
            return new Set(ids).size === ids.length;
          },
          message: "Duplicate exercises are not allowed.",
        },
      ],
    },
  },
  { timestamps: true }
);

// Generates Mongoose model
export const Workout = mongoose.model("Workout", workoutSchema);
