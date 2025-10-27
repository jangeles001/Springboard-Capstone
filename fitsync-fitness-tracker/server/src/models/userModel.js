import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

// Mongoose schema definition
const userSchema = new mongoose.Schema(
  {
    uuid: { type: String, default: uuidv4, unique: true, index: true },
    firstName: { type: String, minlength: 1, required: true, trim: true },
    lastName: { type: String, minlength: 1, required: true, trim: true },
    username: { type: String, minlength: 4, required: true, trim: true },
    passwordHash: { type: String, required: true },
    height: { type: String, minlength: 5, required: true, trim: true },
    age: { type: Number, min: 18, required: true },
    weight: { type: Number, min: 70, required: true },
    email: {
      type: String,
      minlength: 7,
      required: true,
      unique: true,
      trim: true,
    },
  },
  { timestamps: true }
);

// Generates Mongoose model
export const User = mongoose.model("User", userSchema);
