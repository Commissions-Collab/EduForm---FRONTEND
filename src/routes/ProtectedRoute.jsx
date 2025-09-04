import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../stores/auth";
import LoadingPage from "../components/common/LoadingPage";

const ProtectedRoute = ({ allowedRoles, children }) => {
  const { user, isCheckingAuth } = useAuthStore();
  const location = useLocation();

  if (isCheckingAuth) {
    return;
  }

  if (!user) {
    return <Navigate to="/sign-in" state={{ from: location }} replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to={`/${user.role}/dashboard`} replace />;
  }

  return children;
};

export default ProtectedRoute;
