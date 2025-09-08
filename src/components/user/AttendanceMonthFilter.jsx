import React, { memo } from "react";
import { LuCalendar, LuCircleAlert } from "react-icons/lu";

const AttendanceMonthFilter = ({
  months,
  selectedMonth,
  setSelectedMonth,
  loading,
  error,
}) => {
  return (
    <div className="relative animate-slide-in">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3">
        <LuCalendar className="w-5 h-5 text-gray-400 animate-pulse" />
      </div>
      {loading ? (
        <div className="w-48 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
      ) : error ? (
        <div className="w-48 text-sm text-red-600 font-medium animate-fade-in">
          Failed to load months
        </div>
      ) : months.length === 0 ? (
        <div className="w-48 text-sm text-gray-500 animate-fade-in">
          No months available
        </div>
      ) : (
        <select
          value={selectedMonth || ""}
          onChange={(e) => setSelectedMonth(e.target.value || null)}
          className="w-48 pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 animate-focus-glow"
        >
          <option value="">Select Month</option>
          {months.map((month) => (
            <option key={month.value} value={month.value}>
              {month.label}
            </option>
          ))}
        </select>
      )}
    </div>
  );
};

export default memo(AttendanceMonthFilter);
