// components/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import DashboardCard from "../../components/admin/DashboardCard";
import { useAdminStore } from "../../stores/useAdminStore";
import {
  LuTrendingUp,
  LuCalendar,
  LuUsers,
  LuBookOpen,
  LuRefreshCw,
  LuBadgeAlert,
  LuActivity,
} from "react-icons/lu";

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
  } = useAdminStore();

  const [selectedQuarter, setSelectedQuarter] = useState(null);
  const [attendanceDate, setAttendanceDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  // Fetch data on component mount and when filters change
  useEffect(() => {
    fetchDashboardData(selectedQuarter, attendanceDate);
  }, [selectedQuarter, attendanceDate, fetchDashboardData]);

  // Get processed data
  const attendanceData = getAttendanceData();
  const academicData = getAcademicData();
  const resourcesData = getResourcesData();
  const weeklySummary = getWeeklySummary();
  const sectionInfo = getSectionInfo();

  // Create cards array with real data
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

  if (loading && !dashboardData) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <main className="p-4">
          <div className="flex items-center justify-center h-64">
            <div className="flex items-center space-x-2">
              <LuRefreshCw className="w-6 h-6 animate-spin text-indigo-600" />
              <span className="text-gray-600">Loading dashboard...</span>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <main className="p-4">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start space-y-6 lg:space-y-0">
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <LuActivity className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Dashboard
                  </h1>
                  <p className="text-gray-600">
                    Welcome back! Here's what's happening with your school
                    today.
                  </p>
                </div>
              </div>

              {sectionInfo && (
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-500">Section:</span>
                    <span className="font-medium text-gray-700">
                      {sectionInfo.section_name}
                    </span>
                  </div>
                  <div className="text-gray-300">•</div>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-500">Students:</span>
                    <span className="font-medium text-gray-700">
                      {sectionInfo.total_students}
                    </span>
                  </div>
                  <div className="text-gray-300">•</div>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-500">Academic Year:</span>
                    <span className="font-medium text-gray-700">
                      {sectionInfo.academic_year}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
              {/* Filters */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                <input
                  type="date"
                  value={attendanceDate}
                  onChange={(e) => setAttendanceDate(e.target.value)}
                  className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
                />
                <select
                  value={selectedQuarter || ""}
                  onChange={(e) => setSelectedQuarter(e.target.value || null)}
                  className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="">All Quarters</option>
                  <option value="1">1st Quarter</option>
                  <option value="2">2nd Quarter</option>
                  <option value="3">3rd Quarter</option>
                  <option value="4">4th Quarter</option>
                </select>
                <button
                  onClick={handleRefresh}
                  disabled={loading}
                  className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center justify-center space-x-2 transition-colors"
                >
                  <LuRefreshCw
                    className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
                  />
                  <span>Refresh</span>
                </button>
              </div>
            </div>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
              <LuBadgeAlert className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-red-800">{error}</p>
                <button
                  onClick={handleRefresh}
                  className="text-sm text-red-600 hover:text-red-800 underline mt-1"
                >
                  Try again
                </button>
              </div>
            </div>
          )}

          {/* Last Updated */}
          {lastUpdated && (
            <div className="mt-3 text-xs text-gray-500">
              Last updated: {new Date(lastUpdated).toLocaleString()}
            </div>
          )}
        </div>

        {/* Main Dashboard Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 mb-8">
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

        {/* Weekly Summary Section */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                This Week's Summary
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Key metrics and highlights from the past week
              </p>
            </div>
            <div className="w-2 h-8 bg-gradient-to-b from-indigo-500 to-purple-600 rounded-full"></div>
          </div>

          {/* Weekly Summary Content */}
          {weeklySummary ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-700">
                  Attendance Trends
                </h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Average Daily</span>
                    <span className="font-semibold text-green-600">
                      {weeklySummary.attendanceTrends.averageDaily}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Best Day</span>
                    <span className="font-semibold text-gray-900">
                      {weeklySummary.attendanceTrends.bestDay}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Improvement</span>
                    <span className="font-semibold text-blue-600">
                      {weeklySummary.attendanceTrends.improvement}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-gray-700">
                  Academic Updates
                </h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">
                      Grades Submitted
                    </span>
                    <span className="font-semibold text-purple-600">
                      {weeklySummary.academicUpdates.gradesSubmitted}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">
                      Reports Generated
                    </span>
                    <span className="font-semibold text-gray-900">
                      {weeklySummary.academicUpdates.reportsGenerated}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      Pending Reviews
                    </span>
                    <span className="font-semibold text-amber-600">
                      {weeklySummary.academicUpdates.pendingReviews}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-gray-700">System Status</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Active Users</span>
                    <span className="font-semibold text-blue-600">
                      {weeklySummary.systemStatus.activeUsers?.toLocaleString() ||
                        0}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              {loading ? "Loading summary..." : "No summary data available"}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
