import { Route } from "react-router-dom";
import AdminLayout from "../layouts/adminLayout";
import AdminDashboard from "../pages/admin/Dashboard";
import Attendance from "../pages/admin/Attendance";
import MonthlySummary from "../pages/admin/MonthlySummary";
import PromotionReports from "../pages/admin/PromotionReports";
import Certificates from "../pages/admin/Certificates";
import ParentConference from "../pages/admin/ParentConference";
import Textbook from "../pages/admin/Textbook";
import Workload from "../pages/admin/Workload";
import Records from "../pages/admin/AcademicRecords";

const AdminRoutes = [
  <>
    <Route element={<AdminLayout />}>
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/attendance" element={<Attendance />} />
      <Route path="/monthlySummary" element={<MonthlySummary />} />
      <Route path="/academicRecords" element={<Records />} />
      <Route path="/promotionReports" element={<PromotionReports />} />
      <Route path="/certificates" element={<Certificates />} />
      <Route path="/parentConference" element={<ParentConference />} />
      <Route path="/textbook" element={<Textbook />} />
      <Route path="/workload" element={<Workload />} />
    </Route>
  </>,
];

export default AdminRoutes;
