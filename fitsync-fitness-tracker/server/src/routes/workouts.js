import express from "express";
import {
  getAllWorkoutsController,
  createWorkoutController,
  getWorkoutInformationController,
} from "../controllers/workoutsController.js";
import requireAuth from "../middleware/authMiddleware.js";
import { newWorkoutZodSchema } from "../schemas/newWorkoutZodSchema.js";
import validate from "../validators/authValidator.js";

const router = express.Router();

router
  .post(
    "/create",
    requireAuth,
    validate(newWorkoutZodSchema),
    createWorkoutController,
  )
  .get("/", requireAuth, getAllWorkoutsController)
  .get("/:workoutId", requireAuth, getWorkoutInformationController);

export default router;
