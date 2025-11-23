import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const workoutExerciseSchema = new mongoose.Schema(
  {
    exercise: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exercise",
      required: true,
    },
    difficultyAtCreation: { type: Number }, // snapshot of difficulty at workout creation
    sets: { type: Number },
    reps: { type: Number },
    duration: { type: Number }, // for cardio/time-based exercises
    aiFeatures: { type: Object, default: {} }, // snapshot AI features
  },
  { _id: false }
); // no separate _id for each exercise entry

// Mongoose schema definition
const workoutSchema = new mongoose.Schema(
  {
    creatorPublicId: { type: String, trim: true},
    uuid: { type: String, default: uuidv4, unique: true, index: true },
    workoutName: { type: String, minlength: 1, required: true, trim: true },
    exercises: [
      {
        exerciseId: {
          type: mongoose.Schema.Types.String, // or String if IDs are UUIDs
          ref: "Exercise", // reference to your Exercise model
          required: true,
        },
        reps: {
          type: Number,

        }
      },
    ],
    default: [],
    validate: [
      (arr) => arr.length <= 50, // Limits workouts to 50 exercises
      "A workout cannot contain more than 50 exercises."
    ]
  },
  { timestamps: true }
);

// Generates Mongoose model
export const User = mongoose.model("User", workoutSchema);
