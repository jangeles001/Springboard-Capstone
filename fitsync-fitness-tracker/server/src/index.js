import "./utils/responseEnhancer.js";
import express from "express";
import cors from "cors";
import path from "path";
import session from "express-session";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";
import workoutsRouter from "./routes/workouts.js";
import authRouter from "./routes/auth.js";
import usersRouter from "./routes/users.js";
import mealsRouter from "./routes/meals.js";
import exercisesRouter from "./routes/exercises.js";
// import postsRouter from "./routes/post.js"
import connectDB from "./config/connect.js";
import { getEnv } from "./config/envConfig.js";
// import { errorHandler } from "./middleware/errorHandler.js";

// Setup
const app = express();
const configPort = getEnv("PORT") || 5000;

// Middleware
app.use(cors({ 
  origin: getEnv("CLIENT_ORIGIN"), 
  credentials: true, 
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express.json());
app.use(
  session({
    secret: getEnv("JWT_SECRET"),
    resave: false,
    saveUninitialized: false,
  })
);
app.use(cookieParser());
// TODO: File uploads. Look into Morgan

// Routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", usersRouter);
app.use("/api/v1/exercises", exercisesRouter);
app.use("/api/v1/workouts", workoutsRouter);
app.use("/api/v1/meals", mealsRouter);
// app.use("/api/v1/posts", postsRouter);

// Resolve __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (getEnv("NODE_ENV") === "production") {
  // Serves the built frontend (client/dist)
  const clientPath = path.join(__dirname, "../client/dist");
  app.use(express.static(clientPath));

  // Catch-all: sends index.html for any unknown route
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(clientPath, "index.html")); // TODO: Connect vite frontend with server response?
  });
}

// Catches all errors the application throws
// app.use(errorHandler);

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
