import { Meal } from "../models/mealModel.js";

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

export async function findAllMealsByIds(mealUUIDs) {
  const meals = await Meal.find({ uuid: { $in: mealUUIDs } })
    .select(PRIVATE_FIELDS_EXCLUSIONS)
    .lean();
  return meals;
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

  if (!meal) return meal;

  return meal.toJSON();
}
