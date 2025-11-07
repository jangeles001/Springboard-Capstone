import { User } from "../models/userModel.js";
import * as userService from "../services/userService.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const createUser = async (req, res) => {
  try {
    const results = await userService.registerNewUser({ ...req.validatedBody });

    // Sets the cookie
    res.cookie("token", token, {
      httpOnly: true, // prevents access via JavaScript
      secure: process.env.NODE_ENV === "production", // only HTTPS in prod
      sameSite: "strict", // CSRF protection
      maxAge: 24 * 60 * 60 * 1000, // 24 hour lifetime
    });

    return res.status(201).json({
      message: "Registration successful!",
      userData: results.newUser,
    });
  } catch (error) {
    if (error.message === "EMAIL_ALREADY_REGISTERED")
      return res.status(409).json({ error: error.message });
    return res
      .status(500)
      .json({ error: "Database error", details: error.message });
  }
};

export async function login(req, res) {
  try {
    const { email, password } = req.validatedBody; // Pulls out email and password from validatedBody

    // Checks if email exists
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    // Verifies password is correct
    const valid = verifyPassword(password, user.passwordHash);
    if (!valid) return res.status(401).json({ error: "Invalid credentials" });

    // Creates JWT payload and token signed with server JWT_SECRET. Tokens will expire after an hour.
    const payload = { sub: user.uuid.toString(), username: username };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });

    return res.json({ message: "Authenticated", token });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ error: "Server error", details: err.message });
  }
}

//TODO: Create token autoRefresh so that user isnt logged out after an hour. Might just redirect to login for simplicity. Refresh Tokens
