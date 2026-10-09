import { Router } from "express";

const router = Router();

// GET /api/health -> used by hosting platforms to check the server is alive
router.get("/", (_req, res) => {
  res.json({ status: "ok" });
});

export default router;
