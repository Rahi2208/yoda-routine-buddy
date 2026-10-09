import { Router } from "express";
import * as items from "../controllers/items.controller.js";
import { requireAuth } from "../middlewares/requireAuth.js";
import { validate } from "../middlewares/validate.js";
import { createItemSchema, idParamSchema, updateItemSchema } from "../validators/items.validators.js";

const router = Router();

router.use(requireAuth); // every /items route needs a logged-in user

router.get("/", items.list);
router.post("/", validate(createItemSchema), items.create);
router.patch("/:id", validate(idParamSchema, "params"), validate(updateItemSchema), items.update);
router.delete("/:id", validate(idParamSchema, "params"), items.remove);

export default router;
