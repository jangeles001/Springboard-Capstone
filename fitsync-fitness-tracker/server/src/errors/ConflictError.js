export class ConflictError extends AppError {
  constructor(dataField, options = {}) {
    super(`${dataField}_ALREADY_REGISTERED`, 401, {
      type: "CONFLICT",
    });
  }
}
