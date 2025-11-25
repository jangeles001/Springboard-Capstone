import express from "express";
import validate from "../validators/authValidator.js";
import { newUserZodSchema } from "../schemas/newUserZodSchema.js";
import requireAuth from "../middleware/authMiddleware.js";
import {
  getPrivateUserInformationController,
  getPublicUserInformationController,
  updatePrivateUserInformationController,
  getUserCreatedWorkouts,
  getUserCreatedMeals,
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
  .get("/:publicId", requireAuth, getPublicUserInformationController)
  .get("/workouts/:publicId", requireAuth, getUserCreatedWorkouts)
  .get("/meals/:userId", requireAuth, getUserCreatedMeals);

export default router;
