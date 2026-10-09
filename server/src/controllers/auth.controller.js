// Controllers only translate HTTP <-> service calls. No business logic here.
import * as authService from "../services/auth.service.js";
import { publicUser } from "../utils/publicUser.js";

export async function register(req, res) {
  const result = await authService.register(req.validated.body);
  res.status(201).json({
    ...result,
    message: "Account created. Check your email for the verification code.",
  });
}

export async function verifyEmail(req, res) {
  res.json(await authService.verifyEmail(req.validated.body));
}

export async function resendVerification(req, res) {
  await authService.resendVerification(req.validated.body);
  res.json({ message: "If the account exists and is not verified yet, a new code was sent." });
}

export async function login(req, res) {
  res.json(await authService.login(req.validated.body));
}

export function me(req, res) {
  res.json({ user: publicUser(req.user) });
}
