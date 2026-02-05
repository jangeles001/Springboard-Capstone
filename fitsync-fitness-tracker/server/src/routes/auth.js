import express from "express";
import validate from "../validators/authValidator.js";
import requireAuth from "../middleware/authMiddleware.js";
import { newUserZodSchema } from "../schemas/newUserZodSchema.js";
import { verifyRecaptcha } from "../middleware/recaptchaMiddleware.js";
import {
  createUser,
  login,
  logout,
  getUserController,
  refreshSessionTokens,
  verifyController,
} from "../controllers/authController.js";

// Swagger and stellar for api documentation

const router = express.Router();

router
  .post("/register", validate(newUserZodSchema.strict()), createUser)
  .post(
    "/login",
    validate(
      newUserZodSchema
        .pick({ email: true, password: true, reCaptchaToken: true })
        .strict(),
    ),
    verifyRecaptcha,
    login,
  )
  .get("/logout", logout)
  .get("/refresh", refreshSessionTokens)
  .get("/me", requireAuth, getUserController)
  .patch("/verify/:type/:token", verifyController);

export default router;
