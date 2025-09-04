import { Route } from "react-router-dom";
import SuperAdminLayout from "../layouts/superAdminLayout";
import ProtectedRoute from "./ProtectedRoute";
import AcademicManagement from "../pages/superadmin/AcademicManagement";
import AcademicYear from "../pages/superadmin/AcademicYear";
import CalendarManagement from "../pages/superadmin/CalendarManagement";
import FormsManagement from "../pages/superadmin/FormsManagement";
import SuperAdminDashboard from "../pages/superadmin/SuperAdminDashboard";
import TeacherManagement from "../pages/superadmin/TeacherManagement";
import ErrorBoundary from "../components/common/ErrorBoundary";

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
    <Route path="academicManagement" element={<AcademicManagement />} />
    <Route path="academicYear" element={<AcademicYear />} />
    <Route path="calendar" element={<CalendarManagement />} />
    <Route path="forms" element={<FormsManagement />} />
    <Route path="teacher" element={<TeacherManagement />} />
  </Route>
);

export default SuperAdminRoutes;
