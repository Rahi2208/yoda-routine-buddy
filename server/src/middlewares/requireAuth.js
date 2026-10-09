// Protects a route: requires "Authorization: Bearer <token>".
// On success, the logged-in user is available as req.user.
import { prisma } from "../lib/prisma.js";
import { unauthorized } from "../utils/AppError.js";
import { verifyToken } from "../utils/jwt.js";

export async function requireAuth(req, _res, next) {
  const header = req.get("authorization") ?? "";
  const [scheme, token] = header.split(" ");

  if (scheme !== "Bearer" || !token) {
    throw unauthorized("AUTH_REQUIRED", "Please log in first.");
  }

  const userId = verifyToken(token);
  if (!userId) {
    throw unauthorized("INVALID_TOKEN", "Your session has expired. Please log in again.");
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw unauthorized("INVALID_TOKEN", "Your session has expired. Please log in again.");
  }

  req.user = user;
  next();
}
