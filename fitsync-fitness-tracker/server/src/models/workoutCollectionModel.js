import mongoose from "mongoose";

const workoutCollectionSchema = new mongoose.Schema(
  {
    userPublicId: {
      type: String,
      required: true,
      index: true,
    },

    // Workout reference
    workoutUUID: {
      type: String,
      required: true,
      index: true,
    },

    addedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },

    // Soft deletion field
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },

    snapshot:{
      type: Object,
      default: {},
    },
  },
  { timestamps: true }
);

// Prevent duplicate saves for same user + workout
workoutCollectionSchema.index(
  { "snapshot.uuid": 1 },
  {
    unique: true,
    partialFilterExpression: {
      "snapshot.uuid": { $exists: true },
    },
  }
);

export const WorkoutCollection =
  mongoose.models.WorkoutCollection ||
  mongoose.model("WorkoutCollection", workoutCollectionSchema);