import express from "express";
import {
  getAllWorkoutsController,
  createWorkoutController,
  getWorkoutInformationController,
} from "../controllers/workoutsController.js";
import requireAuth from "../middleware/authMiddleware.js";

const router = express.Router();

router
  .post("/create", requireAuth, createWorkoutController)
  .get("/", requireAuth, getAllWorkoutsController)
  .get("/:workoutId", requireAuth, getWorkoutInformationController);

export default router;
