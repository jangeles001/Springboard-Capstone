import mongoose from "mongoose";

const mealCollectionSchema = new mongoose.Schema(
  {
    userPublicId: {
      type: String,
      required: true,
      index: true,
    },

    // Meal reference
    mealUUID: {
      type: String,
      required: true,
      index: true,
    },

    addedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },

  },
  { timestamps: true }
);

// Prevent duplicate saves for same user + meal
mealCollectionSchema.index(
  { userPublicId: 1, mealUUID: 1 },
  { unique: true }
);

export const MealCollection =
  mongoose.models.MealCollection ||
  mongoose.model("MealCollection", mealCollectionSchema);