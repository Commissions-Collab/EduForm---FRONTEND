import React from "react";
import { LuAward, LuBookOpen } from "react-icons/lu";

const GradeSummary = ({
  quarter,
  quarterAverage,
  honorsEligibility,
  loading,
}) => {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200 hover:shadow-md transition-all duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-blue-600 mb-1">
            Current Quarter
          </p>
          <p className="text-xl font-bold text-blue-900">
            {loading ? "..." : quarter || "N/A"}
          </p>
        </div>
        <div>
          <p className="text-sm font-medium text-blue-600 mb-1">
            Quarter Average
          </p>
          <p className="text-xl font-bold text-blue-900">
            {loading ? "..." : quarterAverage.toFixed(1)}
          </p>
        </div>
        <div>
          <p className="text-sm font-medium text-blue-600 mb-1">
            Honors Eligibility
          </p>
          <p className="text-xl font-bold text-blue-900">
            {loading ? "..." : honorsEligibility || "None"}
          </p>
        </div>
        <div className="p-3 bg-blue-100 rounded-lg self-start sm:self-center">
          <LuAward className="w-6 h-6 text-blue-600" />
        </div>
      </div>
    </div>
  );
};

export default GradeSummary;
