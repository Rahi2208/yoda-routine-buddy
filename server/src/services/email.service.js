// Sends emails through SMTP when configured.
// Without SMTP_HOST (local development) the email is printed to the
// console instead, so you can copy the verification code from there.
import nodemailer from "nodemailer";
import { env } from "../config/env.js";

const transporter = env.SMTP_HOST
  ? nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      secure: env.SMTP_SECURE,
      auth: env.SMTP_USER ? { user: env.SMTP_USER, pass: env.SMTP_PASS } : undefined,
    })
  : null;

async function sendEmail({ to, subject, text, html }) {
  if (!transporter) {
    console.log("\n[DEV EMAIL] ---------------------------------");
    console.log(`To: ${to}\nSubject: ${subject}\n\n${text}`);
    console.log("----------------------------------------------\n");
    return;
  }

  await transporter.sendMail({ from: env.MAIL_FROM, to, subject, text, html });
}

export function sendVerificationEmail({ to, name, code }) {
  const text = [
    `Hi ${name},`,
    "",
    `Your YODA verification code is: ${code}`,
    "It expires in 15 minutes.",
    "",
    "If you didn't sign up for YODA, you can ignore this email.",
  ].join("\n");

  const html = `
    <div style="font-family: system-ui, sans-serif; max-width: 420px">
      <p>Hi ${escapeHtml(name)},</p>
      <p>Your YODA verification code is:</p>
      <p style="font-size: 28px; font-weight: 700; letter-spacing: 6px">${code}</p>
      <p>It expires in 15 minutes.</p>
      <p style="color: #777">If you didn't sign up for YODA, you can ignore this email.</p>
    </div>`;

  return sendEmail({ to, subject: "Your YODA verification code", text, html });
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (char) => `&#${char.charCodeAt(0)};`);
}
