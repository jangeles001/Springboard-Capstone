import { AppError } from "./AppError.js";

export class AccessTokenExpired extends AppError {
  constructor(options = {}) {
    super(`Access_TOKEN_EXPIRED`, 401, {
      type: "ACCESS_DENIED",
    });
  }
}
