import express from "express";
import validate from "../validators/authValidators.js";
import { newUserZodSchema } from "../schemas/newUserZodSchema.js";
import { createUser, login } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", validate(newUserZodSchema), createUser);
router.post(
  "/login",
  validate(newUserZodSchema.pick({ email: true, password: true })),
  login
);

export default router;
