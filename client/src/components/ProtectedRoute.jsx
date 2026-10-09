// Sends visitors who are not logged in to the login page.
import { Navigate } from "react-router";
import { useAuth } from "../context/AuthContext.jsx";

export default function ProtectedRoute({ children }) {
  const { token, checking } = useAuth();

  if (checking) return <p className="page-status">Loading…</p>;
  if (!token) return <Navigate to="/login" replace />;
  return children;
}
