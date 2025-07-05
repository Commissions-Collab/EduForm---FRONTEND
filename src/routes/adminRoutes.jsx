import { Route } from "react-router-dom";
import AdminLayout from "../layouts/adminLayout";
import AdminDashboard from "../pages/admin/Dashboard";

const AdminRoutes = [
  <>
    <Route path="/admin" element={<AdminLayout />}>
      <Route path="dashboard" element={<AdminDashboard />} />
    </Route>
  </>,
];

export default AdminRoutes;
