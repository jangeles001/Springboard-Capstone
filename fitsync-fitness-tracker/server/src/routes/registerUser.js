import express from "express";
import validate from "../validators/userValidator";
import userSchema from "../models/userModel";
import createUser from "../controllers/usersController";

const router = express.Router();

router.post("/register", validate(userSchema), createUser);

export default router;
