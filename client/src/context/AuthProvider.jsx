/**
 * AuthProvider.jsx
 *
 * Wraps the entire app and manages global authentication state.
 *
 * On mount it calls GET /api/auth/me to restore the session from the
 * httpOnly cookie set at login. This is what makes the page stay
 * logged in after a browser refresh.
 *
 * Uses an AbortController so a navigation event while the /me request
 * is still in-flight does not update state on an unmounted component
 * (which would cause a React warning and a potential memory leak).
 *
 * Provides to all children via AuthContext:
 *   user    — authenticated user object ({ id, name, email }), or null
 *   login   — (userData) => void  — call after successful login
 *   logout  — () => void          — call after successful logout
 *   loading — boolean             — true until the /me check completes
 */

import { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import { API_BASE } from "../config/api";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session from httpOnly cookie or stored JWT token on every page load.
  // Also handles the Google OAuth ?token= query param so the callback URL works.
  useEffect(() => {
    const controller = new AbortController();

    // ── Google OAuth callback: pick up token from URL and store it ──────────
    const params = new URLSearchParams(window.location.search);
    const urlToken = params.get("token");
    const authStatus = params.get("auth");
    if (urlToken && authStatus === "success") {
      localStorage.setItem("token", urlToken);
      // Clean the token from the URL without a page reload
      const cleanUrl = window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);
    }

    const restoreSession = async () => {
      try {
        const storedToken = localStorage.getItem("token");
        const headers = storedToken
          ? { Authorization: `Bearer ${storedToken}` }
          : {};

        const res = await fetch(`${API_BASE}/api/auth/me`, {
          credentials: "include",
          headers,
          signal: controller.signal,
        });

        const data = await res.json();

        if (data.success) {
          setUser(data.user);
        } else {
          localStorage.removeItem("token");
        }
      } catch (err) {
        if (err.name === "AbortError") return;
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
    return () => controller.abort();
  }, []);

  const login = (userData, token) => {
    setUser(userData);
    if (token) localStorage.setItem("token", token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, setLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
