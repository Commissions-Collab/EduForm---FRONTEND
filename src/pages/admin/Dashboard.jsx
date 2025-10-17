// components/admin/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import { TrendingUp, Calendar, Users, BadgeAlert, Clock } from "lucide-react";
import useDashboardStore from "../../stores/admin/dashboardStore";
import useFilterStore from "../../stores/admin/filterStore";
import DashboardCard from "../../components/admin/DashboardCard";

const AdminDashboard = () => {
  const {
    dashboardData,
    loading,
    error,
    lastUpdated,
    fetchDashboardData,
    getAttendanceData,
    getAcademicData,
    getResourcesData,
    getWeeklySummary,
    getSectionInfo,
  } = useDashboardStore();

  const { filterOptions } = useFilterStore();

  const [selectedQuarter, setSelectedQuarter] = useState(null);
  const [attendanceDate, setAttendanceDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  useEffect(() => {
    fetchDashboardData(selectedQuarter, attendanceDate);
  }, [selectedQuarter, attendanceDate, fetchDashboardData]);

  const attendanceData = getAttendanceData();
  const academicData = getAcademicData();
  const resourcesData = getResourcesData();
  const weeklySummary = getWeeklySummary();
  const sectionInfo = getSectionInfo();

  const dashboardCards = [
    {
      id: 1,
      title: "Today's Attendance",
      type: "attendance",
      data: attendanceData || {
        present: { count: 0, percent: 0 },
        absent: { count: 0, percent: 0 },
        late: { count: 0, percent: 0 },
      },
    },
    {
      id: 2,
      title: "Academic Status",
      type: "academic",
      data: academicData || {
        reportsIssued: 0,
        honorEligible: 0,
        gradesSubmitted: 0,
      },
    },
    {
      id: 3,
      title: "Resources & Calendar",
      type: "resources",
      data: resourcesData || {
        textbookOverdues: 0,
        pendingReturns: 0,
        upcomingEvents: [],
      },
    },
  ];

  const handleRefresh = () => {
    fetchDashboardData(selectedQuarter, attendanceDate);
  };

  // Skeleton Loader
  const DashboardSkeleton = () => (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header Skeleton */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-12 h-12 bg-gray-200 rounded-xl animate-pulse" />
            <div className="space-y-2">
              <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-80 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>

          {/* Controls Skeleton */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <div className="flex flex-wrap items-center gap-4">
                <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-28 bg-gray-200 rounded animate-pulse" />
              </div>
              <div className="flex items-center space-x-3">
                <div className="h-10 w-32 bg-gray-200 rounded-lg animate-pulse" />
                <div className="h-10 w-36 bg-gray-200 rounded-lg animate-pulse" />
                <div className="h-10 w-24 bg-gray-200 rounded-lg animate-pulse" />
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Cards Skeleton */}
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

        {/* Weekly Summary Skeleton */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="h-6 w-48 bg-gray-200 rounded mb-6 animate-pulse" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-5 w-32 bg-gray-200 rounded mb-4" />
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="h-4 w-full bg-gray-200 rounded" />
                  <div className="h-4 w-2/3 bg-gray-200 rounded" />
                  <div className="h-4 w-1/2 bg-gray-200 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  if (loading && !dashboardData) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Main Header */}
        <header className="mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 text-sm mt-1">
                Welcome back! Here's what's happening with your school today.
              </p>
            </div>
          </div>

          {/* Section Info & Controls Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              {/* Section Information */}
              {sectionInfo && (
                <div className="flex flex-wrap items-center gap-6 text-sm">
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-500">Section:</span>
                    <span className="font-semibold text-gray-900 bg-gray-100 px-2 py-1 rounded">
                      {sectionInfo.section_name}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-500">Students:</span>
                    <span className="font-semibold text-indigo-600">
                      {sectionInfo.total_students}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-500">Academic Year:</span>
                    <span className="font-semibold text-gray-700">
                      {sectionInfo.academic_year}
                    </span>
                  </div>
                </div>
              )}

              {/* Controls */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-3">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <input
                    type="date"
                    value={attendanceDate}
                    onChange={(e) => setAttendanceDate(e.target.value)}
                    className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white transition-colors"
                  />
                </div>
                <select
                  value={selectedQuarter || ""}
                  onChange={(e) =>
                    setSelectedQuarter(
                      e.target.value ? parseInt(e.target.value, 10) : null
                    )
                  }
                  className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                >
                  <option value="">All Quarters</option>
                  {filterOptions.quarters?.map((quarter) => (
                    <option key={quarter.id} value={quarter.id}>
                      {quarter.name}
                    </option>
                  ))}
                </select>
                {/* <button
                  onClick={handleRefresh}
                  disabled={loading}
                  className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 transition-all duration-200 shadow-sm hover:shadow"
                >
                  <LuRefreshCw
                    className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
                  />
                  <span>Refresh</span>
                </button> */}
              </div>
            </div>

            {/* Last Updated Info */}
            {lastUpdated && (
              <div className="mt-4 pt-4 border-t border-gray-100 flex items-center space-x-2 text-xs text-gray-500">
                <Clock className="w-3 h-3" />
                <span>
                  Last updated: {new Date(lastUpdated).toLocaleString()}
                </span>
              </div>
            )}
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start space-x-3">
              <BadgeAlert className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
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

        {/* Main Content Grid */}
        <main className="space-y-8">
          {/* Dashboard Cards */}
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-indigo-600" />
              <span>Today's Overview</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {dashboardCards.map((card) => (
                <DashboardCard
                  key={card.id}
                  title={card.title}
                  type={card.type}
                  data={card.data}
                  loading={loading}
                />
              ))}
            </div>
          </section>

          {/* Weekly Summary */}
          <section>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-[#3730A3] px-6 py-4">
                <h2 className="text-xl font-bold text-white flex items-center space-x-2">
                  <Calendar className="w-5 h-5" />
                  <span>This Week's Summary</span>
                </h2>
                <p className="text-indigo-100 text-sm mt-1">
                  Key metrics and highlights from the past week
                </p>
              </div>

              <div className="p-6">
                {weeklySummary ? (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Attendance Trends */}
                    <div className="space-y-4">
                      <h3 className="font-semibold text-gray-900 flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>Attendance Trends</span>
                      </h3>
                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">
                            Average Daily
                          </span>
                          <span className="font-bold text-green-700 text-lg">
                            {weeklySummary.attendanceTrends.averageDaily}%
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">
                            Best Day
                          </span>
                          <span className="font-semibold text-gray-900">
                            {weeklySummary.attendanceTrends.bestDay}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Academic Updates */}
                    <div className="space-y-4">
                      <h3 className="font-semibold text-gray-900 flex items-center space-x-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <span>Academic Updates</span>
                      </h3>
                      <div className="bg-gradient-to-br from-purple-50 to-violet-50 border border-purple-200 rounded-lg p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">
                            Grades Submitted
                          </span>
                          <span className="font-bold text-purple-700 text-lg">
                            {weeklySummary.academicUpdates.gradesSubmitted}%
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* System Status */}
                    <div className="space-y-4">
                      <h3 className="font-semibold text-gray-900 flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span>System Status</span>
                      </h3>
                      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">
                            Active Users
                          </span>
                          <span className="font-bold text-blue-700 text-lg">
                            {weeklySummary.systemStatus.activeUsers?.toLocaleString() ||
                              0}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Calendar className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500">
                      {loading
                        ? "Loading summary..."
                        : "No summary data available"}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
