import React, { useEffect } from "react";
import toast from "react-hot-toast";
import useStudentDashboardStore from "../../stores/users/studentDashboardStore";
import DashboardSummary from "../../components/user/DashboardSummary";
import DashboardNotifications from "../../components/user/DashboardNotifications";
import DashboardGrades from "../../components/user/DashboardGrades";

const Dashboard = () => {
  const { data, loading, error, fetchDashboard, clearError } =
    useStudentDashboardStore();

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [error, clearError]);

  // Safe data access with defaults
  const totalAverage = data?.grades?.total_average ?? 0;
  const subjects = Array.isArray(data?.grades?.subjects)
    ? data.grades.subjects
    : [];
  const gradeChangePercent = data?.grade_change_percent ?? 0;
  const attendanceRate = data?.attendance_rate?.present_percent ?? 0;
  const recentAbsents = Array.isArray(data?.attendance_rate?.recent_absents)
    ? data.attendance_rate.recent_absents
    : [];
  const borrowBook = data?.borrow_book ?? 0;
  const bookDueThisWeek = data?.book_due_this_week ?? 0;
  const notifications = Array.isArray(data?.notifications)
    ? data.notifications
    : [];

  return (
    <main className="bg-gray-50/50 p-4 lg:p-6 min-h-screen animate-fade-in">
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6 animate-slide-up">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Student Dashboard
            </h1>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full font-medium animate-pulse">
                Student Panel
              </span>
            </div>
          </div>
        </div>

        <DashboardSummary
          totalAverage={totalAverage}
          gradeChangePercent={gradeChangePercent}
          attendanceRate={attendanceRate}
          borrowBook={borrowBook}
          bookDueThisWeek={bookDueThisWeek}
          loading={loading}
        />
      </div>

      <section
        className="mb-8 animate-slide-up"
        style={{ animationDelay: "100ms" }}
      >
        <DashboardNotifications
          notifications={notifications}
          recentAbsents={recentAbsents}
          loading={loading}
          error={error}
        />
      </section>

      <section className="animate-slide-up" style={{ animationDelay: "200ms" }}>
        <DashboardGrades grades={subjects} loading={loading} error={error} />
      </section>
    </main>
  );
};

export default Dashboard;
