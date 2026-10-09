// An error we throw on purpose, with an HTTP status and a stable code
// the client can check (e.g. "EMAIL_NOT_VERIFIED").
// Any other error is treated as an unexpected 500 by the error handler.
export class AppError extends Error {
  constructor(status, code, message, details) {
    super(message);
    this.name = "AppError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export const badRequest = (code, message, details) => new AppError(400, code, message, details);
export const unauthorized = (code, message) => new AppError(401, code, message);
export const forbidden = (code, message) => new AppError(403, code, message);
export const notFound = (code, message) => new AppError(404, code, message);
export const conflict = (code, message) => new AppError(409, code, message);
export const tooMany = (code, message) => new AppError(429, code, message);
