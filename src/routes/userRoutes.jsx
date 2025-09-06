import { Route } from "react-router-dom";
import UserLayout from "../layouts/userLayout";
import UserDashboard from "../pages/user/Dashboard";
import Grade from "../pages/user/Grade";
import UserAttendance from "../pages/user/UserAttendance";
import HealthProfile from "../pages/user/HealthProfile";
import TextBooks from "../pages/user/TextBooks";
import Achievements from "../pages/user/Achievements";
import ProtectedRoute from "./ProtectedRoute";
import ErrorBoundary from "../components/common/ErrorBoundary";

const UserRoutes = (
  <Route
    element={
      <ProtectedRoute allowedRoles={["student"]}>
        <ErrorBoundary>
          <UserLayout />
        </ErrorBoundary>
      </ProtectedRoute>
    }
  >
    <Route path="/student/dashboard" element={<UserDashboard />} />
    <Route path="/student/grade" element={<Grade />} />
    <Route path="/student/userAttendance" element={<UserAttendance />} />
    <Route path="/student/health-profile" element={<HealthProfile />} />
    <Route path="/student/text-books" element={<TextBooks />} />
    <Route path="/student/achievements" element={<Achievements />} />
  </Route>
);

export default UserRoutes;
