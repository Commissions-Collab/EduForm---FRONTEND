import React, { useEffect, useState } from "react";
import { Clock } from "lucide-react";

const AttendanceSummary = ({
  attendanceRate,
  lateArrivals,
  absences,
  loading,
}) => {
  const [animatedValues, setAnimatedValues] = useState({
    attendanceRate: 0,
    lateCount: 0,
    absenceCount: 0,
  });

  useEffect(() => {
    if (!loading) {
      const animate = (start, end, key) => {
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
          setAnimatedValues((prev) => ({ ...prev, [key]: current }));
        }, duration / steps);
      };
      animate(0, attendanceRate, "attendanceRate");
      animate(0, lateArrivals.count, "lateCount");
      animate(0, absences.count, "absenceCount");
    }
  }, [loading, attendanceRate, lateArrivals.count, absences.count]);

  return (
    <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200 hover:shadow-md transition-all duration-200 animate-pop-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-blue-600 mb-1">
            Attendance Rate
          </p>
          <p className="text-xl font-bold text-blue-900 animate-count-up">
            {loading ? "..." : `${animatedValues.attendanceRate.toFixed(0)}%`}
          </p>
        </div>
        <div>
          <p className="text-sm font-medium text-blue-600 mb-1">
            Late Arrivals
          </p>
          <p className="text-xl font-bold text-blue-900 animate-count-up">
            {loading ? "..." : Math.round(animatedValues.lateCount)}
          </p>
          {lateArrivals.pattern && (
            <p className="text-sm text-gray-600 mt-1 animate-pulse">
              Most frequent: {lateArrivals.pattern}
            </p>
          )}
        </div>
        <div>
          <p className="text-sm font-medium text-blue-600 mb-1">Absences</p>
          <p className="text-xl font-bold text-blue-900 animate-count-up">
            {loading ? "..." : Math.round(animatedValues.absenceCount)}
          </p>
        </div>
        <div className="p-3 bg-blue-100 rounded-lg self-start sm:self-center">
          <Clock className="w-6 h-6 text-blue-600 animate-pulse" />
        </div>
      </div>
    </div>
  );
};

export default AttendanceSummary;
