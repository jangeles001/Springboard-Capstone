import { AppError } from "../errors/AppError.js";

export function errorHandler(err, req, res, next) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json(err.toJSON());
  }

  console.error(err);
  return res.status(500).json({
    status: 500,
    message: "INTERNAL_SERVER_ERROR",
  });
}