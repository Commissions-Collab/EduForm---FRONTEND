import React, { useEffect, useState } from "react";
import {
  LuUsers,
  LuCalendar,
  LuBookOpen,
  LuUserCheck,
  LuSearch,
} from "react-icons/lu";
import useSuperAdminDashboardStore from "../../stores/superAdmin/superAdminDashboardStore";
import RecentActivityTable from "../../components/superadmin/RecentActivityTable";

const SuperAdminDashboard = () => {
  const { fetchDashboardData, dashboardData, isLoading, error } =
    useSuperAdminDashboardStore();
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch dashboard data on mount
  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Extract summary stats (fallback to 0 if data is not available)
  const totalTeachers = dashboardData?.totalTeachers || 0;
  const totalStudents = dashboardData?.totalStudents || 0;
  const totalEvents = dashboardData?.totalEvents || 0;
  const totalEnrollments = dashboardData?.totalEnrollments || 0;

  return (
    <main className="bg-gray-50/50 p-4 lg:p-6">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div>
            <h1 className="page-title">Super Admin Dashboard</h1>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full font-medium">
                Admin
              </span>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            <div className="relative w-full lg:w-80">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LuSearch className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition-all duration-200"
                placeholder="Search recent activity..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Summary Statistics */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {/* Total Teachers Card */}
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200 hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600 mb-1">
                  Total Teachers
                </p>
                <p className="text-2xl font-bold text-blue-900">
                  {isLoading ? "..." : totalTeachers}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <LuUsers className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          {/* Total Students Card */}
          <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-6 border border-green-200 hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600 mb-1">
                  Total Students
                </p>
                <p className="text-2xl font-bold text-green-900">
                  {isLoading ? "..." : totalStudents}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <LuUsers className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          {/* Total Events Card */}
          <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200 hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600 mb-1">
                  Total Events
                </p>
                <p className="text-2xl font-bold text-purple-900">
                  {isLoading ? "..." : totalEvents}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <LuCalendar className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          {/* Total Enrollments Card */}
          <div className="bg-gradient-to-r from-amber-50 to-amber-100 rounded-xl p-6 border border-amber-200 hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-amber-600 mb-1">
                  Total Enrollments
                </p>
                <p className="text-2xl font-bold text-amber-900">
                  {isLoading ? "..." : totalEnrollments}
                </p>
              </div>
              <div className="p-3 bg-amber-100 rounded-lg">
                <LuBookOpen className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-4 text-sm text-red-600 bg-red-50 p-4 rounded-lg">
            {error}
          </div>
        )}
      </div>

      {/* Recent Activity Table */}
      <RecentActivityTable searchTerm={searchTerm} />
    </main>
  );
};

export default SuperAdminDashboard;
