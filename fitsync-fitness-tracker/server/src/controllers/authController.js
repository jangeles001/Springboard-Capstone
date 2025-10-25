import { User } from "../models/userModel.js";
import { generateSalt, hashPassword, verifyPassword } from "../utils/hash.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const createUser = async (req, res) => {
  try {
    // Desructures request formData to pull out password for encryption
    const {
      firstName,
      lastName,
      username,
      password,
      height,
      age,
      weight,
      email,
    } = req.validatedbody;

    // Checks if email exists
    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ error: "Email already in use" });

    // Password Encryption
    const salt = generateSalt();
    const passwordHash = hashPassword(password, salt);

    // Creates newUser object with passwordHash and salt
    const newUser = new User({
      firstName,
      lastName,
      username,
      passwordHash,
      salt,
      height,
      age,
      weight,
      email,
    });

    await newUser.save(); // Saves to db

    return res.status(201).json({
      message: "User created successfully!",
      newUser,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Database error", details: err.message });
  }
};

export async function login(req, res) {
  try {
    const { email, password } = req.validatedBody; // Pulls out email and password from validatedBody

    // Checks if email exists
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    // Verifies password is correct
    const valid = verifyPassword(password, user.passwordHash, user.salt);
    if (!valid) return res.status(401).json({ error: "Invalid credentials" });

    // Creates JWT payload and token signed with server JWT_SECRET. Tokens will expire after an hour.
    const payload = { sub: user._id.toString(), email: user.email };
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
