import { request } from "./client.js";

export const register = (data) => request("POST", "/api/auth/register", data);
export const verifyEmail = (data) => request("POST", "/api/auth/verify-email", data);
export const resendVerification = (email) => request("POST", "/api/auth/resend-verification", { email });
export const login = (data) => request("POST", "/api/auth/login", data);
export const getMe = () => request("GET", "/api/me");
