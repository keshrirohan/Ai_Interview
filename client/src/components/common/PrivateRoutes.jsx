/**
 * PrivateRoutes.jsx
 *
 * Route guard component for authenticated-only pages.
 *
 * How it works:
 *   - While the auth check is still running (/me request in AuthProvider),
 *     we show LoadingScreen instead of flashing an unauthorized redirect.
 *   - Once loading is complete:
 *       logged in  → render child routes via <Outlet>
 *       logged out → redirect to "/" (home)
 *
 * Usage in App.jsx:
 *   <Route element={<PrivateRoutes />}>
 *     <Route path="/profile/:id" element={<Profile />} />
 *   </Route>
 */

import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import LoadingScreen from "./LoadingScreen";

const PrivateRoutes = () => {
  const { user, loading } = useAuth();

  // Wait for the session check to finish before deciding to redirect
  if (loading) return <LoadingScreen />;

  // Not logged in — send to home page
  if (!user) return <Navigate to="/" />;

  // Logged in — render the protected child route
  return <Outlet />;
};

export default PrivateRoutes;
