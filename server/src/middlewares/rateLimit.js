// Slows down brute-force attempts on login, register and code verification.
import { rateLimit } from "express-rate-limit";

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  handler: (_req, res) => {
    res.status(429).json({
      error: { code: "TOO_MANY_REQUESTS", message: "Too many attempts. Try again in a few minutes." },
    });
  },
});
