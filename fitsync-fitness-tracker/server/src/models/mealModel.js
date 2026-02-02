import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

export const macrosSchema = new mongoose.Schema(
  {
    protein: { type: Number, required: true },
    fat: { type: Number, required: true },
    carbs: { type: Number, required: true },
    fiber: { type: Number, required: true },
    netCarbs: { type: Number, required: true },
    calories: { type: Number, required: true },
  },
  { _id: false }, // Removes _id from the ingredient object
);

export const mealIngredientSchema = new mongoose.Schema(
  {
    ingredientId: { type: Number, required: true }, // FDCID item id
    ingredientName: { type: String, required: true },
    quantity: { type: Number, required: true },
    macros: { type: macrosSchema, required: true },
    caloriesPer100G: { type: Number, required: true },
    macrosPer100G: { type: macrosSchema, required: true },
  },
  { _id: false }, // Removes _id from the ingredient object
);

const mealSchema = new mongoose.Schema(
  {
    creatorPublicId: { type: String, required: true },
    uuid: { type: String, default: uuidv4, required: true, unique: true },
    mealName: { type: String, required: true },
    mealDescription: { type: String, required: true },
    ingredients: {
      type: [mealIngredientSchema],
      required: true,
      default: [],
    },

    mealMacros: { type: macrosSchema, required: true },

    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  { timestamps: true },
);

mealSchema.set("toJSON", {
  transform: function (doc, ret, options) {
    delete ret._id;
    delete ret.__v;
    delete ret.createdAt;
    delete ret.updatedAt;
    return ret;
  },
});

export const Meal = mongoose.model("Meal", mealSchema);
