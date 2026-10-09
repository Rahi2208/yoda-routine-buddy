// HashRouter (URLs like /#/login) works both on any static web host and
// when Electron loads the built app from a file, with no server config.
import { HashRouter, Navigate, Route, Routes } from "react-router";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import MainPage from "./pages/MainPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import VerifyEmailPage from "./pages/VerifyEmailPage.jsx";
import PetPage from "./pet/PetPage.jsx";

export default function App() {
  return (
    <HashRouter>
      <Routes>
        {/* The desktop pet window. It needs no login: reminders reach it from Electron. */}
        <Route path="/pet" element={<PetPage />} />

        <Route
          path="/*"
          element={
            <AuthProvider>
              <Routes>
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/verify" element={<VerifyEmailPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <MainPage />
                    </ProtectedRoute>
                  }
                />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </AuthProvider>
          }
        />
      </Routes>
    </HashRouter>
  );
}
