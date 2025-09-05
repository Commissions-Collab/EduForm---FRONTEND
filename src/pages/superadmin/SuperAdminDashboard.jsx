import React, { useEffect, useState } from "react";
import {
  LuTrendingUp,
  LuCalendar,
  LuUsers,
  LuRefreshCw,
  LuBadgeAlert,
  LuClock,
  LuUser,
  LuSchool,
} from "react-icons/lu";
import useSuperAdminDashboardStore from "../../stores/superAdmin/superAdminDashboardStore";

const DashboardCard = ({ title, type, data, loading }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      {loading ? (
        <div className="space-y-3 animate-pulse">
          <div className="h-4 w-full bg-gray-200 rounded" />
          <div className="h-4 w-3/4 bg-gray-200 rounded" />
          <div className="h-4 w-1/2 bg-gray-200 rounded" />
        </div>
      ) : (
        <div className="space-y-3">
          {type === "enrollment" && (
            <>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total Enrollments</span>
                <span className="font-bold text-indigo-700 text-lg">
                  {data.total}
                </span>
              </div>
              {Object.entries(data.byYearLevel).map(([level, count]) => (
                <div key={level} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{level}</span>
                  <span className="font-semibold text-gray-900">{count}</span>
                </div>
              ))}
            </>
          )}
          {type === "events" && (
            <>
              {data.length > 0 ? (
                data.slice(0, 3).map((event, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <span className="text-sm text-gray-600">{event.title}</span>
                    <span className="font-semibold text-gray-900">
                      {new Date(event.date).toLocaleDateString()}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No upcoming events</p>
              )}
            </>
          )}
          {type === "counts" && (
            <>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total Students</span>
                <span className="font-bold text-indigo-700 text-lg">
                  {data.students}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total Teachers</span>
                <span className="font-bold text-indigo-700 text-lg">
                  {data.teachers}
                </span>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

const DashboardSkeleton = () => (
  <div className="bg-gray-50 min-h-screen">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-8">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-12 h-12 bg-gray-200 rounded-xl animate-pulse" />
          <div className="space-y-2">
            <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-80 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex flex-wrap items-center gap-4">
              <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-28 bg-gray-200 rounded animate-pulse" />
            </div>
            <div className="flex items-center space-x-3">
              <div className="h-10 w-32 bg-gray-200 rounded-lg animate-pulse" />
              <div className="h-10 w-24 bg-gray-200 rounded-lg animate-pulse" />
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 animate-pulse"
          >
            <div className="h-5 w-32 bg-gray-200 rounded mb-4" />
            <div className="space-y-3">
              <div className="h-4 w-full bg-gray-200 rounded" />
              <div className="h-4 w-3/4 bg-gray-200 rounded" />
              <div className="h-4 w-1/2 bg-gray-200 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const SuperAdminDashboard = () => {
  const {
    currentAcademicYear,
    upcomingEvents,
    enrollmentStats,
    studentCount,
    teacherCount,
    isLoading,
    error,
    fetchDashboardData,
  } = useSuperAdminDashboardStore();

  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const dashboardCards = [
    {
      id: 1,
      title: "Enrollment Statistics",
      type: "enrollment",
      data: enrollmentStats,
    },
    {
      id: 2,
      title: "Upcoming Events",
      type: "events",
      data: upcomingEvents,
    },
    {
      id: 3,
      title: "School Statistics",
      type: "counts",
      data: { students: studentCount, teachers: teacherCount },
    },
  ];

  const handleRefresh = () => {
    fetchDashboardData();
  };

  if (isLoading && !currentAcademicYear) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <header className="mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Super Admin Dashboard
              </h1>
              <p className="text-gray-600 text-sm mt-1">
                Overview of school operations and key metrics
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <div className="flex flex-wrap items-center gap-6 text-sm">
                {currentAcademicYear && (
                  <div className="flex items-center space-x-2">
                    <LuCalendar className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-500">Academic Year:</span>
                    <span className="font-semibold text-gray-700">
                      {currentAcademicYear.name}
                    </span>
                  </div>
                )}
                <div className="flex items-center space-x-2">
                  <LuUser className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-500">Students:</span>
                  <span className="font-semibold text-indigo-600">
                    {studentCount}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <LuSchool className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-500">Teachers:</span>
                  <span className="font-semibold text-indigo-600">
                    {teacherCount}
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <LuCalendar className="w-4 h-4 text-gray-400" />
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white transition-colors"
                  />
                </div>
                <button
                  onClick={handleRefresh}
                  disabled={isLoading}
                  className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 transition-all duration-200 shadow-sm hover:shadow"
                >
                  <LuRefreshCw
                    className={`w tyrannized w-4 h-4 ${
                      isLoading ? "animate-spin" : ""
                    }`}
                  />
                  <span>Refresh</span>
                </button>
              </div>
            </div>
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start space-x-3">
              <LuBadgeAlert className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-red-800 mb-1">
                  Error loading dashboard data
                </p>
                <p className="text-sm text-red-700">{error}</p>
                <button
                  onClick={handleRefresh}
                  className="text-sm text-red-600 hover:text-red-800 underline mt-2 transition-colors"
                >
                  Try again
                </button>
              </div>
            </div>
          )}
        </header>

        <main className="space-y-8">
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <LuTrendingUp className="w-5 h-5 text-indigo-600" />
              <span>Overview</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {dashboardCards.map((card) => (
                <DashboardCard
                  key={card.id}
                  title={card.title}
                  type={card.type}
                  data={card.data}
                  loading={isLoading}
                />
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
