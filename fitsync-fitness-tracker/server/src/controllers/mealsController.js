import * as mealService from "../services/mealService.js"

export async function createMealController(req, res){
    try{
        const newMealData = req.body;
        const newMeal = await mealService.createNewMeal(newMealData);
        return res.status(201).json({ 
            message: " Meal Created Successfully!",
            createdMeal: newMeal,
         })
    }catch(error){
        return res.status(500).json({ error: error.message });
    }
}

export async function getAllMealsController(req, res){
    try{
        const allMeals = await mealService.getAllMeals();
        return res.status(200).json({ allMeals });
    }catch(error){
        return res.status(500).json({ error: error.message });
    }
} 

export async function getMealController(req, res){
    try{
        const mealUUID = req.params.mealId;
        const mealInfo = await mealService.getMeal(mealUUID)
        return res.status(200).json({ mealInfo });
    } catch(error){
        return res.status(500).json({ error: error.message });
    }
}