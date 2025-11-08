import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export default function requireAuth(req, res, next) {
  let token = null;

  // Checks if cookie exists and if a token is present
  if(req.cookies?.token){ 
    token = req.cookies.token;
  }
  // Checks if authorization header with bearer token is present
  else if(req.headers.authorization?.startsWith("Bearer ")){
    token = req.headers.authorization.split(" ")[1]; // Retrieves token from request header
  }

  // Rejects request if no authHeader is present or if the token is not of type Bearer
  if (!token) {
    return res.status(401).json({ error: "Missing Authorization Token" });
  }

  // Verifies token against JWT_SECRET
  jwt.verify(token, getEnv("JWT_SECRET"), (err, decoded) => {
    if (err) return res.status(403).json({ error: "Invalid or expired token" });
    req.user = decoded;
    next();
  });
}
