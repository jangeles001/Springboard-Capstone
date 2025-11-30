import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const mealSchema = new mongoose.Schema(
  {
    creatorPublicId: { type: String, required: true },
    uuid: { type: String, default: uuidv4, required: true, unique: true },
    mealName: { type: String, required: true },
    description: { type: String, required: true },
    ingredients: {
      type: Object, // TODO: Make into a schema
      required: true,
      default: {},
    },
    protein: { type: Number, required: true },
    fat: { type: Number, required: true },
    carbs: { type: Number, required: true },
    fiber: { type: Number, required: true },
    netCarbs: { type: Number, required: true },
    calories: { type: Number, required: true },
  },
  { timestamps: true }
);

export const Meal = mongoose.model("Meal", mealSchema);
