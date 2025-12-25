import { NotFoundError } from "../errors/NotFoundError.js";
import * as mealRepo from "../repositories/mealRepo.js"

export async function createNewMeal(mealData){
    const meal = await mealRepo.createMeal(mealData);
    return meal;
}

export async function getAllMeals(page = 1, pageSize = 10){
    let nextPageUrl = null;
    let previousPageUrl = null;
    const skip = (page - 1) * pageSize;
    const limit = pageSize;
    const { meals, totalCount } = await mealRepo.findAllMeals(skip, limit);
    const totalPages = Math.ceil(totalCount/pageSize);
    
    if(page !== totalPages)
        nextPageUrl = `api/v1/meals/?page=${page+1}&pageLimit=${limit}`;
    
    if(page !== 1)
        previousPageUrl = `api/v1/meals/?page=${page-1}&pageLimit=${limit}`

    return { meals, previousPageUrl, nextPageUrl };
}

export async function getMeal(mealUUID){
    const meal = await mealRepo.findMealByUUID(mealUUID);
    return meal;
}

