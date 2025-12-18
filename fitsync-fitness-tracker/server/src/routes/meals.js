import express from "express";
import requireAuth from "../middleware/authMiddleware.js";
import {
    getAllMealsController,
    getMealController,
    createMealController,
} from "../controllers/mealsController.js"
 
const router = express.Router();

router
    .post("/create", requireAuth, createMealController)
    .get("/", requireAuth, getAllMealsController)
    .get("/:mealId", requireAuth, getMealController);

export default router;