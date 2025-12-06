import express from "express";
import {
  getAllWorkoutsController,
  createWorkoutController,
} from "../controllers/workoutsController.js";

const router = express.Router();

router.get("/", getAllWorkoutsController);
router.post("/createWorkout", createWorkoutController);

export default router;
