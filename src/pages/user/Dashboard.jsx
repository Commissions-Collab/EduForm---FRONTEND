import React, { useEffect } from "react";
import { LuUser } from "react-icons/lu";
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
          totalAverage={data.grades.total_average}
          gradeChangePercent={data.grade_change_percent}
          attendanceRate={data.attendance_rate.present_percent}
          borrowBook={data.borrow_book}
          bookDueThisWeek={data.book_due_this_week}
          loading={loading}
        />
      </div>

      <section
        className="mb-8 animate-slide-up"
        style={{ animationDelay: "100ms" }}
      >
        <DashboardNotifications
          notifications={data.notifications}
          recentAbsents={data.attendance_rate.recent_absents}
          loading={loading}
          error={error}
        />
      </section>

      <section className="animate-slide-up" style={{ animationDelay: "200ms" }}>
        <DashboardGrades
          grades={data.grades.subjects}
          loading={loading}
          error={error}
        />
      </section>
    </main>
  );
};

export default Dashboard;
