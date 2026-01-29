import express from "express";
import validate from "../validators/authValidator.js";
import { newUserZodSchema } from "../schemas/newUserZodSchema.js";
import requireAuth from "../middleware/authMiddleware.js";
import {
  getPrivateUserInformationController,
  getPublicUserInformationController,
  updatePrivateUserInformationController,
  getUserWorkoutsController,
  deleteWorkoutController,
  getUserMealsController,
  deleteMealController,
  generateUserWorkoutsReportController,
  generateUserNutritionReportController,
  duplicateWorkoutController,
  duplicateMealController,
} from "../controllers/usersController.js";

const router = express.Router();

router
  .get("/me", requireAuth, getPrivateUserInformationController)
  .patch(
    "/me",
    requireAuth,
    validate(newUserZodSchema.omit({ email: true }).partial().strict()),
    updatePrivateUserInformationController,
  )
  .get("/reports/workouts", requireAuth, generateUserWorkoutsReportController)
  .get("/reports/nutrition", requireAuth, generateUserNutritionReportController)
  .get("/:userPublicId/workouts", requireAuth, getUserWorkoutsController)
  .post(
    "/:userPublicId/workouts/:workoutId",
    requireAuth,
    duplicateWorkoutController,
  )
  .delete(
    "/:userPublicId/workouts/:workoutId",
    requireAuth,
    deleteWorkoutController,
  )
  .get("/:userPublicId/meals", requireAuth, getUserMealsController)
  .post("/:userPublicId/meals/:mealId", requireAuth, duplicateMealController)
  .delete("/:userPublicId/meals/:mealId", requireAuth, deleteMealController)
  .get("/:userPublicId", requireAuth, getPublicUserInformationController);

export default router;
