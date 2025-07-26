import { Route } from "react-router-dom";
import SuperAdminLayout from "../layouts/superAdminLayout";
import SuperAdminDashboard from "../pages/superadmin/Dashboard";
import Users from "../pages/superadmin/Users";
import Forms from "../pages/superadmin/Forms";
import Records from "../pages/superadmin/Records";
import Calendar from "../pages/superadmin/Calendar";
import ProtectedRoute from "./ProtectedRoute";

const SuperAdminRoutes = [
  <Route
    key="superadmin"
    element={
      <ProtectedRoute allowedRoles={["super_admin"]}>
        <SuperAdminLayout />
      </ProtectedRoute>
    }
  >
    <Route path="/super_admin/dashboard" element={<SuperAdminDashboard />} />
    <Route path="/superadmin/users" element={<Users />} />
    <Route path="/superadmin/forms" element={<Forms />} />
    <Route path="/superadmin/records" element={<Records />} />
    <Route path="/superadmin/calendar" element={<Calendar />} />
  </Route>,
];

export default SuperAdminRoutes;
