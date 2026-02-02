import express from "express";
import {
  getAllWorkoutsController,
  createWorkoutController,
  deleteWorkoutController,
  duplicateWorkoutController,
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
    validate(newWorkoutZodSchema.omit({ creatorPublicId: true })),
    createWorkoutController,
  )
  .delete(
    "/delete/:workoutId",
    requireAuth,
    deleteWorkoutController,
  )
  .post("/duplicate/:workoutId", requireAuth, duplicateWorkoutController)
  .get("/", requireAuth, getAllWorkoutsController)
  .get("/:workoutId", requireAuth, getWorkoutInformationController);

export default router;
