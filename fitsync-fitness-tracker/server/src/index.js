import express from "express";
import cors from "cors";
import path from "path";
import session from "express-session";
import { fileURLToPath } from "url";
import workoutsRouter from "./routes/workouts.js";
import authRouter from "./routes/auth.js";
import connectDB from "./connect.js";
import { getEnv } from "./validators/validateConfig.js";

// Setup
const app = express();
const configPort = getEnv("PORT") || 5000;

// Middleware
app.use(cors({ origin: getEnv("CLIENT_ORIGIN") }));
app.use(express.json());
app.use(
  session({
    secret: getEnv("JWT_SECRET"),
    resave: false,
    saveUninitialized: false,
  })
);
// TODO: File uploads. Look into Morgan

// Routes
app.use("/api/workouts", workoutsRouter);
app.use("/auth", authRouter);

// Resolve __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (getEnv("NODE_ENV") === "production") {
  // Serves the built frontend (client/dist)
  const clientPath = path.join(__dirname, "../client/dist");
  app.use(express.static(clientPath));

  // Catch-all: sends index.html for any unknown route
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(clientPath, "")); // TODO: Connect vite frontend with server response?
  });
}

async function startServer() {
  try {
    await connectDB().catch((err) => console.log(err.message));
    app.listen(configPort, () =>
      console.log(`Server running on port ${configPort}`)
    );
  } catch (err) {
    console.error("Database connection failed:", err);
    process.exit(1);
  }
}
// Graceful exiting
startServer(); // Connects to database and begins listening
