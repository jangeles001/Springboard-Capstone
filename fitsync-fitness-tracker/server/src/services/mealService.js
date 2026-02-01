import * as mealRepo from "../repositories/mealRepo.js";
import * as mealLogRepo from "../repositories/mealLogRepo.js";
import * as mealCollectionRepo from "../repositories/mealCollectionRepo.js";

export async function createNewMeal(mealData) {
  const meal = await mealRepo.createMeal(mealData);
  if (meal) {
    const mealLogData = {
      userPublicId: meal.creatorPublicId,
      mealUUID: meal.uuid,
      mealNameSnapshot: meal.mealName,
      macrosSnapshot: meal.mealMacros,
      consumedAt: new Date(),
      correctedFromLogId: null,
    };

    await mealLogRepo.createOneMealLogEntry(mealLogData);
    await mealCollectionRepo.addMealToCollection(
      meal.creatorPublicId,
      meal.uuid,
    );
  }

  return meal;
}
  
export async function duplicateMeal(publicId, mealId) {
  const meal = await mealRepo.findOneMealByUUID(mealId);
  if (!meal) throw new NotFoundError("MEAL");

  const collection = await mealCollectionRepo.findMealInCollectionByMealId(publicId, mealId);
  
  if(collection && collection.length > 0){
    mealLogRepo.createOneMealLogEntry({
      creatorPublicId: publicId,
      sourceMealUUID: mealId, 
      mealNameSnapshot: meal.mealName,
      macrosSnapshot: meal.mealMacros,
      consumedAt: new Date(),
    });
    return; 
  }

  await Promise.all([
    mealLogRepo.createOneMealLogEntry({
      creatorPublicId: publicId,
      sourceMealUUID: mealId,
      mealNameSnapshot: meal.mealName,
      macrosSnapshot: meal.mealMacros,
      consumedAt: new Date(),
    }),
    mealCollectionRepo.addMealToCollection(publicId, mealId),
  ]);

  return;
}

export async function deleteMeal(publicId, mealId) {
  // Fetch meals and collections entry in parallel
  const [meal, collectionEntries] = await Promise.all([
    mealRepo.findOneMealByUUID(mealId),
    mealCollectionRepo.findMealInCollectionByMealId(publicId, mealId),
  ]);

  const hasCollectionEntry = collectionEntries && collectionEntries.length > 0;

  // Meal doesn't exist (only collection entry or nothing)
  if (!meal) {
    if (!hasCollectionEntry) {
      throw new NotFoundError("MEAL");
    }

    // Remove from collection and mark logs as deleted in parallel
    await Promise.all([
      mealCollectionRepo.removeMealFromCollection(
        publicId,
        mealId,
      ),
      mealLogRepo.updateUserDeletedMealLogStatus(
        publicId,
        mealId,
        true,
      ),
    ]);
    return;
  }

  // User is NOT the creator (removing someone else's meal from their collection)
  if (meal.creatorPublicId !== publicId) {
    await Promise.all([
      mealCollectionRepo.removeMealFromCollection(
        publicId,
        mealId,
      ),
      mealLogRepo.updateUserDeletedMealLogStatus(
        publicId,
        mealId,
        true,
      ),
    ]);
    return;
  }

  // Case 3: User IS the creator (delete the meal itself)
  await Promise.all([
    mealCollectionRepo.removeMealFromCollection(
      publicId,
      mealId,
    ),
    mealCollectionRepo.updateDeletedMealInCollection(mealId, {
      mealName: meal.mealName,
      mealMacros: meal.mealMacros,
    }),
    mealRepo.deleteOneMealById(mealId),
    mealLogRepo.updateUserDeletedMealLogStatus(publicId, mealId, true),
  ]);
}

export async function getAllMeals(offset = 0, pageSize = 10) {
  let hasNextPage = null;
  let hasPreviousPage = null;
  const { meals, totalCount } = await mealRepo.findAllMeals(offset, pageSize);

  if (offset + pageSize < totalCount - 1) hasNextPage = true;

  if (offset > 0) hasPreviousPage = true;

  return { meals, hasPreviousPage, hasNextPage };
}

export async function getMeal(mealUUID) {
  const meal = await mealRepo.findOneMealByUUID(mealUUID);
  return meal;
}
