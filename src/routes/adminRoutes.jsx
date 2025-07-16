import { Route } from "react-router-dom";
import AdminLayout from "../layouts/adminLayout";
import AdminDashboard from "../pages/admin/Dashboard";
import ParentConference from "../pages/admin/ParentConference";
import MonthlySummary from "../pages/admin/forms/MonthlySummary";
import Records from "../pages/admin/forms/AcademicRecords";
import PromotionReports from "../pages/admin/forms/PromotionReports";
import Certificates from "../pages/admin/Certificates";
import Textbook from "../pages/admin/forms/Textbook";
import Workload from "../pages/admin/forms/Workload";
import Attendance from "../pages/admin/forms/Attendance";

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
