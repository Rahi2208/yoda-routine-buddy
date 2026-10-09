import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router";
import { login, resendVerification } from "../api/auth.js";
import AuthLayout from "../components/AuthLayout.jsx";
import Field from "../components/Field.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function LoginPage() {
  const { token, saveSession } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (token) return <Navigate to="/" replace />;

  const update = (field) => (event) => setForm({ ...form, [field]: event.target.value });

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      saveSession(await login(form));
      navigate("/", { replace: true });
    } catch (err) {
      if (err.code === "EMAIL_NOT_VERIFIED") {
        // The first code may have expired: send a fresh one (ignored if sent too recently).
        await resendVerification(form.email).catch(() => {});
        navigate(`/verify?email=${encodeURIComponent(form.email.trim().toLowerCase())}`);
        return;
      }
      setError(err.details?.[0]?.message ?? err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Your buddy missed you."
      footer={
        <>
          New here? <Link to="/register">Create an account</Link>
        </>
      }
    >
      <form className="form" onSubmit={handleSubmit} noValidate>
        <Field
          label="Email"
          type="email"
          value={form.email}
          onChange={update("email")}
          autoComplete="email"
        />
        <Field
          label="Password"
          type="password"
          value={form.password}
          onChange={update("password")}
          autoComplete="current-password"
        />
        {error && (
          <p className="form__error" role="alert">
            {error}
          </p>
        )}
        <button className="button button--primary" disabled={submitting}>
          {submitting ? "Logging in…" : "Log in"}
        </button>
      </form>
    </AuthLayout>
  );
}
