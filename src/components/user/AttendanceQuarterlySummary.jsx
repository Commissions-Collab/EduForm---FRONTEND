import React, { useEffect, useState } from "react";
import { CalendarCheck, CircleAlert } from "lucide-react";

const AttendanceQuarterlySummary = ({
  quarterlySummary = [],
  loading = false,
  error = null,
}) => {
  const safeQuarterlySummary = Array.isArray(quarterlySummary)
    ? quarterlySummary
    : [];
  const [animatedRates, setAnimatedRates] = useState({});

  useEffect(() => {
    if (!loading) {
      safeQuarterlySummary.forEach((summary) => {
        if (summary.quarter_id || summary.quarter) {
          const key = summary.quarter_id || summary.quarter;
          const animate = (start, end) => {
            const duration = 1000; // 1 second
            const steps = 60; // 60 frames
            const increment = (end - start) / steps;
            let current = start;
            const interval = setInterval(() => {
              current += increment;
              if (
                (increment > 0 && current >= end) ||
                (increment < 0 && current <= end)
              ) {
                current = end;
                clearInterval(interval);
              }
              setAnimatedRates((prev) => ({ ...prev, [key]: current }));
            }, duration / steps);
            return () => clearInterval(interval);
          };
          animate(0, summary.attendance_rate ?? 0);
        }
      });
    }
  }, [loading, safeQuarterlySummary]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-slide-up">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">Quarterly Summary</h2>
        <div className="p-2 bg-gray-100 rounded-lg">
          <CalendarCheck className="w-5 h-5 text-gray-600 animate-pulse" />
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-pulse">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      ) : error ? (
        <div className="flex flex-col items-center gap-3 py-8 animate-fade-in">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <CircleAlert className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <p className="font-medium text-red-900">
              Failed to load quarterly summary
            </p>
            <p className="text-sm text-red-600 mt-1">{error}</p>
          </div>
        </div>
      ) : safeQuarterlySummary.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-8 animate-fade-in">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
            <CalendarCheck className="w-6 h-6 text-gray-400" />
          </div>
          <p className="text-sm text-gray-500">
            No quarterly summary available
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {safeQuarterlySummary.map((summary, index) => {
            const key = summary.quarter_id || summary.quarter;
            const quarterLabel =
              summary.quarter || `Quarter ${summary.quarter_id || index + 1}`;
            const rate = animatedRates[key] ?? summary.attendance_rate ?? 0;

            return (
              <div
                key={`${key}-${index}`}
                className="bg-gradient-to-r from-indigo-50 to-indigo-100 rounded-lg p-4 border border-indigo-200 hover:shadow-md transition-all duration-200 animate-pop-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-indigo-600 mb-1">
                      {quarterLabel}
                    </p>
                    <p className="text-xl font-bold text-indigo-900">
                      {rate.toFixed(0)}%
                    </p>
                  </div>
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <CalendarCheck className="w-5 h-5 text-indigo-600 animate-pulse" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AttendanceQuarterlySummary;
