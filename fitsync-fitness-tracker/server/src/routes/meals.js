import express from "express";
import requireAuth from "../middleware/authMiddleware.js";
import validate from "../validators/authValidator.js"
import {
    getAllMealsController,
    getMealController,
    createMealController,
} from "../controllers/mealsController.js"
import { newMealZodSchema } from "../schemas/newMealZodSchema.js";
 
const router = express.Router();

router
    .post("/create", requireAuth, validate(newMealZodSchema.strict()), createMealController)
    .get("/", requireAuth, getAllMealsController)
    .get("/:mealId", requireAuth, getMealController);

export default router;