import express from "express";
import {
  getAllWorkoutsController,
  createWorkoutController,
  getWorkoutInformationController,
} from "../controllers/workoutsController.js";

const router = express.Router();

router
.post("/create", createWorkoutController)
.get("/", getAllWorkoutsController)
.get("/:workoutId", getWorkoutInformationController)


export default router;
