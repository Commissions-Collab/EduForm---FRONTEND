import { Route } from "react-router-dom";
import UserLayout from "../layouts/userLayout";
import UserDashboard from "../pages/user/Dashboard";
import Grade from "../pages/user/Grade";

const UserRoutes = [
  <>
    <Route element={<UserLayout />}>
      <Route path="/student/dashboard" element={<UserDashboard />} />
      <Route path="/grade" element={<Grade />} />
    </Route>
  </>,
];

export default UserRoutes;
