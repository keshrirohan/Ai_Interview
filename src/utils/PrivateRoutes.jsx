import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./useContext";

const PrivateRoutes = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/" />;
  }
  //outlet is used to render the child routes of the private route
  return <Outlet />;
};

export default PrivateRoutes;
