import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { getEnv } from "../config/envConfig.js";
dotenv.config();

export default function requireAuth(req, res, next) {
  let token = null;

  // Checks if cookie exists and if a token is present
  if (req.cookies?.accessToken) {
    token = req.cookies.accessToken;
  }
  // Checks if authorization header with bearer token is present
  else if (req.headers.authorization?.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1]; // Retrieves token from request header
  }

  // Rejects request if no authorization token is present
  if (!token) {
    return res.status(401).json({ message: "MISSING_AUTHORIZATION_TOKEN" });
  }

  // Verifies token against JWT_SECRET
  jwt.verify(token, getEnv("JWT_SECRET"), (error, decoded) => {
    if (error) return res.status(401).json({ message: "ACCESS_TOKEN_EXPIRED" });
    req.user = decoded; // Sets req.user to the decoded token information
    next();
  });
}
