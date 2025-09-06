import React from "react";
import { LuCalendarCheck, LuCircleAlert } from "react-icons/lu";

const AttendanceQuarterlySummary = ({ quarterlySummary, loading, error }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">Quarterly Summary</h2>
        <div className="p-2 bg-gray-100 rounded-lg">
          <LuCalendarCheck className="w-5 h-5 text-gray-600" />
        </div>
      </div>
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-pulse">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      ) : error ? (
        <div className="flex flex-col items-center gap-3 py-8">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <LuCircleAlert className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <p className="font-medium text-red-900">
              Failed to load quarterly summary
            </p>
            <p className="text-sm text-red-600 mt-1">{error}</p>
          </div>
        </div>
      ) : quarterlySummary.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-8">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
            <LuCalendarCheck className="w-6 h-6 text-gray-400" />
          </div>
          <p className="text-sm text-gray-500">
            No quarterly summary available
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {quarterlySummary.map((summary, index) => (
            <div
              key={index}
              className="bg-gradient-to-r from-indigo-50 to-indigo-100 rounded-lg p-4 border border-indigo-200 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-indigo-600 mb-1">
                    {summary.quarter}
                  </p>
                  <p className="text-xl font-bold text-indigo-900">
                    {summary.attendance_rate}%
                  </p>
                </div>
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <LuCalendarCheck className="w-5 h-5 text-indigo-600" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AttendanceQuarterlySummary;
