import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router";
import { register } from "../api/auth.js";
import AuthLayout from "../components/AuthLayout.jsx";
import Field from "../components/Field.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function RegisterPage() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (token) return <Navigate to="/" replace />;

  const update = (field) => (event) => setForm({ ...form, [field]: event.target.value });

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setErrors({});
    setFormError("");

    try {
      const { user } = await register(form);
      navigate(`/verify?email=${encodeURIComponent(user.email)}`);
    } catch (error) {
      setErrors(error.fieldErrors ?? {});
      if (!error.details?.length) setFormError(error.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthLayout
      title="Make a buddy"
      subtitle="YODA keeps an eye on your deadlines so you don't have to."
      footer={
        <>
          Already have an account? <Link to="/login">Log in</Link>
        </>
      }
    >
      <form className="form" onSubmit={handleSubmit} noValidate>
        <Field
          label="Name"
          value={form.name}
          onChange={update("name")}
          error={errors.name}
          autoComplete="name"
        />
        <Field
          label="Email"
          type="email"
          value={form.email}
          onChange={update("email")}
          error={errors.email}
          autoComplete="email"
        />
        <Field
          label="Password"
          type="password"
          value={form.password}
          onChange={update("password")}
          error={errors.password}
          hint="At least 8 characters."
          autoComplete="new-password"
        />
        {formError && (
          <p className="form__error" role="alert">
            {formError}
          </p>
        )}
        <button className="button button--primary" disabled={submitting}>
          {submitting ? "Creating account…" : "Create account"}
        </button>
      </form>
    </AuthLayout>
  );
}
