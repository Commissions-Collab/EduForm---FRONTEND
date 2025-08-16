// src/pages/student/UserDashboard.jsx (or wherever your Dashboard.jsx is located)
import React, { useEffect } from "react";
import DashboardStatCard from "../../components/user/DashboardStatCard";
import NotificationCard from "../../components/user/NotificationCard";
import { useStoreUser } from "../../stores/useStoreUser";
import { LuCircleAlert } from "react-icons/lu";

const Dashboard = () => {
  const {
    dashboardData,
    fetchDashboard,
    dashboardLoading,
    dashboardError,
    clearDashboardError
  } = useStoreUser();

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  // Transform API data to match component expectations
  const transformedStats = [
    {
      title: "QUARTERLY AVERAGE",
      value: `${dashboardData.grades}%`,
      change: dashboardData.grade_change_percent > 0 ? `+${dashboardData.grade_change_percent}%` : `${dashboardData.grade_change_percent}%`,
      progress: true,
    },
    {
      title: "ATTENDANCE RATE",
      value: `${dashboardData.attendance_rate.present_percent}%`,
      subText: `${dashboardData.attendance_rate.recent_absents.length} recent absences`,
      progress: true,
    },
    {
      title: "RESOURCES",
      value: `${dashboardData.borrow_book} Books Borrowed`,
      resources: dashboardData.book_due_this_week > 0 ? [`${dashboardData.book_due_this_week} book(s) due this week`] : [],
    },
  ];

  // Transform notifications from API data
  const transformedNotifications = dashboardData.notifications.map((notification, index) => ({
    type: notification.includes('overdue') || notification.includes('due') ? 'clock' : 
          notification.includes('grade') || notification.includes('below') ? 'alert' : 'award',
    message: notification,
    suggestion: notification.includes('grade') ? 'Consider scheduling time with a tutor.' : 
               notification.includes('due') ? 'Return books on time to avoid fines.' : '',
    time: 'Today',
    fine: notification.includes('fine') ? '50' : null,
    returnDate: notification.includes('due') ? 'This week' : null,
  }));

  if (dashboardLoading) {
    return (
      <main className="p-4">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </main>
    );
  }

  if (dashboardError) {
    return (
      <main className="p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">{dashboardError}</p>
          <button 
            onClick={clearDashboardError}
            className="mt-2 text-red-600 hover:text-red-800 underline"
          >
            Try again
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="p-4">
      <div className="flex justify-between items-center">
        <h1 className="page-title">Student Dashboard</h1>
        <p className="text-sm text-gray-500">Last updated: Today, {new Date().toLocaleTimeString()}</p>
      </div>

      {/* Important Notifications Section */}
      {transformedNotifications.length > 0 && (
        <section className="bg-white p-4 rounded-lg shadow-md mt-5 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center mb-4">
            <LuCircleAlert className="w-6 h-6 text-red-500 mr-2" />
            Important Notifications
          </h2>
          <div className="grid grid-cols-1 gap-4">
            {transformedNotifications.map((notification, index) => (
              <NotificationCard
                key={index}
                type={notification.type}
                message={notification.message}
                suggestion={notification.suggestion}
                time={notification.time}
                fine={notification.fine}
                returnDate={notification.returnDate}
              />
            ))}
          </div>
        </section>
      )}

      {/* Dashboard Stats Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {transformedStats.map((stat, index) => (
          <DashboardStatCard
            key={index}
            title={stat.title}
            value={stat.value}
            subText={stat.subText}
            change={stat.change}
            progress={stat.progress}
            resources={stat.resources}
          />
        ))}
      </section>
    </main>
  );
};

export default Dashboard;
