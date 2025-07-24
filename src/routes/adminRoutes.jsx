import { Route } from "react-router-dom";
import AdminLayout from "../layouts/adminLayout";
import AdminDashboard from "../pages/admin/Dashboard";
import ParentConference from "../pages/admin/ParentConference";
import MonthlySummary from "../pages/admin/forms/MonthlySummary";
import PromotionReports from "../pages/admin/forms/PromotionReports";
import Certificates from "../pages/admin/Certificates";
import Textbook from "../pages/admin/forms/Textbook";
import Workload from "../pages/admin/forms/Workload";
import Attendance from "../pages/admin/forms/Attendance";
import Grades from "../pages/admin/forms/AcademicRecords";
import Enrollment from "../pages/admin/forms/Enrollment";
import HealthProfile from "../pages/admin/forms/HealthProfile";
import PromotionSummary from "../pages/admin/forms/PromotionSummary";
import PermanentRecords from "../pages/admin/forms/PermanentRecords";
import ProtectedRoute from "../components/ProtectedRoute";

const AdminRoutes = (
  <Route
    path="/teacher"
    element={
      <ProtectedRoute allowedRoles={["teacher"]}>
        <AdminLayout />
      </ProtectedRoute>
    }
  >
    <Route path="dashboard" element={<AdminDashboard />} />
    <Route path="attendance" element={<Attendance />} />
    <Route path="monthlySummary" element={<MonthlySummary />} />
    <Route path="grades" element={<Grades />} />
    <Route path="promotionReports" element={<PromotionReports />} />
    <Route path="certificates" element={<Certificates />} />
    <Route path="parentConference" element={<ParentConference />} />
    <Route path="textbook" element={<Textbook />} />
    <Route path="workload" element={<Workload />} />
    <Route path="enrollment" element={<Enrollment />} />
    <Route path="healthProfile" element={<HealthProfile />} />
    <Route path="promotionSummary" element={<PromotionSummary />} />
    <Route path="permanentRecords" element={<PermanentRecords />} />
  </Route>
);

export default AdminRoutes;
