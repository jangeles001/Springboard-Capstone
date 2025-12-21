import * as mealService from "../services/mealService.js"

export async function createMealController(req, res){
    try{
        const newMealData = req.body;
        await mealService.createNewMeal(newMealData);
        return res.generateSuccessResponse(null, "Meal Created Successfully!", 201);
    }catch(error){
        return res.generateErrorResponse(error.message, error.statusCode);
    }
}

export async function getAllMealsController(req, res){
    try{
        const allMeals = await mealService.getAllMeals();
        return res.generateSuccessResponse(allMeals, "Success!", 200);
    }catch(error){
        return res.generateErrorResponse(error.message, error.statusCode);
    }
} 

export async function getMealController(req, res){
    try{
        const mealUUID = req.params.mealId;
        const mealInfo = await mealService.getMeal(mealUUID)
        return res.generateSuccessResponse(mealInfo, "Success!");
    } catch(error){
        return res.generateErrorResponse(error.message, error.statusCode);
    }
}