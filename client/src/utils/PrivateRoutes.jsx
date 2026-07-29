import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./useContext";
import LoadingScreen from "../components/LoadingScreen";

const PrivateRoutes = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />; // Show loading screen while checking authentication status
  }

  if (!user) {
    return <Navigate to="/" />;
  }
  //outlet is used to render the child routes of the private route
  return <Outlet />;
};

export default PrivateRoutes;
