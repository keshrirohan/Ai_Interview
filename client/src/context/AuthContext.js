/**
 * AuthContext.js
 *
 * Creates the React Context used to share authentication state
 * across the entire application without prop drilling.
 *
 * The context value (set in AuthProvider.jsx) exposes:
 *   user    — the logged-in user object, or null
 *   login   — call this after a successful login to store the user
 *   logout  — call this to clear the user from state
 *   loading — true while the /me check is still in progress
 *
 * How to consume it anywhere in the app:
 *   import { useAuth } from "../context/AuthContext";
 *   const { user, login, logout, loading } = useAuth();
 */

import { createContext, useContext } from "react";

export const AuthContext = createContext();

/**
 * useAuth — convenience hook that reads from AuthContext.
 * Throws a clear error if used outside of AuthProvider so
 * developers get an obvious message instead of a silent null.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  console.log("useAuth context:", context); // Debugging line
  if (!context) {
    throw new Error("useAuth must be used inside an <AuthProvider>.");
  }
  return context;
};
