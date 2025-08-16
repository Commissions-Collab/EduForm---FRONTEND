import React from "react";
import { adminCards } from "../../constants";
import DashboardCard from "../../components/admin/DashboardCard";
import { LuTrendingUp, LuCalendar, LuUsers, LuBookOpen } from "react-icons/lu";

const AdminDashboard = () => {
  return (
    <div className="bg-gray-50">
      <main className="p-4">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
            <div>
              <h1 className="page-title">Dashboard</h1>
              <p className="mt-2 text-sm text-gray-600">
                Welcome back! Here's what's happening with your school today.
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center space-x-2">
                  <LuCalendar className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">
                    {new Date().toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Dashboard Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 mb-8">
          {adminCards.map((card) => (
            <DashboardCard
              key={card.id}
              title={card.title}
              type={card.type}
              data={card.data}
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-700">Attendance Trends</h4>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Average Daily</span>
                  <span className="font-semibold text-green-600">94.8%</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Best Day</span>
                  <span className="font-semibold text-gray-900">
                    Monday (97.2%)
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Improvement</span>
                  <span className="font-semibold text-blue-600">+2.1%</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-gray-700">Academic Updates</h4>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">
                    Grades Submitted
                  </span>
                  <span className="font-semibold text-purple-600">89%</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">
                    Reports Generated
                  </span>
                  <span className="font-semibold text-gray-900">156</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Pending Reviews</span>
                  <span className="font-semibold text-amber-600">23</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-gray-700">System Status</h4>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Server Health</span>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span className="font-semibold text-green-600">
                      Excellent
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Last Backup</span>
                  <span className="font-semibold text-gray-900">
                    2 hours ago
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Active Users</span>
                  <span className="font-semibold text-blue-600">1,089</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
