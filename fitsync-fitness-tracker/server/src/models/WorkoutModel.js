import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const workoutExerciseSchema = new mongoose.Schema(
  {
    exerciseId: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: async function (id) {
          const exists = await Exercise.exists({ exerciseId: id });
          return !!exists; // !! Ensures true or false is returned
        },
        message: "Invalid exerciseId: Exercise does not exist!"
      },
    },
    difficultyAtCreation: { type: Number, default: 5, required: true }, // snapshot of difficulty at workout creation
    sets: {
      type: Number,
      min: [0, "Sets cannot be negative!"],
      validate: {
        validator: (v) => Number.isInteger(v),
        message: "Sets must be an integer!",
      },
    },
    reps: {
      type: Number,
      default: 0,
      min: [0, "Reps cannot be negative!"],
      validate: {
        validator: (v) => Number.isInteger(v),
        message: "Reps must be an integer!",
      },
    },
    weight: { 
      type: Number, 
      default: 0,
      min: [0, "Weight Cannot be negative!"],
      validate: { 
        validator: (v) => Number.isInteger(v),
        message: "Weight must be an integer!"
      } 
    },
    duration: { type: Number, default: 0, min: [0, "Duration cannot be negative!"] }, // for cardio/time-based exercises
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
      required: true,
      validate: [
        {
          validator: function (array) {
            return array.length <= 50;
          },
          message: "A workout cannot contain more than 50 exercises.",
        },
        {
          validator: function (array) {
            // Ensures no duplicate exerciseId entries
            const ids = array.map((entry) => entry.exerciseId);
            return new Set(ids).size === ids.length;
          },
          message: "Duplicate exercises are not allowed.",
        },
      ],
    },
  },
  { timestamps: true }
);

// Virtual Populate for Exercise Details
workoutSchema.virtual("exerciseDetails", {
  ref: "Exercise",
  localField: "exercises.exerciseId",
  foreignField: "exerciseId",
  justOne: false,
});

// Generates Mongoose model
export const Workout = mongoose.model("Workout", workoutSchema);
