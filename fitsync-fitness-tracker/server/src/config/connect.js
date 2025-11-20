import mongoose from "mongoose";
import { getEnv } from "./envConfig.js";

async function connectDB() {
  if (getEnv("NODE_ENV") === "test") {
    await mongoose.connect(getEnv("MONGO_TEST_URI"));
  } else {
    await mongoose.connect(getEnv("MONGO_URI"));
  }
  console.log("MongoDB connection established");
  console.log("Connected to DB:", mongoose.connection.db.databaseName);
}

export default connectDB;
