import { AppError } from "./AppError.js";

export class ConflictError extends AppError {
  constructor(dataField, options = {}) {
    super(`${dataField}_ALREADY_REGISTERED`, 409, {
      type: "CONFLICT",
    });
  }
}
