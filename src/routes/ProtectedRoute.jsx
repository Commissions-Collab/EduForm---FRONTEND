import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../stores/auth";

const ProtectedRoute = ({ allowedRoles, children }) => {
  const { user } = useAuthStore();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/sign-in" state={{ from: location }} replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to={`/${user.role}/dashboard`} replace />;
  }

  return children;
};

export default ProtectedRoute;
