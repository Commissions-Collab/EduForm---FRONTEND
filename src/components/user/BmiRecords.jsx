import React from "react";
import { LuActivity, LuCircleAlert } from "react-icons/lu";

const BmiRecords = ({ data, loading, error }) => {
  const getCategoryStyle = (category) => {
    switch (category?.toLowerCase()) {
      case "underweight":
        return "bg-yellow-100 text-yellow-800 border-yellow-200 animate-sparkle";
      case "normal":
        return "bg-green-100 text-green-800 border-green-200 animate-sparkle";
      case "overweight":
      case "obese":
        return "bg-red-100 text-red-800 border-red-200 animate-sparkle";
      default:
        return "bg-indigo-100 text-indigo-800 border-indigo-200";
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-slide-up">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">BMI Records</h2>
        <div className="p-2 bg-gray-100 rounded-lg">
          <LuActivity className="w-5 h-5 text-gray-600 animate-pulse" />
        </div>
      </div>
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
          {Array.from({ length: 3 }).map((_, i) => (
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
              Failed to load BMI records
            </p>
            <p className="text-sm text-red-600 mt-1">{error}</p>
          </div>
        </div>
      ) : data.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-8 animate-fade-in">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
            <LuActivity className="w-6 h-6 text-gray-400" />
          </div>
          <p className="text-sm text-gray-500">No BMI records available</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.map((record, index) => (
            <div
              key={record.id || `${record.recorded_at}-${index}`}
              className={`rounded-lg p-4 border hover:shadow-md transition-all duration-200 animate-pop-in ${getCategoryStyle(
                record.category
              )}`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">
                    {record.recorded_at
                      ? new Date(record.recorded_at).toLocaleDateString()
                      : "N/A"}
                  </p>
                  <div className="p-2 bg-opacity-50 rounded-lg">
                    <LuActivity className="w-5 h-5 animate-pulse" />
                  </div>
                </div>
                <p className="text-xl font-bold animate-count-up">
                  BMI: {record.bmi ? record.bmi.toFixed(1) : "N/A"} (
                  {record.category || "N/A"})
                </p>
                <p className="text-sm">
                  Height: {record.height ? `${record.height} cm` : "N/A"}
                </p>
                <p className="text-sm">
                  Weight: {record.weight ? `${record.weight} kg` : "N/A"}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BmiRecords;
