import * as mealRepo from "../repositories/mealRepo.js";
import * as mealLogRepo from "../repositories/mealLogRepo.js";

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

export async function getMeal(mealUUID) {
  const meal = await mealRepo.findMealByUUID(mealUUID);
  return meal;
}
