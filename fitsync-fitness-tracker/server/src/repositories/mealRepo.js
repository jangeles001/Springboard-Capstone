import { Meal } from "../models/mealModel.js";

export async function createMeal(mealData) {
  return await Meal.create(mealData);
}

export async function findMealsByCreatorPublicId(userPublicId) {
  return await Meal.find({ creatorPublicId: userPublicId });
}
