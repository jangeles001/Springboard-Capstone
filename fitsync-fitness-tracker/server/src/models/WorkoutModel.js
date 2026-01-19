import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const numberValidation = {
  validator: (v) => Number.isInteger(v),
  message: "Must be an integer!",
};

export const workoutExerciseSchema = new mongoose.Schema(
  {
    exerciseId: {
      type: String,
      required: true,
      trim: true,
    },
    exerciseName: { type: String, required: true },

    muscles: {
      type: [String],
      default: ["Unknown"],
    },

    description: { type: String, required: true },
    difficultyAtCreation: { type: Number, default: 5, required: true }, // snapshot of difficulty at workout creation
    reps: {
      type: Number,
      required: true,
      min: [0, "Reps cannot be negative!"],
      validate: {
        validator: (v) => Number.isInteger(v),
        message: "Reps must be an integer!",
      },
    },
    weight: {
      type: Number,
      min: [0, "Weight Cannot be negative!"],
      validate: {
        validator: (v) => Number.isInteger(v),
        message: "Weight must be an integer!",
      },
    },
    duration: {
      type: Number,
      min: [0, "Duration cannot be negative!"],
    },
    aiFeatures: { type: Object, default: {} }, // snapshot AI features
  },
  { _id: false }
);

// Mongoose schema definition
const workoutSchema = new mongoose.Schema(
  {
    creatorPublicId: { type: String, trim: true, required: true },
    uuid: { type: String, default: uuidv4, unique: true, index: true },
    workoutName: {
      type: String,
      minlength: 1,
      required: [true, "Workout must have a name!"],
      trim: true,
      minlength: [1, "Workout name cannot be empty!"],
      maxlength: [60, "Workout name cannot exceed 60 characters!"],
    },
    workoutDuration: {
      type: Number, // in Minutes
      min: 0,
      required: true,
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

workoutSchema.set("toJSON", {
  transform: function (doc, ret, options) {
    delete ret.__v;
    delete ret._id;
    delete ret.updatedAt;
    return ret;
  },
});

// Virtual Populate for Exercise Details
workoutSchema.virtual("exerciseDetails", {
  ref: "Exercise",
  localField: "exercises.exerciseId",
  foreignField: "exerciseId",
  justOne: false,
});

// Generates Mongoose model
export const Workout =
  mongoose.models.Workout || mongoose.model("Workout", workoutSchema);
