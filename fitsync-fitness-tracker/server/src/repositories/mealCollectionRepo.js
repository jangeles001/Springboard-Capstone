import { MealCollection } from "../models/mealCollectionModel.js";

export async function findMealCollectionsByUserPublicId(userPublicId) {
  return await MealCollection.find({
    userPublicId,
  }).populate("mealUUID").lean();
}

export async function findMealInCollectionByMealId(userPublicId, mealUUID) {
  return await MealCollection.find({
    userPublicId,
    mealUUID,
    isDeleted: false,
  }).lean();
}

export async function addMealToCollection(userPublicId, mealUUID) {
  const newEntry = await MealCollection.create({
    userPublicId,
    mealUUID,
  });
  return newEntry.toJSON();
}

export async function findMealsInCollectionByUserPublicId(
  userPublicId,
  offset = 0,
  pageSize = 10,
) {

  const meals = await MealCollection.find({ userPublicId })
    .populate("mealUUID")
    .skip(offset)
    .limit(pageSize)
    .lean();

  const totalCount = await MealCollection.countDocuments({ userPublicId });

  return { meals, totalCount };
}

export async function removeMealFromCollection(userPublicId, mealUUID) {
  await MealCollection.deleteOne({ userPublicId, mealUUID });
  return;
}