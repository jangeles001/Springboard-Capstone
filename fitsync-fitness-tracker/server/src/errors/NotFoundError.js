export class NotFoundError extends AppError {
  constructor(resourceName, options = {}) {
    super(`${resourceName}_NOT_FOUND`, 404, {
      type: "NOT_FOUND",
    });
  }
}
