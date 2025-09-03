import { Route } from "react-router-dom";
import AdminLayout from "../layouts/adminLayout";
import AdminDashboard from "../pages/admin/Dashboard";
import ParentConference from "../pages/admin/ParentConference";
import PromotionReports from "../pages/admin/forms/PromotionReports";
import Certificates from "../pages/admin/Certificates";
import Textbook from "../pages/admin/forms/Textbook";
import Workload from "../pages/admin/forms/Workload";
import Attendance from "../pages/admin/forms/Attendance";
import Grades from "../pages/admin/forms/AcademicRecords";
import HealthProfile from "../pages/admin/forms/HealthProfile";
import PermanentRecords from "../pages/admin/forms/PermanentRecords";
import ProtectedRoute from "./ProtectedRoute";
import StudentApproval from "../pages/admin/forms/StudentApproval";

import DailyAttendance from "../pages/admin/forms/Attendance";
import AttendanceMonthlySummary from "../pages/admin/forms/AttendanceMonthlySummary";
import StudentAttendanceHistory from "../pages/admin/StudentAttendanceHistory";

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
    <Route path="attendance" element={<DailyAttendance />} />
    <Route
      path="attendanceMonthlySummary"
      element={<AttendanceMonthlySummary />}
    />
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
    <Route path="studentApproval" element={<StudentApproval />} />
    <Route path="healthProfile" element={<HealthProfile />} />
    <Route path="permanentRecords" element={<PermanentRecords />} />
  </Route>
);

export default AdminRoutes;
