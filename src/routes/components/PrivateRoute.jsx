// PrivateRoute.js
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { LOGIN } from "../routes";

const PrivateRoute = ({ children, layout: Layout }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to={LOGIN} replace />;
  }

  if (Layout) {
    return <Layout>{children}</Layout>;
  }

  return <>{children}</>;
};
export default PrivateRoute;
