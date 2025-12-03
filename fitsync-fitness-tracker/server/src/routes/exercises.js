import express from 'express';
import requireAuth from '../middleware/authMiddleware.js';
import {
    createExerciseController,
    getExerciseController,
    getExercisesController,
} from "../controllers/exercisesController.js"

const router = express.Router();

router
.post("/", requireAuth, createExerciseController)
.get("/", requireAuth, getExercisesController)
.get("/:exerciseId", requireAuth, getExerciseController)

export default router;