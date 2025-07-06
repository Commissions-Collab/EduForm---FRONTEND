import { Route } from "react-router-dom";
import UserLayout from "../layouts/userLayout";
import UserDashboard from "../pages/user/Dashboard";

const UserRoutes = [
  <>
    <Route element={<UserLayout />}>
      <Route path="/student/dashboard" element={<UserDashboard />} />
    </Route>
  </>,
];

export default UserRoutes;
