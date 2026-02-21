import "./utils/responseEnhancer.js";
import express from "express";
import cors from "cors";
import session from "express-session";
import cookieParser from "cookie-parser";
import workoutsRouter from "./routes/workouts.js";
import authRouter from "./routes/auth.js";
import usersRouter from "./routes/users.js";
import mealsRouter from "./routes/meals.js";
import connectDB from "./config/connect.js";
import { getEnv } from "./config/envConfig.js";

// Setup
const app = express();
const configPort = getEnv("PORT") || 5000;

// Middleware
app.use(
  cors({
    origin: getEnv("CLIENT_ORIGIN"),
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(express.json());
app.use(
  session({
    secret: getEnv("JWT_SECRET"),
    resave: false,
    saveUninitialized: false,
  }),
);
app.use(cookieParser());

// Health check
app.get("/health", (req, res) => {
  res.status(200).send("API is running");
});

// Routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", usersRouter);
app.use("/api/v1/workouts", workoutsRouter);
app.use("/api/v1/meals", mealsRouter);

async function startServer() {
  try {
    await connectDB().catch((err) => console.log(err.message));
    app.listen(configPort, () =>
      console.log(`Server running on port ${configPort}`),
    );
  } catch (err) {
    console.error("Database connection failed:", err);
    process.exit(1);
  }
}
// Graceful exiting
startServer(); // Connects to database and begins listening
