import React from "react";
import { LuCalendar, LuCircleAlert } from "react-icons/lu";

const QuarterFilter = ({
  quarters,
  selectedQuarter,
  setSelectedQuarter,
  loading,
  error,
}) => {
  return (
    <div className="relative animate-slide-in">
      {loading ? (
        <div className="animate-pulse h-10 w-48 bg-gray-200 rounded-lg"></div>
      ) : error ? (
        <div className="flex items-center gap-2 text-red-600">
          <LuCircleAlert className="w-5 h-5" />
          <p className="text-sm font-medium">Failed to load quarters</p>
        </div>
      ) : quarters.length === 0 ? (
        <p className="text-sm text-gray-500">No quarters available</p>
      ) : (
        <div className="relative">
          <LuCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <select
            value={selectedQuarter || ""}
            onChange={(e) => setSelectedQuarter(e.target.value || null)}
            className="pl-10 pr-4 py-2 w-48 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 animate-focus-glow"
          >
            <option value="">Select Quarter</option>
            {quarters.map((quarter) => (
              <option key={quarter.id} value={quarter.id}>
                {quarter.name}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

export default QuarterFilter;
