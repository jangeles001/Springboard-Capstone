import * as mealRepo from "../repositories/mealRepo.js";
import * as mealLogRepo from "../repositories/mealLogRepo.js";
import * as mealCollectionRepo from "../repositories/mealCollectionRepo.js";
import { NotFoundError } from "../errors/NotFoundError.js";

export async function createNewMeal(mealData, userPublicId) {
  const meal = await mealRepo.createMeal({
    ...mealData,
    creatorPublicId: userPublicId,
  });

  // Add to collection and create log in parallel
  await Promise.all([
    mealCollectionRepo.addMealToCollection(userPublicId, meal.uuid),
    mealLogRepo.createOneMealLogEntry({
      creatorPublicId: userPublicId,
      sourceMealUUID: meal.uuid,
      mealNameSnapshot: meal.mealName,
      mealDescriptionSnapshot: meal.mealDescription,
      ingredientsSnapshot: meal.ingredients,
      macrosSnapshot: meal.mealMacros,
      consumedAt: new Date(),
    }),
  ]);

  return meal;
}

export async function duplicateMeal(publicId, mealId) {
  const meal = await mealRepo.findOneMealByUUID(mealId);
  if (!meal) throw new NotFoundError("MEAL");

  const collection = await mealCollectionRepo.findMealInCollectionById(
    publicId,
    mealId,
  );

  if (collection) {
    await mealLogRepo.createOneMealLogEntry({
      creatorPublicId: publicId,
      sourceMealUUID: mealId,
      mealNameSnapshot: meal.mealName,
      mealDescriptionSnapshot: meal.mealDescription,
      ingredientsSnapshot: meal.ingredients,
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
      mealDescriptionSnapshot: meal.mealDescription,
      ingredientsSnapshot: meal.ingredients,
      macrosSnapshot: meal.mealMacros,
      consumedAt: new Date(),
    }),
    mealCollectionRepo.addMealToCollection(publicId, mealId),
  ]);

  return;
}

export async function deleteMeal(publicId, mealId) {

  console.log("Deleting meal with ID:", mealId, "for user:", publicId);

  // Fetch meals and collections entry in parallel
  const [meal, collectionEntry] = await Promise.all([
    mealRepo.findOneMealByUUID(mealId),
    mealCollectionRepo.findMealInCollectionById(
      publicId, 
      mealId,
    ),
  ]);

  // Meal doesn't exist (only collection entry or nothing)
  if (!meal) {
    if (!collectionEntry) {
      throw new NotFoundError("MEAL");
    }

    // Remove from collection and mark logs as deleted in parallel
    await Promise.all([
      mealCollectionRepo.removeMealFromCollection(publicId, mealId),
      mealLogRepo.updateDeletedMealLogStatus(mealId, true),
    ]);
    return;
  }

  // User is NOT the creator (removing someone else's meal from their collection)
  if (meal.creatorPublicId !== publicId) {
    await Promise.all([
      mealCollectionRepo.removeMealFromCollection(publicId, mealId),
    ]);
    return;
  }

  // Case 3: User IS the creator (delete the meal itself)
  await Promise.all([
    mealCollectionRepo.removeMealFromCollection(publicId, mealId),
    mealCollectionRepo.updateDeletedMealInCollection(mealId, {
      creatorPublicId: meal.creatorPublicId,
      uuid: meal.uuid,
      mealName: meal.mealName,
      mealMacros: meal.mealMacros,
    }),
    mealRepo.deleteOneMealById(mealId),
    mealLogRepo.updateDeletedMealLogStatus(mealId, true),
  ]);
}

export async function getMealInformation(mealId) {
  const meal = await mealRepo.findOneMealByUUID(mealId);
  if (!meal) {
    const collection =
      await mealCollectionRepo.findMealInCollectionById(mealId);
    return collection[0].snapshot;
  }

  return meal;
}

export async function getAllMeals(offset = 0, pageSize = 10) {
  let hasNextPage = null;
  let hasPreviousPage = null;
  const { meals, totalCount } = await mealRepo.findAllMeals(offset, pageSize);

  if (offset + pageSize < totalCount - 1) hasNextPage = true;

  if (offset > 0) hasPreviousPage = true;

  return { meals, hasPreviousPage, hasNextPage };
}
