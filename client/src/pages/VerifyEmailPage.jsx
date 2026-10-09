import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate, useSearchParams } from "react-router";
import { resendVerification, verifyEmail } from "../api/auth.js";
import AuthLayout from "../components/AuthLayout.jsx";
import Field from "../components/Field.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const RESEND_WAIT_SECONDS = 60;

export default function VerifyEmailPage() {
  const { token, saveSession } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [email, setEmail] = useState(params.get("email") ?? "");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [resendIn, setResendIn] = useState(RESEND_WAIT_SECONDS);

  // Countdown before "Send a new code" is allowed again.
  useEffect(() => {
    if (resendIn <= 0) return undefined;
    const timer = setTimeout(() => setResendIn(resendIn - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendIn]);

  if (token) return <Navigate to="/" replace />;

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const session = await verifyEmail({ email, code });
      saveSession(session);
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.details?.[0]?.message ?? err.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleResend() {
    setError("");
    setNotice("");
    try {
      await resendVerification(email);
      setNotice("A new code is on its way.");
      setResendIn(RESEND_WAIT_SECONDS);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <AuthLayout
      title="Check your email"
      subtitle={
        email
          ? `We sent a 6-digit code to ${email}.`
          : "Enter the email you signed up with and its 6-digit code."
      }
      footer={<Link to="/login">Back to log in</Link>}
    >
      <form className="form" onSubmit={handleSubmit} noValidate>
        {!params.get("email") && (
          <Field
            label="Email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
          />
        )}
        <Field
          label="Verification code"
          className="code-input"
          value={code}
          onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))}
          inputMode="numeric"
          autoComplete="one-time-code"
          placeholder="000000"
          autoFocus
        />
        {error && (
          <p className="form__error" role="alert">
            {error}
          </p>
        )}
        {notice && (
          <p className="form__notice" role="status">
            {notice}
          </p>
        )}
        <button className="button button--primary" disabled={submitting || code.length !== 6}>
          {submitting ? "Checking…" : "Verify email"}
        </button>
        <button
          type="button"
          className="button button--quiet"
          onClick={handleResend}
          disabled={resendIn > 0 || !email}
        >
          {resendIn > 0 ? `Send a new code in ${resendIn}s` : "Send a new code"}
        </button>
      </form>
    </AuthLayout>
  );
}
