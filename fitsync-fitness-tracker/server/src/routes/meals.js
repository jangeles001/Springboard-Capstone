import express from "express";
import requireAuth from "../middleware/authMiddleware.js";
import validate from "../validators/authValidator.js"
import {
    createMealController,
    getAllMealsController,
    getMealController,
    deleteMealController,
    duplicateMealController,
} from "../controllers/mealsController.js"
import { newMealZodSchema } from "../schemas/newMealZodSchema.js";
 
const router = express.Router();

router
    .post("/create", requireAuth, validate(newMealZodSchema), createMealController)
    .delete("/:userPublicId/meals/:mealId", requireAuth, deleteMealController)
    .post("/duplicate/:mealId", requireAuth, duplicateMealController)
    .get("/", requireAuth, getAllMealsController)
    .get("/:mealId", requireAuth, getMealController)

export default router;