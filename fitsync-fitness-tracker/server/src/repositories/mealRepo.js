import { Meal } from "../models/mealModel.js";

const PRIVATE_FIELDS_EXCLUSIONS = "-_id -createdAt -updatedAt"

export async function createMeal(mealData) {
  const newMeal = await Meal.create(mealData);
  return newMeal.toJSON();
}

export async function deleteOneMealById(mealId){
  await Meal.deleteOne({ uuid: mealId})
  return;
}

export async function findAllMeals(skip, limit){
  const meals = await Meal.find({}).skip(skip).limit(limit).select(PRIVATE_FIELDS_EXCLUSIONS);
  const totalCount = await Meal.countDocuments();
  return { meals, totalCount }
}

export async function findMealsByCreatorPublicId(userPublicId) {
  return await Meal.find({ creatorPublicId: userPublicId }).select(PRIVATE_FIELDS_EXCLUSIONS);
}

export async function findMealByUUID(mealUUID){
  const meal = await Meal.findOne({ uuid: mealUUID });
  return meal.toJSON();
}
