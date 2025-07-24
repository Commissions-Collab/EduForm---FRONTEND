import { Navigate } from "react-router-dom";
import { useAuthStore } from "../stores/useAuthStore";

const ProtectedRoute = ({ allowedRoles, children }) => {
  const { user } = useAuthStore();

  if (!user) {
    return <Navigate to="/sign-in" />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/not-found" />;
  }

  return children;
};

export default ProtectedRoute;
