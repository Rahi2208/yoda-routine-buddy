// All API routes, mounted under /api in app.js.
import { Router } from "express";
import authRoutes from "./auth.routes.js";
import healthRoutes from "./health.routes.js";
import itemsRoutes from "./items.routes.js";
import remindersRoutes from "./reminders.routes.js";

const router = Router();

router.use("/health", healthRoutes);
router.use("/", authRoutes); // /auth/* and /me
router.use("/items", itemsRoutes);
router.use("/reminders", remindersRoutes);

export default router;
