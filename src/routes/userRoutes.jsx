import { Route } from "react-router-dom";
import UserLayout from "../layouts/userLayout";
import UserDashboard from "../pages/user/Dashboard";

const UserRoutes = [
  <>
    <Route path="/student" element={<UserLayout />}>
      <Route path="dashboard" element={<UserDashboard />} />
    </Route>
  </>,
];

export default UserRoutes;
