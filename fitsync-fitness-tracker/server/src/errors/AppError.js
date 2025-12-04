export class AppError extends Error {
  constructor(message, statusCode = 500, options = {}) {
    super(message);
    this.statusCode = statusCode;

    // Optional metadata
    this.type = options.type || "APP_ERROR";
    this.details = options.details || null;

    // Request info if passed in manually
    this.requestId = options.requestId || null;
    this.user = options.user || null;

    Error.captureStackTrace(this, this.constructor);
  }

  toJSON() {
    return {
      status: this.statusCode,
      message: this.message,
      type: this.type,
      details: this.details,
    };
  }
}