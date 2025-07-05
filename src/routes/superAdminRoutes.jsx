import { Route } from "react-router-dom";
import SuperAdminLayout from "../layouts/superAdminLayout";
import SuperAdminDashboard from "../pages/superadmin/Dashboard";

const SuperAdminRoutes = [
  <>
    <Route path="/superadmin" element={<SuperAdminLayout />}>
      <Route path="dashboard" element={<SuperAdminDashboard />} />
    </Route>
  </>,
];

export default SuperAdminRoutes;
