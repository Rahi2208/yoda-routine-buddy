// 6-digit email verification codes.
// The code is stored as a SHA-256 hash, so a leaked database does not
// reveal valid codes. (bcrypt is unnecessary here: codes live 15 minutes
// and attempts are limited.)
import crypto from "node:crypto";

export const CODE_TTL_MS = 15 * 60 * 1000;
export const MAX_CODE_ATTEMPTS = 5;
export const RESEND_COOLDOWN_MS = 60 * 1000;

export function generateCode() {
  return crypto.randomInt(0, 1_000_000).toString().padStart(6, "0");
}

export function hashCode(code) {
  return crypto.createHash("sha256").update(code).digest("hex");
}

/** Compares two hashes in constant time to avoid timing attacks. */
export function codeMatches(code, storedHash) {
  const a = Buffer.from(hashCode(code), "hex");
  const b = Buffer.from(storedHash, "hex");
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}
