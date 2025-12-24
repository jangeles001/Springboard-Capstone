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
} from "../controllers/usersController.js";

const router = express.Router();

router
  .get("/me", requireAuth, getPrivateUserInformationController)
  .patch(
    "/me",
    requireAuth,
    validate(newUserZodSchema.omit({ email: true }).partial().strict()),
    updatePrivateUserInformationController
  )
  .get("/:userPublicId", requireAuth, getPublicUserInformationController)
  .get("/:userPublicId/workouts", requireAuth, getUserWorkoutsController)
  .delete("/:userPublicId/:workoutId", requireAuth, deleteWorkoutController)
  .get("/:userPublicId/meals", requireAuth, getUserMealsController)
  .delete("/:userPublicId/:mealId", requireAuth, deleteMealController);

export default router;
