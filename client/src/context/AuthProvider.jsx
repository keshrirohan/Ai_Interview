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

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session from the httpOnly cookie on every page load
  useEffect(() => {
    const controller = new AbortController();

    const restoreSession = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/auth/me`,
          { credentials: "include", signal: controller.signal },
        );

        const data = await res.json();

        if (data.success) {
          setUser(data.user);
        }
      } catch (err) {
        // AbortError means the component unmounted — safe to ignore
        if (err.name === "AbortError") return;
        // Any other error means unauthenticated — user stays null
      } finally {
        setLoading(false);
      }
    };

    restoreSession();

    return () => controller.abort();
  }, []);

  const login = (userData) => setUser(userData);
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, setLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
