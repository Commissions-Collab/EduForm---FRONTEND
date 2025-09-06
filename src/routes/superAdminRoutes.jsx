import { Route } from "react-router-dom";
import SuperAdminLayout from "../layouts/superAdminLayout";
import ProtectedRoute from "./ProtectedRoute";
import SuperAdminDashboard from "../pages/superadmin/SuperAdminDashboard";
import ErrorBoundary from "../components/common/ErrorBoundary";
import Enrollment from "../pages/superadmin/Enrollment";
import AcademicCalendar from "../pages/superadmin/AcademicCalendar";
import ClassManagement from "../pages/superadmin/ClassManagement";
import TeacherManagement from "../pages/superadmin/TeacherManagement";

const SuperAdminRoutes = (
  <Route
    path="/super_admin"
    element={
      <ProtectedRoute allowedRoles={["super_admin"]}>
        <ErrorBoundary>
          <SuperAdminLayout />
        </ErrorBoundary>
      </ProtectedRoute>
    }
  >
    <Route path="dashboard" element={<SuperAdminDashboard />} />
    <Route path="enrollment" element={<Enrollment />} />
    <Route path="calendar" element={<AcademicCalendar />} />
    <Route path="class" element={<ClassManagement />} />
    <Route path="teacher" element={<TeacherManagement />} />
  </Route>
);

export default SuperAdminRoutes;
