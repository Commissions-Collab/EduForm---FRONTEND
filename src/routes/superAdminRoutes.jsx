import { Route } from "react-router-dom";
import SuperAdminLayout from "../layouts/superAdminLayout";
import SuperAdminDashboard from "../pages/superadmin/Dashboard";
import Users from "../pages/superadmin/Users";
import Forms from "../pages/superadmin/Forms";
import Records from "../pages/superadmin/Records";
import Calendar from "../pages/superadmin/Calendar";

const SuperAdminRoutes = [
  <>
    <Route element={<SuperAdminLayout />}>
      <Route path="/superadmin/dashboard" element={<SuperAdminDashboard />} />
      <Route path="/users" element={<Users />} />
      <Route path="/forms" element={<Forms />} />
      <Route path="/records" element={<Records />} />
      <Route path="/calendar" element={<Calendar />} />
    </Route>
  </>,
];

export default SuperAdminRoutes;
