import * as mealRepo from "../repositories/mealRepo.js"

export async function createNewMeal(mealData){
    const meal = await mealRepo.createMeal(mealData);
    return meal;
}

export async function getMeal(mealUUID){
    const meal = await mealRepo.findMealByUUID(mealUUID);
    return meal;
}

export async function getAllMeals(){
    const allMeals = await mealRepo.findAllMeals();
    return allMeals;
}