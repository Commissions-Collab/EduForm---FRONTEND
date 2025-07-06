import { Route } from "react-router-dom";
import SuperAdminLayout from "../layouts/superAdminLayout";
import SuperAdminDashboard from "../pages/superadmin/Dashboard";

const SuperAdminRoutes = [
  <>
    <Route element={<SuperAdminLayout />}>
      <Route path="/superadmin/dashboard" element={<SuperAdminDashboard />} />
    </Route>
  </>,
];

export default SuperAdminRoutes;
