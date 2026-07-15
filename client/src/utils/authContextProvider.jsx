import { useState } from "react";
import { AuthContext } from "./useContext";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(true);

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
// Custom hook to use the AuthContext
