import express from "express";
import validate from "../validators/authValidator.js";
import { newUserZodSchema } from "../schemas/newUserZodSchema.js";
import requireAuth from "../middleware/authMiddleware.js";
import {
  getPrivateUserInformationController,
  getPublicUserInformationController,
  updatePrivateUserInformationController,
  getUserWorkoutsController,
  getUserMealsController,
  generateUserWorkoutsReportController,
  generateUserNutritionReportController,
  generateWorkoutRecommendationsController,
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
  .get("/recommendations/workouts", requireAuth, generateWorkoutRecommendationsController)
  .get("/workouts", requireAuth, getUserWorkoutsController)
  .get("/meals", requireAuth, getUserMealsController)
  .get("/:userPublicId", requireAuth, getPublicUserInformationController);

export default router;
