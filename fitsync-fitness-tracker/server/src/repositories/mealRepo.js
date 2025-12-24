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

export async function findAllMeals(){
  return await Meal.find({}).select(PRIVATE_FIELDS_EXCLUSIONS);
}

export async function findMealsByCreatorPublicId(userPublicId) {
  return await Meal.find({ creatorPublicId: userPublicId }).select(PRIVATE_FIELDS_EXCLUSIONS);
}

export async function findMealByUUID(mealUUID){
  const meal = await Meal.findOne({ uuid: mealUUID });
  return meal.toJSON();
}
