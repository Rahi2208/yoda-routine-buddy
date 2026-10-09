// Small fetch wrapper used by every API call.
// - Adds the JSON headers and the login token
// - Turns error responses into an ApiError with the server's code/message
export const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:3000").replace(/\/$/, "");

let authToken = null;
let onUnauthorized = () => {};

export function setAuthToken(token) {
  authToken = token;
}

/** Called when the server says the session is no longer valid. */
export function setUnauthorizedHandler(handler) {
  onUnauthorized = handler;
}

export class ApiError extends Error {
  constructor(status, code, message, details = []) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details;
  }

  /** Field errors as { fieldName: "message" }, handy for forms. */
  get fieldErrors() {
    return Object.fromEntries(this.details.map((detail) => [detail.field, detail.message]));
  }
}

export async function request(method, path, body) {
  const options = {
    method,
    headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
  };
  if (body) {
    options.headers["Content-Type"] = "application/json";
    options.body = JSON.stringify(body);
  }

  let response;
  try {
    response = await fetch(`${API_URL}${path}`, options);
  } catch {
    throw new ApiError(0, "NETWORK_ERROR", "Can't reach the YODA server. Check that it is running.");
  }

  if (response.status === 204) return null;

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const error = data?.error ?? {};
    if (response.status === 401 && authToken) onUnauthorized();
    throw new ApiError(
      response.status,
      error.code ?? "UNKNOWN_ERROR",
      error.message ?? "Something went wrong.",
      error.details ?? [],
    );
  }

  return data;
}
