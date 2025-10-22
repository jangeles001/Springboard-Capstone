import express from "express";
import {
  getAllWorkouts,
  createWorkout,
} from "../controllers/workoutsController.js";

const router = express.Router();

router.get("/", getAllWorkouts);
router.post("/createWorkout", createWorkout);

export default router;
