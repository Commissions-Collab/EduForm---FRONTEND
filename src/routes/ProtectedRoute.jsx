import { Navigate } from "react-router-dom";
import { useAuthStore } from "../stores/useAuthStore";

const ProtectedRoute = ({ allowedRoles, children }) => {
  const user = useAuthStore((state) => state.user);

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
