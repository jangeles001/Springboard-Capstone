import { Meal } from "../models/MealModel.js";

const PRIVATE_FIELDS_EXCLUSIONS = "-_id -createdAt -updatedAt";

export async function createMeal(mealData) {
  const newMeal = await Meal.create(mealData);
  return newMeal.toJSON();
}

export async function deleteOneMealById(mealId) {
  await Meal.deleteOne({ uuid: mealId });
  return;
}

export async function findAllMeals(offset, limit) {
  const meals = await Meal.find({})
    .skip(offset)
    .limit(limit)
    .select(PRIVATE_FIELDS_EXCLUSIONS);
  const totalCount = await Meal.countDocuments();
  return { meals, totalCount };
}

export async function findMealsByCreatorPublicId(userPublicId, offset, limit) {
  const meals = await Meal.find({ creatorPublicId: userPublicId })
    .skip(offset)
    .limit(limit)
    .select(PRIVATE_FIELDS_EXCLUSIONS);
  const totalCount = await Meal.countDocuments();
  return { meals, totalCount };
}

export async function findOneMealByUUID(mealUUID) {
  const meal = await Meal.findOne({ uuid: mealUUID });
  return meal.toJSON();
}

export async function duplicateOneMealByUUID(mealId) {
  return;
}
