import React from "react";
import { LuActivity, LuCircleAlert } from "react-icons/lu";

const BmiRecords = ({ data, loading, error }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">BMI Records</h2>
        <div className="p-2 bg-gray-100 rounded-lg">
          <LuActivity className="w-5 h-5 text-gray-600" />
        </div>
      </div>
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      ) : error ? (
        <div className="flex flex-col items-center gap-3 py-8">
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
        <div className="flex flex-col items-center gap-3 py-8">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
            <LuActivity className="w-6 h-6 text-gray-400" />
          </div>
          <p className="text-sm text-gray-500">No BMI records available</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.map((record, index) => (
            <div
              key={index}
              className="bg-gradient-to-r from-indigo-50 to-indigo-100 rounded-lg p-4 border border-indigo-200 hover:shadow-md transition-all duration-200"
            >
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-indigo-600">
                    {new Date(record.recorded_at).toLocaleDateString()}
                  </p>
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <LuActivity className="w-5 h-5 text-indigo-600" />
                  </div>
                </div>
                <p className="text-xl font-bold text-indigo-900">
                  BMI: {record.bmi ? record.bmi.toFixed(1) : "N/A"} (
                  {record.category || "N/A"})
                </p>
                <p className="text-sm text-gray-600">
                  Height: {record.height ? `${record.height} cm` : "N/A"}
                </p>
                <p className="text-sm text-gray-600">
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
