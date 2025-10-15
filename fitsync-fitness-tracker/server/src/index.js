import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import workoutsRouter from "./routes/workouts.js";
// Setup
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: process.env.CLIENT_ORIGIN }));
app.use(express.json());

// Routes
app.use("/api/workouts", workoutsRouter);

// Resolve __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (process.env.NODE_ENV === "production") {
  // Serve the built frontend (client/dist)
  const clientPath = path.join(__dirname, "../client/dist");
  app.use(express.static(clientPath));

  // Catch-all: send index.html for any unknown route
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(clientPath, ""));
  });
}

app.listen(PORT, () => console.log(`Server is running on ${PORT}`));
