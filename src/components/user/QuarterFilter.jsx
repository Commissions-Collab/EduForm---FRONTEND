import React from "react";
import { LuCalendar } from "react-icons/lu";

const QuarterFilter = ({
  quarters,
  selectedQuarter,
  setSelectedQuarter,
  loading,
  error,
}) => {
  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3">
        <LuCalendar className="w-5 h-5 text-gray-400" />
      </div>
      {loading ? (
        <div className="w-48 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
      ) : error ? (
        <div className="w-48 text-sm text-red-600 font-medium">
          Failed to load quarters
        </div>
      ) : quarters.length === 0 ? (
        <div className="w-48 text-sm text-gray-500">No quarters available</div>
      ) : (
        <select
          value={selectedQuarter || ""}
          onChange={(e) => setSelectedQuarter(e.target.value || null)}
          className="w-48 pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="">Select Quarter</option>
          {quarters.map((quarter) => (
            <option key={quarter.id} value={quarter.id}>
              {quarter.name}
            </option>
          ))}
        </select>
      )}
    </div>
  );
};

export default QuarterFilter;
