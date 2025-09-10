import React from "react";
import {
  LuClock,
  LuCircleAlert,
  LuCircleCheck,
  LuCircleX,
  LuSquareCheck,
} from "react-icons/lu";

const AttendanceDailyStatus = ({ dailyStatus, loading, error }) => {
  const getStatusStyle = (status) => {
    switch (status) {
      case "present":
        return "bg-green-100 text-green-800 border-green-200 animate-sparkle";
      case "late":
        return "bg-yellow-100 text-yellow-800 border-yellow-200 animate-pulse";
      case "absent":
        return "bg-red-100 text-red-800 border-red-200 animate-pulse";
      case "excused":
        return "bg-blue-100 text-blue-800 border-blue-200 animate-sparkle";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "present":
        return <LuCircleCheck className="w-5 h-5 animate-pulse" />;
      case "late":
        return <LuClock className="w-5 h-5 animate-pulse" />;
      case "absent":
        return <LuCircleX className="w-5 h-5 animate-pulse" />;
      case "excused":
        return <LuSquareCheck className="w-5 h-5 animate-pulse" />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-slide-up">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">Daily Attendance</h2>
        <div className="p-2 bg-gray-100 rounded-lg">
          <LuClock className="w-5 h-5 text-gray-600 animate-pulse" />
        </div>
      </div>
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      ) : error ? (
        <div className="flex flex-col items-center gap-3 py-8 animate-fade-in">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <LuCircleAlert className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <p className="font-medium text-red-900">
              Failed to load attendance records
            </p>
            <p className="text-sm text-red-600 mt-1">{error}</p>
          </div>
        </div>
      ) : dailyStatus.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-8 animate-fade-in">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
            <LuClock className="w-6 h-6 text-gray-400" />
          </div>
          <p className="text-sm text-gray-500">
            No attendance records available
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {dailyStatus.map((record, index) => (
            <div
              key={record.date}
              className={`rounded-lg p-4 border hover:shadow-md transition-all duration-200 animate-pop-in ${getStatusStyle(
                record.status
              )}`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">
                    {record.date} ({record.weekday})
                  </p>
                  <div className="p-2 rounded-lg bg-white bg-opacity-50">
                    {getStatusIcon(record.status)}
                  </div>
                </div>
                <p className="text-sm font-medium capitalize">
                  {record.status}
                </p>
                {record.time_in && (
                  <p className="text-sm text-gray-600">
                    Time In: {record.time_in}
                  </p>
                )}
                {record.expected_time && (
                  <p className="text-sm text-gray-600">
                    Expected: {record.expected_time}
                  </p>
                )}
                {record.remarks && (
                  <p className="text-sm text-gray-600">
                    Remarks: {record.remarks}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AttendanceDailyStatus;
