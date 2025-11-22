import express from "express";
import validate from "../validators/authValidator.js";
import { newUserZodSchema } from "../schemas/newUserZodSchema.js";
import {
  createUser,
  login,
  logout,
  refreshSessionTokens,
} from "../controllers/authController.js";
import requireAuth from "../middleware/authMiddleware.js";

// Swagger and stellar for api documentation

const router = express.Router();

router
  .post("/register", validate(newUserZodSchema), createUser)
  .post(
    "/login",
    validate(newUserZodSchema.pick({ email: true, password: true })),
    login
  )
  .get("/logout", logout)
  .get("/refresh", refreshSessionTokens);

export default router;
