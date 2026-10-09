import { z } from "zod";

const email = z.string().trim().toLowerCase().pipe(z.email("Enter a valid email address."));

export const registerSchema = z.object({
  name: z.string().trim().min(1, "Name is required.").max(80, "Name is too long."),
  email,
  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .max(72, "Password must be at most 72 characters."), // bcrypt only uses the first 72 bytes
});

export const verifyEmailSchema = z.object({
  email,
  code: z
    .string()
    .trim()
    .regex(/^\d{6}$/, "The code has 6 digits."),
});

export const resendSchema = z.object({ email });

export const loginSchema = z.object({
  email,
  password: z.string().min(1, "Password is required."),
});
