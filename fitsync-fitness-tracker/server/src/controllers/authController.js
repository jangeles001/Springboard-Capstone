import { User } from "../models/userModel.js";
import * as userService from "../services/userService.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const createUser = async (req, res) => {
  try {
    const results = await userService.registerNewUser({ ...req.validatedBody });

    // Sets the cookie
    res.cookie("token", results.token, {
      httpOnly: true, // prevents access via JavaScript
      secure: process.env.NODE_ENV === "production", // only HTTPS in prod
      sameSite: "strict", // CSRF protection
      maxAge: 24 * 60 * 60 * 1000, // 24 hour lifetime  <-- change to match 1hr validity window
    });

    return res.status(201).json({
      message: "Registration successful!",
      newUserInfo: `Username: ${results.username} (UUID: ${results.uuid})`
    });
  } catch (error) {
    if (error.message === "EMAIL_ALREADY_REGISTERED")
      return res.status(409).json({ error: error.message });
    return res
      .status(500)
      .json({ error: "Database error", error: error.message });
  }
};

export async function login(req, res) {
  try {
    const { email, password } = req.validatedBody; // Pulls out email and password from validatedBody

    const validatedUser = await userService.validateCredentials(email, password);

    res.cookie("token", validatedUser.token, {
      httpOnly: true, // prevents access via JavaScript
      secure: process.env.NODE_ENV === "production", // only HTTPS in prod
      sameSite: "strict", // CSRF protection
      maxAge: 24 * 60 * 60 * 1000, // 24 hour lifetime
    });

    return res.status(200).json({ 
      message: `${validatedUser.username} (UUID: ${validatedUser.uuid}) logged in!` });
  } catch (error) {
    if (error.message === "INVALID_CREDENTIALS") return res.status(401).json({ error: error.message });
    return res
      .status(500)
      .json({ error: "Server error", error: error.message });
  }
}

//TODO: Create token autoRefresh so that user isnt logged out after an hour. Might just redirect to login for simplicity. Refresh Tokens
