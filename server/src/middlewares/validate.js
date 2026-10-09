// Validates req.body (or req.params / req.query) against a zod schema.
// The parsed, cleaned value replaces the original, so controllers
// can trust its shape.
import { badRequest } from "../utils/AppError.js";

export function validate(schema, source = "body") {
  return (req, _res, next) => {
    const result = schema.safeParse(req[source] ?? {});

    if (!result.success) {
      const details = result.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      }));
      throw badRequest("VALIDATION_ERROR", "Some fields are invalid.", details);
    }

    // req.query is a read-only getter in Express 5, so store parsed values separately.
    req.validated = { ...req.validated, [source]: result.data };
    next();
  };
}
