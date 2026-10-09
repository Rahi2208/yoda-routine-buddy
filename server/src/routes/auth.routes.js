import { Router } from "express";
import * as auth from "../controllers/auth.controller.js";
import { authLimiter } from "../middlewares/rateLimit.js";
import { requireAuth } from "../middlewares/requireAuth.js";
import { validate } from "../middlewares/validate.js";
import {
  loginSchema,
  registerSchema,
  resendSchema,
  verifyEmailSchema,
} from "../validators/auth.validators.js";

const router = Router();

router.post("/auth/register", authLimiter, validate(registerSchema), auth.register);
router.post("/auth/verify-email", authLimiter, validate(verifyEmailSchema), auth.verifyEmail);
router.post("/auth/resend-verification", authLimiter, validate(resendSchema), auth.resendVerification);
router.post("/auth/login", authLimiter, validate(loginSchema), auth.login);
router.get("/me", requireAuth, auth.me);

export default router;
