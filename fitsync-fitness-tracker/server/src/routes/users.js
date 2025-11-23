import express, { request } from "express";
import validate from "../validators/authValidator.js";
import { newUserZodSchema } from "../schemas/newUserZodSchema.js";
import requireAuth from "../middleware/authMiddleware.js";
import { getPrivateUserInformation, getPublicUserInformation, updatePrivateUserInformation, getUserCreatedWorkouts, getUserCreatedMeals} from "../controllers/usersController.js"

const router = express.Router();

router
    .get("/me", requireAuth, getPrivateUserInformation)
    .patch("/me", requireAuth, validate(newUserZodSchema.omit({ email: true }).partial().strict()), updatePrivateUserInformation)
    .get("/:publicId", requireAuth, getPublicUserInformation)
    .get("/workouts/:publicId", requireAuth, getUserCreatedWorkouts)
    .get("/meals/:userId", requireAuth, getUserCreatedMeals);

export default router;