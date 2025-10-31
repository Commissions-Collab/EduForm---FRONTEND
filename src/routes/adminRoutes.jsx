import { Route } from "react-router-dom";
import AdminLayout from "../layouts/adminLayout";
import AdminDashboard from "../pages/admin/Dashboard";
import ParentConference from "../pages/admin/ParentConference";
import PromotionReports from "../pages/admin/forms/PromotionReports";
import Certificates from "../pages/admin/Certificates";
import Textbook from "../pages/admin/forms/Textbook";
import Workload from "../pages/admin/forms/Workload";
import Grades from "../pages/admin/forms/AcademicRecords";
import HealthProfile from "../pages/admin/forms/HealthProfile";
import PermanentRecords from "../pages/admin/forms/PermanentRecords";
import ProtectedRoute from "./ProtectedRoute";
import DailyAttendance from "../pages/admin/forms/Attendance";

import StudentAttendanceHistory from "../pages/admin/StudentAttendanceHistory";
import ErrorBoundary from "../components/common/ErrorBoundary";

const AdminRoutes = (
  <Route
    path="/teacher"
    element={
      <ProtectedRoute allowedRoles={["teacher"]}>
        <ErrorBoundary>
          <AdminLayout />
        </ErrorBoundary>
      </ProtectedRoute>
    }
  >
    <Route path="dashboard" element={<AdminDashboard />} />
    <Route path="attendance" element={<DailyAttendance />} />

    <Route
      path="attendance/history/:scheduleId/:studentId"
      element={<StudentAttendanceHistory />}
    />
    <Route path="grades" element={<Grades />} />
    <Route path="promotionReports" element={<PromotionReports />} />
    <Route path="certificates" element={<Certificates />} />
    <Route path="parentConference" element={<ParentConference />} />
    <Route path="textbook" element={<Textbook />} />
    <Route path="workload" element={<Workload />} />

    <Route path="healthProfile" element={<HealthProfile />} />
    <Route path="permanentRecords" element={<PermanentRecords />} />
  </Route>
);

export default AdminRoutes;
