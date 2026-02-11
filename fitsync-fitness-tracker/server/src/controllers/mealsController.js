import * as mealService from "../services/mealService.js";

export async function createMealController(req, res) {
  try {
    const newMealData = req.body;
    const { publicId } = req.user;
    await mealService.createNewMeal(newMealData, publicId);
    return res.generateSuccessResponse(null, "Meal Created Successfully!", 201);
  } catch (error) {
    return res.generateErrorResponse(error.message, error.statusCode);
  }
}

export async function deleteMealController(req, res) {
  try {
    const { mealId } = req.params;
    const { publicId } = req.user;
    await mealService.deleteMeal(publicId, mealId);
    return res.generateSuccessResponse(null, "Meal Deleted Successfully!", 200);
  } catch (error) {
    return res.generateErrorResponse(error.message, error.statusCode);
  }
}

export async function duplicateMealController(req, res) {
  try {
    const { mealId } = req.params;
    const { publicId } = req.user;
    await mealService.duplicateMeal(publicId, mealId);
    return res.generateSuccessResponse(
      null,
      "Meal Duplicated Successfully!",
      201,
    );
  } catch (error) {
    return res.generateErrorResponse(error.message, error.statusCode);
  }
}

export async function getAllMealsController(req, res) {
  try {
    const offset = parseInt(req.query.page) || 0;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const allMealsData = await mealService.getAllMeals(offset, pageSize);
    return res.generateSuccessResponse(allMealsData, "Success!", 200);
  } catch (error) {
    return res.generateErrorResponse(error.message, error.statusCode);
  }
}

export async function getMealInformationController(req, res) {
  try {
    const { mealId } = req.params;
    const { publicId } = req.user;
    const mealInfo = await mealService.getMealInformation(publicId, mealId);
    return res.generateSuccessResponse(mealInfo, "Success!");
  } catch (error) {
    console.log(error);
    return res.generateErrorResponse(error.message, error.statusCode);
  }
}
