import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export default function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization; // Gets authorization header from request

  // Rejects request if no authHeader is present or if the token is not of type Bearer
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing Authorization header" });
  }

  // Extracts token from authHeader and verifies against JWT_SECRET
  const token = authHeader.slice(7);
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload; //
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}
