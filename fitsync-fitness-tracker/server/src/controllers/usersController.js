import * as userService from "../services/userService.js";
import { generateAiWorkoutRecommendations } from "../services/aiService.js";

export async function getPublicUserInformationController(req, res) {
  try {
    const { userPublicId } = req.params;
    const publicUserInformation =
      await userService.getPublicUserInformation(userPublicId);
    return res.generateSuccessResponse(publicUserInformation);
  } catch (error) {
    return res.generateErrorResponse(error.message, error.statusCode);
  }
}

export async function getPrivateUserInformationController(req, res) {
  try {
    const userUUID = req.user.sub;
    const privateUserInformation =
      await userService.getPrivateUserInformation(userUUID);
    return res.generateSuccessResponse(privateUserInformation, null, 200);
  } catch (error) {
    return res.generateErrorResponse(error.message, error.statusCode);
  }
}

export async function updatePrivateUserInformationController(req, res) {
  try {
    const userUUID = req.user.sub;
    const updatedFields = req.validatedBody;
    const updatedUserInformation =
      await userService.updatePrivateUserInformation(userUUID, updatedFields);
    const message = "Information Updated Successfully!";

    return res.generateSuccessResponse(updatedUserInformation, message);
  } catch (error) {
    return res.generateErrorResponse(error.message, error.statusCode);
  }
}

export async function getUserWorkoutsController(req, res) {
  try {
    const { publicId: userPublicId } = req.user;
    const offset = parseInt(req.query.offset) || 0;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const userWorkouts = await userService.getUserWorkouts(
      userPublicId,
      offset,
      pageSize,
    );
    return res.generateSuccessResponse(userWorkouts, null, 200);
  } catch (error) {
    return res.generateErrorResponse(error.message, error.statusCode);
  }
}

export async function getUserMealsController(req, res) {
  try {
    const { publicId: userPublicId } = req.user;
    const offset = parseInt(req.query.offset) || 0;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const userMeals = await userService.getUserMeals(
      userPublicId,
      offset,
      pageSize,
    );
    return res.generateSuccessResponse(userMeals, null, 200);
  } catch (error) {
    return res.generateErrorResponse(error.message, error.statusCode);
  }
}

export async function generateWorkoutRecommendationsController(req, res) {
  try {
    const { publicId: userPublicId } = req.user;
    const recommendations = await generateAiWorkoutRecommendations(userPublicId);
    return res.generateSuccessResponse(recommendations, "Recommendations generated!", 200);
  } catch (error) {
    return res.generateErrorResponse(error.message, error.statusCode);
  }
}

export async function generateUserWorkoutsReportController(req, res) {
  try {
    const userUUID = req.user.sub;
    const range = req.query.range;
    const reportData = await userService.generateUserWorkoutsReport(
      userUUID,
      range,
    );
    return res.generateSuccessResponse(reportData, "Reports generated!", 201);
  } catch (error) {
    return res.generateErrorResponse(error.message, error.statusCode);
  }
}

export async function generateUserNutritionReportController(req, res) {
  try {
    const userUUID = req.user.sub;
    const range = req.query.range;
    const reportData = await userService.generateUserNutritionReport(
      userUUID,
      range,
    );
    return res.generateSuccessResponse(reportData, "Reports generated!", 201);
  } catch (error) {
    return res.generateErrorResponse(error.message, error.statusCode);
  }
}
