import express from "express";
import validate from "../validators/authValidator.js";
import { newUserZodSchema } from "../schemas/newUserZodSchema.js";
import {
  createUser,
  login,
  logout,
  refreshSessionTokens,
} from "../controllers/authController.js";

// Swagger and stellar for api documentation

const router = express.Router();

router
  .post("/register", validate(newUserZodSchema.strict()), createUser)
  .post(
    "/login",
    validate(newUserZodSchema.pick({ email: true, password: true }).strict()),
    login
  )
  .get("/logout", logout)
  .get("/refresh", refreshSessionTokens);

export default router;
