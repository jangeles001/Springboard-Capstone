import { MealCollection } from "../models/mealCollectionModel.js";
import { findAllMealsByIds } from "./mealRepo.js";

export async function addMealToCollection(userPublicId, mealUUID) {
  const newEntry = await MealCollection.create({
    userPublicId,
    mealUUID,
  });
  return newEntry.toJSON();
}

export async function findMealCollectionsByUserPublicId(userPublicId) {
  return await MealCollection.find({
    userPublicId,
  })
    .populate("mealUUID")
    .lean();
}

export async function findMealInCollectionById(userPublicId, mealUUID) {
  return await MealCollection.findOne({
    userPublicId,
    mealUUID,
  }).lean();
}

export async function findMealsInCollectionByUserPublicId(
  userPublicId,
  offset = 0,
  pageSize = 10,
) {
  // Fetches collection docs
  const collectionDocs = await MealCollection.find({
    userPublicId
  })
    .skip(offset)
    .limit(pageSize)
    .lean();

  const totalCount = await MealCollection.countDocuments({
    userPublicId
  });

  return {
    collectionDocs,
    totalCount,
    };
}

export async function removeMealFromCollection(userPublicId, mealUUID) {
  await MealCollection.deleteOne({ userPublicId, mealUUID });
  return;
}

export async function updateDeletedMealInCollection(mealUUID, updateData) {
  await MealCollection.updateMany(
    {
      mealUUID,
      isDeleted: false,
      snapshot: { $exists: false },
    },
    {
      $set: {
        isDeleted: true,
        snapshot: {
          creatorPublicId: updateData.creatorPublicId,
          uuid: updateData.uuid,
          mealName: updateData.mealName,
          mealDescription: updateData.mealDescription,
          ingredients: updateData.ingredients,
          mealMacros: updateData.mealMacros,
        },
      },
    },
  );
  return;
}
