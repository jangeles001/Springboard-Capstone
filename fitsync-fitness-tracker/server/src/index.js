import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import workoutsRouter from "./routes/workouts.js";
import authRouter from "./routes/auth.js"
import connectDB from "./connect.js";

// Setup
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: process.env.CLIENT_ORIGIN }));
app.use(express.json());

// Routes
app.use("/api/workouts", workoutsRouter);
app.use("/auth", authRouter);

// Resolve __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (process.env.NODE_ENV === "production") {
  // Serve the built frontend (client/dist)
  const clientPath = path.join(__dirname, "../client/dist");
  app.use(express.static(clientPath));

  // Catch-all: send index.html for any unknown route
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(clientPath, "")); // TODO: Connect vite frontend with server resposne?
  });
}

async function startServer() {
  try {
    await connectDB().catch((err) => console.log(err.message));
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error("Database connection failed:", err);
    process.exit(1);
  }
}

startServer(); //connect to database and begin listening
