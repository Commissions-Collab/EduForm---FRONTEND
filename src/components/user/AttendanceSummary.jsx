import React from "react";
import { LuClock, LuUserX } from "react-icons/lu";

const AttendanceSummary = ({
  attendanceRate,
  lateArrivals,
  absences,
  loading,
}) => {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200 hover:shadow-md transition-all duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-blue-600 mb-1">
            Attendance Rate
          </p>
          <p className="text-xl font-bold text-blue-900">
            {loading ? "..." : `${attendanceRate}%`}
          </p>
        </div>
        <div>
          <p className="text-sm font-medium text-blue-600 mb-1">
            Late Arrivals
          </p>
          <p className="text-xl font-bold text-blue-900">
            {loading ? "..." : lateArrivals.count}
          </p>
          {lateArrivals.pattern && (
            <p className="text-sm text-gray-600 mt-1">
              Most frequent: {lateArrivals.pattern}
            </p>
          )}
        </div>
        <div>
          <p className="text-sm font-medium text-blue-600 mb-1">Absences</p>
          <p className="text-xl font-bold text-blue-900">
            {loading ? "..." : absences.count}
          </p>
        </div>
        <div className="p-3 bg-blue-100 rounded-lg self-start sm:self-center">
          <LuClock className="w-6 h-6 text-blue-600" />
        </div>
      </div>
    </div>
  );
};

export default AttendanceSummary;
