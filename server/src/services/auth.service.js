// Business logic for accounts: register, verify email, login.
import bcrypt from "bcrypt";
import { prisma } from "../lib/prisma.js";
import { badRequest, conflict, forbidden, tooMany, unauthorized } from "../utils/AppError.js";
import { signToken } from "../utils/jwt.js";
import { publicUser } from "../utils/publicUser.js";
import {
  CODE_TTL_MS,
  MAX_CODE_ATTEMPTS,
  RESEND_COOLDOWN_MS,
  codeMatches,
  generateCode,
  hashCode,
} from "../utils/verificationCode.js";
import { sendVerificationEmail } from "./email.service.js";

const BCRYPT_ROUNDS = 10;

/** Creates a new code (invalidating older ones) and emails it. */
async function issueVerificationCode(user) {
  const code = generateCode();

  await prisma.$transaction([
    prisma.emailVerification.updateMany({
      where: { userId: user.id, usedAt: null },
      data: { usedAt: new Date() },
    }),
    prisma.emailVerification.create({
      data: {
        userId: user.id,
        codeHash: hashCode(code),
        expiresAt: new Date(Date.now() + CODE_TTL_MS),
      },
    }),
  ]);

  await sendVerificationEmail({ to: user.email, name: user.name, code });
}

export async function register({ name, email, password }) {
  const existing = await prisma.user.findUnique({ where: { email } });

  if (existing?.emailVerifiedAt) {
    throw conflict("EMAIL_TAKEN", "An account with this email already exists.");
  }

  const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);

  // An unverified account can be registered again (e.g. after a typo in the
  // name or a forgotten password). It gets the new details and a new code.
  const user = existing
    ? await prisma.user.update({ where: { id: existing.id }, data: { name, passwordHash } })
    : await prisma.user.create({ data: { name, email, passwordHash } });

  await issueVerificationCode(user);
  return { user: publicUser(user) };
}

export async function verifyEmail({ email, code }) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw badRequest("INVALID_CODE", "The code is wrong or has expired.");
  }
  if (user.emailVerifiedAt) {
    return { user: publicUser(user), token: signToken(user.id) };
  }

  const verification = await prisma.emailVerification.findFirst({
    where: { userId: user.id, usedAt: null },
    orderBy: { createdAt: "desc" },
  });

  if (!verification || verification.expiresAt < new Date()) {
    throw badRequest("CODE_EXPIRED", "The code has expired. Request a new one.");
  }
  if (verification.attempts >= MAX_CODE_ATTEMPTS) {
    throw tooMany("TOO_MANY_ATTEMPTS", "Too many wrong codes. Request a new one.");
  }

  if (!codeMatches(code, verification.codeHash)) {
    await prisma.emailVerification.update({
      where: { id: verification.id },
      data: { attempts: { increment: 1 } },
    });
    throw badRequest("INVALID_CODE", "The code is wrong or has expired.");
  }

  const now = new Date();
  const [verifiedUser] = await prisma.$transaction([
    prisma.user.update({ where: { id: user.id }, data: { emailVerifiedAt: now } }),
    prisma.emailVerification.update({ where: { id: verification.id }, data: { usedAt: now } }),
  ]);

  // Log the user in right away, so they don't have to type the password again.
  return { user: publicUser(verifiedUser), token: signToken(verifiedUser.id) };
}

export async function resendVerification({ email }) {
  const user = await prisma.user.findUnique({ where: { email } });

  // Same answer whether or not the email exists, so this endpoint
  // can't be used to find out who has an account.
  if (!user || user.emailVerifiedAt) return;

  const latest = await prisma.emailVerification.findFirst({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });
  if (latest && Date.now() - latest.createdAt.getTime() < RESEND_COOLDOWN_MS) {
    throw tooMany("RESEND_TOO_SOON", "Please wait a minute before requesting another code.");
  }

  await issueVerificationCode(user);
}

export async function login({ email, password }) {
  const user = await prisma.user.findUnique({ where: { email } });
  const passwordOk = user ? await bcrypt.compare(password, user.passwordHash) : false;

  if (!user || !passwordOk) {
    throw unauthorized("INVALID_CREDENTIALS", "Email or password is incorrect.");
  }
  if (!user.emailVerifiedAt) {
    throw forbidden("EMAIL_NOT_VERIFIED", "Please verify your email first.");
  }

  return { user: publicUser(user), token: signToken(user.id) };
}
