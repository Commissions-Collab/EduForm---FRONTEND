import React, { useEffect, useState } from "react";
import {
  LuBookOpen,
  LuCalendarCheck,
  LuBell,
  LuCircleAlert,
} from "react-icons/lu";
import useStudentDashboardStore from "../../stores/users/studentDashboardStore";

const Dashboard = () => {
  const { dashboard, fetchDashboard, loading, error } =
    useStudentDashboardStore();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const filteredNotifications = dashboard.data.notifications.filter(
    (notification) =>
      notification.message?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="  p-4 lg:p-8 min-h-screen relative overflow-hidden">
      {/* Header Section */}
      <div className="relative z-10 mb-8 animate-fade-in">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 bg-white bg-opacity-80 backdrop-blur-sm rounded-xl p-6 shadow-sm">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              Dashboard
            </h1>
            <p className="text-sm text-gray-600 mt-2">
              Track your academic journey with ease
            </p>
          </div>
        </div>
      </div>

      {/* Main Dashboard Content */}
      {loading ? (
        <div className="relative z-10 flex flex-col lg:flex-row gap-6 animate-pulse">
          {/* Grades Placeholder */}
          <div className="flex-1 bg-white rounded-full p-8 shadow-lg">
            <div className="w-48 h-48 mx-auto bg-gray-200 rounded-full"></div>
            <div className="w-3/4 h-6 bg-gray-200 rounded mx-auto mt-4"></div>
          </div>
          {/* Attendance and Books Placeholder */}
          <div className="flex-1 space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <div className="w-3/4 h-4 bg-gray-200 rounded mb-2"></div>
              <div className="w-full h-8 bg-gray-200 rounded"></div>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <div className="w-3/4 h-4 bg-gray-200 rounded mb-2"></div>
              <div className="w-1/2 h-8 bg-gray-200 rounded"></div>
            </div>
          </div>
          {/* Notifications Placeholder */}
          <div className="w-full lg:w-1/3 space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="w-3/4 h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="w-1/2 h-3 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : error ? (
        <div className="relative z-10 text-center py-16">
          <div className="flex flex-col items-center gap-4 animate-fade-in">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <LuCircleAlert className="w-8 h-8 text-red-600" />
            </div>
            <div>
              <p className="font-medium text-red-900 text-lg">
                Failed to load dashboard
              </p>
              <p className="text-sm text-red-600 mt-2">{error}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative z-10 flex flex-col lg:flex-row gap-6">
          {/* Grades Section (Circular Progress) */}
          <div className="flex-1 bg-white rounded-lg p-8 shadow-lg transform transition-all duration-300 hover:scale-105 animate-slide-up">
            <div className="relative w-48 h-48 mx-auto">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle
                  className="text-gray-200"
                  strokeWidth="8"
                  stroke="currentColor"
                  fill="transparent"
                  r="42"
                  cx="50"
                  cy="50"
                />
                <circle
                  className="text-blue-600"
                  strokeWidth="8"
                  stroke="currentColor"
                  fill="transparent"
                  r="42"
                  cx="50"
                  cy="50"
                  strokeDasharray={`${(dashboard.data.grades || 0) * 2.64} 264`}
                  strokeDashoffset="0"
                  transform="rotate(-90 50 50)"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-3xl font-bold text-blue-900 animate-count-up">
                  {dashboard.data.grades || 0}
                </p>
              </div>
            </div>
            <div className="text-center mt-4">
              <p className="text-sm font-medium text-blue-600">Current Grade</p>
              <p
                className={`text-sm font-medium mt-2 ${
                  dashboard.data.grade_change_percent >= 0
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {dashboard.data.grade_change_percent >= 0 ? "+" : ""}
                {dashboard.data.grade_change_percent}% from last
              </p>
            </div>
          </div>

          {/* Attendance and Books Section */}
          <div className="flex-1 space-y-6">
            {/* Attendance Section (Progress Bar) */}
            <div className="bg-white rounded-lg p-6 shadow-lg transform transition-all duration-300 hover:scale-105 animate-slide-up">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <LuCalendarCheck className="w-6 h-6 text-green-600" />
                </div>
                <p className="text-sm font-medium text-green-600">
                  Attendance Rate
                </p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                <div
                  className="bg-green-600 h-full rounded-full transition-all duration-1000"
                  style={{
                    width: `${
                      dashboard.data.attendance_rate.present_percent || 0
                    }%`,
                  }}
                ></div>
              </div>
              <p className="text-2xl font-bold text-green-900 mt-2 animate-count-up">
                {dashboard.data.attendance_rate.present_percent || 0}%
              </p>
              {dashboard.data.attendance_rate.recent_absents.length > 0 && (
                <p className="text-xs text-gray-500 mt-2">
                  {dashboard.data.attendance_rate.recent_absents.length} recent
                  absence
                  {dashboard.data.attendance_rate.recent_absents.length !== 1
                    ? "s"
                    : ""}
                </p>
              )}
            </div>

            {/* Library Books Section (Book Stack) */}
            <div className="bg-white rounded-lg p-6 shadow-lg transform transition-all duration-300 hover:scale-105 animate-slide-up">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <LuBookOpen className="w-6 h-6 text-purple-600" />
                </div>
                <p className="text-sm font-medium text-purple-600">
                  Library Books
                </p>
              </div>
              <div className="flex items-end gap-2">
                {Array.from({
                  length: Math.min(dashboard.data.borrow_book || 0, 5),
                }).map((_, i) => (
                  <div
                    key={i}
                    className="w-8 h-16 bg-purple-200 rounded-sm transform transition-all duration-300 hover:bg-purple-300"
                    style={{ transform: `translateY(${i * 2}px)` }}
                  ></div>
                ))}
                {(dashboard.data.borrow_book || 0) > 5 && (
                  <p className="text-sm text-purple-600">
                    +{dashboard.data.borrow_book - 5}
                  </p>
                )}
              </div>
              <p className="text-2xl font-bold text-purple-900 mt-2 animate-count-up">
                {dashboard.data.borrow_book || 0} borrowed
              </p>
              {dashboard.data.book_due_this_week > 0 && (
                <p className="text-xs text-red-600 mt-2">
                  {dashboard.data.book_due_this_week} due this week
                </p>
              )}
            </div>
          </div>

          {/* Notifications Timeline */}
          <div className="w-full lg:w-1/3 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Notifications</h2>
              {!loading && (
                <div className="text-sm text-gray-500">
                  {filteredNotifications.length}{" "}
                  {filteredNotifications.length === 1
                    ? "notification"
                    : "notifications"}{" "}
                  found
                  {searchTerm && (
                    <span className="ml-1">
                      for "
                      <span className="font-medium text-gray-700">
                        {searchTerm}
                      </span>
                      "
                    </span>
                  )}
                </div>
              )}
            </div>
            {filteredNotifications.length === 0 && !loading ? (
              <div className="bg-gray-50 rounded-lg p-6 text-center">
                <div className="flex flex-col items-center gap-4 animate-fade-in">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                    <LuBell className="w-6 h-6 text-gray-400" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      No notifications
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {searchTerm
                        ? "Try adjusting your search criteria"
                        : "You're all caught up!"}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              filteredNotifications.map((notification, index) => (
                <div
                  key={index}
                  className="relative bg-gray-50 rounded-lg p-4 transform transition-all duration-200 hover:bg-gray-100 animate-slide-up"
                >
                  <div className="absolute left-0 top-0 h-full w-1 bg-blue-600 rounded-l-lg"></div>
                  <div className="flex items-start gap-4 pl-4">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <LuBell className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {notification.date || "No date"}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </main>
  );
};

export default Dashboard;
