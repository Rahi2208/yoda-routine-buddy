import { Router } from "express";
import * as reminders from "../controllers/reminders.controller.js";
import { requireAuth } from "../middlewares/requireAuth.js";
import { validate } from "../middlewares/validate.js";
import { idParamSchema } from "../validators/items.validators.js";

const router = Router();

router.use(requireAuth);

router.get("/due", reminders.listDue);
router.patch("/:id/seen", validate(idParamSchema, "params"), reminders.markSeen);

export default router;
