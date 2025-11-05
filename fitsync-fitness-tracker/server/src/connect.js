import mongoose from "mongoose";
import { getEnv } from "./validators/validateConfig.js";

async function connectDB() {
  await mongoose.connect(getEnv(MONGO_URI));
  console.log("MongoDB connection established");
}

export default connectDB;
