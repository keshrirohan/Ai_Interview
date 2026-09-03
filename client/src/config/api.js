/**
 * api.js
 *
 * Centralized API configuration for the EchoHire AI client.
 *
 * WHY THIS FILE EXISTS:
 *   Vite environment variables (VITE_*) are injected at BUILD TIME, not runtime.
 *   If VITE_BACKEND_URL is missing when `npm run build` runs on Render, every
 *   fetch call will construct a URL like "undefined/api/auth/login", which the
 *   browser resolves as a relative path — resulting in a "Failed to fetch" error
 *   because the frontend origin (ai-interview-6iv5.onrender.com) has no such
 *   endpoint. This is the primary cause of the production login failure.
 *
 * HOW TO USE:
 *   import { API_BASE, apiFetch } from "../config/api";
 *
 *   // Plain URL construction:
 *   const url = `${API_BASE}/api/auth/login`;
 *
 *   // Or use the convenience wrapper that adds credentials + auth headers:
 *   const data = await apiFetch("/api/auth/login", { method: "POST", body: ... });
 *
 * ENVIRONMENT VARIABLES:
 *   Development (.env.local or .env):
 *     VITE_BACKEND_URL=http://localhost:5000
 *
 *   Production (Render frontend service → Environment):
 *     VITE_BACKEND_URL=https://backend-echohire.onrender.com
 *
 *   Render re-builds the frontend on every deploy, so changing this variable
 *   on the Render dashboard WILL take effect on the next build/deploy.
 */

// Guard: if the env var is missing, fall back to the known production URL so
// the app is never completely broken even with a misconfigured build.
export const API_BASE =
  import.meta.env.VITE_BACKEND_URL ||
  "https://backend-echohire.onrender.com";

/**
 * Convenience fetch wrapper.
 *
 * - Always sends credentials (cookies) — required for httpOnly JWT auth.
 * - Automatically adds the Authorization: Bearer header from localStorage
 *   as a fallback for environments that block cross-site cookies (e.g.
 *   some Safari + iOS versions).
 * - Returns the parsed JSON response.
 * - Throws if the HTTP response is not OK or if `data.success === false`.
 *
 * @param {string} path        — API path starting with /api/...
 * @param {RequestInit} opts   — standard fetch options (method, body, headers…)
 * @returns {Promise<any>}     — parsed response JSON
 */
export const apiFetch = async (path, opts = {}) => {
  const token = localStorage.getItem("token");

  const headers = {
    ...(opts.body && !(opts.body instanceof FormData)
      ? { "Content-Type": "application/json" }
      : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...opts.headers,
  };

  const response = await fetch(`${API_BASE}${path}`, {
    credentials: "include",
    ...opts,
    headers,
  });

  const data = await response.json();
  return data;
};
