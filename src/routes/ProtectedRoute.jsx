import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../stores/auth";

const ProtectedRoute = ({ allowedRoles = [], children }) => {
  const { user, isCheckingAuth } = useAuthStore();
  const location = useLocation();

  // Show loading while checking auth
  if (isCheckingAuth) {
    return <div>Loading...</div>;
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/sign-in" state={{ from: location }} replace />;
  }

  // Redirect if user role not in allowed roles
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to={`/${user.role}/dashboard`} replace />;
  }

  return children;
};

export default ProtectedRoute;
