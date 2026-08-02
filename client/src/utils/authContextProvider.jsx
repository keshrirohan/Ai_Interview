import { useEffect, useState } from "react";
import { AuthContext } from "./useContext";

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  // ─── Restore session on mount ──────────────────────────────────────────────
  useEffect(() => {
    // AbortController prevents a state update on an unmounted component
    // when the user navigates away before the /me request resolves.
    const controller = new AbortController();

    const checkAuth = async () => {
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
        if (err.name === "AbortError") return; // unmounted — ignore
        // Any other error means unauthenticated; user stays null
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    return () => controller.abort();
  }, []);

  // ─── Auth actions ──────────────────────────────────────────────────────────
  const login  = (userData) => setUser(userData);
  const logout = ()         => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
