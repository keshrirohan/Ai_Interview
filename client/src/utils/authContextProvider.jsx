import { useEffect, useState } from "react";
import { AuthContext } from "./useContext";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/auth/me`,
          {
            credentials: "include",
          },
        );

        const data = await res.json();
        console.log("AuthProvider checkAuth response:", data);
        if (data.success) {
          setUser(data.user);
        }
      } catch (error) {
        console.log(error);
      }
    };

    checkAuth();
  }, []);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
