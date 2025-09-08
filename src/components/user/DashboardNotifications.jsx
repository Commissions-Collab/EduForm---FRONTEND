import React from "react";
import { LuBell, LuCircleAlert, LuCalendarX } from "react-icons/lu";
import { format } from "date-fns";

const DashboardNotifications = ({
  notifications,
  recentAbsents,
  loading,
  error,
}) => {
  const getNotificationStyle = (notification) => {
    if (notification.includes("overdue")) {
      return "bg-red-100 text-red-800 border-red-200 animate-sparkle";
    } else if (notification.includes("due in")) {
      return "bg-yellow-100 text-yellow-800 border-yellow-200 animate-pulse";
    } else if (notification.includes("Honors")) {
      return "bg-green-100 text-green-800 border-green-200 animate-sparkle";
    } else {
      return "bg-blue-100 text-blue-800 border-blue-200 animate-pop-in";
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-slide-up">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">Notifications</h2>
        <div className="p-2 bg-gray-100 rounded-lg">
          <LuBell className="w-5 h-5 text-gray-600 animate-pulse" />
        </div>
      </div>
      {loading ? (
        <div className="animate-pulse space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-6 bg-gray-200 rounded"></div>
          ))}
        </div>
      ) : error ? (
        <div className="flex flex-col items-center gap-3 py-8 animate-fade-in">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <LuCircleAlert className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <p className="font-medium text-red-900">
              Failed to load notifications
            </p>
            <p className="text-sm text-red-600 mt-1">{error}</p>
          </div>
        </div>
      ) : notifications.length === 0 && recentAbsents.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-8 animate-fade-in">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
            <LuBell className="w-6 h-6 text-gray-400" />
          </div>
          <p className="text-sm text-gray-500">No notifications available</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {notifications.map((notification, index) => (
            <li
              key={`notification-${index}`}
              className={`p-3 rounded-lg border text-sm font-medium ${getNotificationStyle(
                notification
              )}`}
            >
              {notification}
            </li>
          ))}
          {recentAbsents.map((absence, index) => (
            <li
              key={`absence-${index}`}
              className="p-3 rounded-lg border text-sm font-medium bg-red-100 text-red-800 border-red-200 animate-pop-in"
            >
              <div className="flex items-center gap-2">
                <LuCalendarX className="w-4 h-4" />
                Absent on{" "}
                {format(new Date(absence.attendance_date), "MMMM d, yyyy")}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DashboardNotifications;
