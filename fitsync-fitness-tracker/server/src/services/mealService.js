import { NotFoundError } from "../errors/NotFoundError.js";
import * as mealRepo from "../repositories/mealRepo.js";

export async function createNewMeal(mealData) {
  const meal = await mealRepo.createMeal(mealData);
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
