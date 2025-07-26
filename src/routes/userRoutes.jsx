import { Route } from "react-router-dom";
import UserLayout from "../layouts/userLayout";
import UserDashboard from "../pages/user/Dashboard";
import Grade from "../pages/user/Grade";
import UserAttendance from "../pages/user/UserAttendance";
import HealthProfile from "../pages/user/HealthProfile";
import TextBooks from "../pages/user/TextBooks";
import Achievements from "../pages/user/Achievements";
import ProtectedRoute from "./ProtectedRoute";

const UserRoutes = (
  <Route
    element={
      <ProtectedRoute allowedRoles={["student"]}>
        <UserLayout />
      </ProtectedRoute>
    }
  >
    <Route path="/student/dashboard" element={<UserDashboard />} />
    <Route path="/grade" element={<Grade />} />
    <Route path="/userAttendance" element={<UserAttendance />} />
    <Route path="/health-profile" element={<HealthProfile />} />
    <Route path="/text-books" element={<TextBooks />} />
    <Route path="/achievements" element={<Achievements />} />
  </Route>
);

export default UserRoutes;
