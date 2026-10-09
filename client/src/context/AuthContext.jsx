// Keeps the logged-in user and token for the whole app.
// The session is saved in localStorage so a refresh keeps you logged in,
// and is shared with the Electron app so the pet can fetch reminders.
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { getMe } from "../api/auth.js";
import { API_URL, setAuthToken, setUnauthorizedHandler } from "../api/client.js";
import { desktop } from "../desktop/bridge.js";

const STORAGE_KEY = "yoda.session";
const AuthContext = createContext(null);

function readStoredSession() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY));
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => {
    const stored = readStoredSession();
    if (stored?.token) setAuthToken(stored.token);
    return stored;
  });
  const [checking, setChecking] = useState(Boolean(session?.token));

  const saveSession = useCallback(({ token, user }) => {
    const next = { token, user };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setAuthToken(token);
    desktop.setSession({ token, apiUrl: API_URL });
    setSession(next);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setAuthToken(null);
    desktop.clearSession();
    setSession(null);
  }, []);

  // Log out automatically when the server rejects our token.
  useEffect(() => setUnauthorizedHandler(logout), [logout]);

  // On startup, confirm the stored token is still valid.
  useEffect(() => {
    const stored = readStoredSession();
    if (!stored?.token) return;

    getMe()
      .then(({ user }) => saveSession({ token: stored.token, user }))
      .catch((error) => {
        // Keep the session when offline; drop it when the token is rejected.
        if (error.status === 401) logout();
        else desktop.setSession({ token: stored.token, apiUrl: API_URL });
      })
      .finally(() => setChecking(false));
  }, [saveSession, logout]);

  const value = useMemo(
    () => ({ user: session?.user ?? null, token: session?.token ?? null, checking, saveSession, logout }),
    [session, checking, saveSession, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside <AuthProvider>");
  return context;
}
