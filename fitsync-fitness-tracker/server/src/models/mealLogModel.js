import mongoose from "mongoose";
import { mealIngredientSchema, macrosSchema } from "./mealModel.js";

const mealLogSchema = new mongoose.Schema(
  {
    creatorPublicId: {
      type: String,
      required: true,
      index: true,
    },

    // Reference to a saved meal
    sourceMealUUID: {
      type: String,
      required: true,
    },

    mealNameSnapshot: {
      type: String,
      required: true,
    },

    mealDescriptionSnapshot: {
      type: String,
      required: true,
    },

    ingredientsSnapshot: {
      type: [mealIngredientSchema],
      required: true,
    },

    macrosSnapshot: {
      type: macrosSchema,
      default: {},
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
  { timestamps: true },
);

export const MealLog = mongoose.model("MealLog", mealLogSchema);
