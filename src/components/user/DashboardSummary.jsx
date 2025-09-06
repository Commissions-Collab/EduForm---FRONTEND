import React from "react";
import { LuBookOpen, LuCalendar, LuTrendingUp, LuBook } from "react-icons/lu";

const DashboardSummary = ({
  totalAverage,
  gradeChangePercent,
  attendanceRate,
  borrowBook,
  bookDueThisWeek,
  loading,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-6">
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200 hover:shadow-md transition-all duration-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-blue-600 mb-1">
              Total Average Grade
            </p>
            <p className="text-2xl font-bold text-blue-900">
              {loading ? "..." : totalAverage.toFixed(2)}
            </p>
          </div>
          <div className="p-3 bg-blue-100 rounded-lg">
            <LuBookOpen className="w-6 h-6 text-blue-600" />
          </div>
        </div>
      </div>
      <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-6 border border-green-200 hover:shadow-md transition-all duration-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-green-600 mb-1">
              Grade Change
            </p>
            <p className="text-2xl font-bold text-green-900">
              {loading
                ? "..."
                : `${gradeChangePercent > 0 ? "+" : ""}${gradeChangePercent}%`}
            </p>
          </div>
          <div className="p-3 bg-green-100 rounded-lg">
            <LuTrendingUp className="w-6 h-6 text-green-600" />
          </div>
        </div>
      </div>
      <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200 hover:shadow-md transition-all duration-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-purple-600 mb-1">
              Attendance Rate
            </p>
            <p className="text-2xl font-bold text-purple-900">
              {loading ? "..." : `${attendanceRate}%`}
            </p>
          </div>
          <div className="p-3 bg-purple-100 rounded-lg">
            <LuCalendar className="w-6 h-6 text-purple-600" />
          </div>
        </div>
      </div>
      <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-xl p-6 border border-yellow-200 hover:shadow-md transition-all duration-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-yellow-600 mb-1">
              Books Borrowed
            </p>
            <p className="text-2xl font-bold text-yellow-900">
              {loading ? "..." : borrowBook}
            </p>
          </div>
          <div className="p-3 bg-yellow-100 rounded-lg">
            <LuBook className="w-6 h-6 text-yellow-600" />
          </div>
        </div>
      </div>
      <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-xl p-6 border border-red-200 hover:shadow-md transition-all duration-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-red-600 mb-1">
              Books Due This Week
            </p>
            <p className="text-2xl font-bold text-red-900">
              {loading ? "..." : bookDueThisWeek}
            </p>
          </div>
          <div className="p-3 bg-red-100 rounded-lg">
            <LuBook className="w-6 h-6 text-red-600" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSummary;
