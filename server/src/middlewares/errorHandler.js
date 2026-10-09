// Last stop for every error. Always answers with the same JSON shape:
//   { "error": { "code": "SOME_CODE", "message": "Human readable", "details": [...] } }
// Express 5 forwards errors thrown in async handlers here automatically.
import { AppError } from "../utils/AppError.js";

// eslint-disable-next-line no-unused-vars -- Express needs 4 arguments to treat this as an error handler
export function errorHandler(err, _req, res, _next) {
  if (err instanceof AppError) {
    return res.status(err.status).json({
      error: { code: err.code, message: err.message, details: err.details },
    });
  }

  // Malformed JSON body sent by the client
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({
      error: { code: "INVALID_JSON", message: "Request body is not valid JSON." },
    });
  }

  console.error(err);
  return res.status(500).json({
    error: { code: "INTERNAL_ERROR", message: "Something went wrong on our side." },
  });
}
