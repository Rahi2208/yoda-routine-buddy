// Runs when no route matched the request.
import { notFound as notFoundError } from "../utils/AppError.js";

export function notFound(req) {
  throw notFoundError("ROUTE_NOT_FOUND", `No route for ${req.method} ${req.originalUrl}`);
}
