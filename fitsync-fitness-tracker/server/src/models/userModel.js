import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  username: { type: String, required: true, trim: true },
  password: { type: String, required: true, trim: true },
  height: { type: string, required: true, trim: true },
  age: { type: Number, min: 18, required: true },
  weight: { type: Number, min: 70, required: true },
  email: { type: String, required: true, trim: true },
});

export default mongoose.model("user", userSchema);
