import { createContext, useContext } from "react";

export const AuthContext = createContext();

export const useAuth = () => {
  // Get the context value and context carry 3 values user, login, logout
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
