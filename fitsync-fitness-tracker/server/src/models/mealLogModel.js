import mongoose from "mongoose";

const mealLogSchema = new mongoose.Schema(
  {
    userPublicId: {
      type: String,
      required: true,
      index: true,
    },

    // Reference to a saved meal
    mealUUID: {
      type: String,
    },

    // Snapshot data (DO NOT reference Meal dynamically)
    mealNameSnapshot: {
      type: String,
      required: true,
    },

    macrosSnapshot: {
      protein: { type: Number, required: true },
      fat: { type: Number, required: true },
      carbs: { type: Number, required: true },
      fiber: { type: Number, required: true },
      netCarbs: { type: Number, required: true },
      calories: { type: Number, required: true },
    },

    servings: {
      type: Number,
      default: 1,
      min: 0.25,
    },

    consumedAt: {
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
      ref: "MealLog",
    },
  },
  { timestamps: true }
);

export const MealLog = mongoose.model("MealLog", mealLogSchema);
