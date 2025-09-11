import React, { useEffect, useState } from "react";
import { LuBookOpen, LuCalendar, LuTrendingUp, LuBook } from "react-icons/lu";

const DashboardSummary = ({
  totalAverage,
  gradeChangePercent,
  attendanceRate,
  borrowBook,
  bookDueThisWeek,
  loading,
}) => {
  const [animatedValues, setAnimatedValues] = useState({
    totalAverage: 0,
    gradeChangePercent: 0,
    attendanceRate: 0,
    borrowBook: 0,
    bookDueThisWeek: 0,
  });
  const [startAnimation, setStartAnimation] = useState(false);

  useEffect(() => {
    if (!loading) {
      // Delay animation start to avoid flashing zeros
      const delay = setTimeout(() => {
        setStartAnimation(true);
      }, 100);

      return () => clearTimeout(delay);
    }
  }, [loading]);

  useEffect(() => {
    if (!loading && startAnimation) {
      const animate = (start, end, key) => {
        const duration = 800; // Reduced to 0.8 seconds for smoother feel
        const steps = 30; // Fewer steps for less jitter
        const increment = (end - start) / steps;
        let current = start;
        let stepCount = 0;

        const interval = setInterval(() => {
          stepCount++;
          current += increment;
          if (stepCount >= steps) {
            current = end; // Snap to final value
            clearInterval(interval);
          }
          setAnimatedValues((prev) => ({ ...prev, [key]: current }));
        }, duration / steps);
      };

      animate(0, totalAverage, "totalAverage");
      animate(0, gradeChangePercent, "gradeChangePercent");
      animate(0, attendanceRate, "attendanceRate");
      animate(0, borrowBook, "borrowBook");
      animate(0, bookDueThisWeek, "bookDueThisWeek");
    }
  }, [
    loading,
    startAnimation,
    totalAverage,
    gradeChangePercent,
    attendanceRate,
    borrowBook,
    bookDueThisWeek,
  ]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-6 animate-slide-up">
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200 hover:shadow-md transition-all duration-200 animate-pop-in">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-blue-600 mb-1">
              Total Average Grade
            </p>
            <p className="text-2xl font-bold text-blue-900 animate-count-up">
              {loading || !startAnimation
                ? "..."
                : animatedValues.totalAverage.toFixed(2)}
            </p>
          </div>
          <div className="p-3 bg-blue-100 rounded-lg">
            <LuBookOpen className="w-6 h-6 text-blue-600 animate-pulse" />
          </div>
        </div>
      </div>
      <div
        className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-6 border border-green-200 hover:shadow-md transition-all duration-200 animate-pop-in"
        style={{ animationDelay: "100ms" }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-green-600 mb-1">
              Grade Change
            </p>
            <p className="text-2xl font-bold text-green-900 animate-count-up">
              {loading || !startAnimation
                ? "..."
                : `${
                    animatedValues.gradeChangePercent > 0 ? "+" : ""
                  }${animatedValues.gradeChangePercent.toFixed(2)}%`}
            </p>
          </div>
          <div className="p-3 bg-green-100 rounded-lg">
            <LuTrendingUp className="w-6 h-6 text-green-600 animate-pulse" />
          </div>
        </div>
      </div>
      <div
        className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200 hover:shadow-md transition-all duration-200 animate-pop-in"
        style={{ animationDelay: "200ms" }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-purple-600 mb-1">
              Attendance Rate
            </p>
            <p className="text-2xl font-bold text-purple-900 animate-count-up">
              {loading || !startAnimation
                ? "..."
                : `${animatedValues.attendanceRate.toFixed(0)}%`}
            </p>
          </div>
          <div className="p-3 bg-purple-100 rounded-lg">
            <LuCalendar className="w-6 h-6 text-purple-600 animate-pulse" />
          </div>
        </div>
      </div>
      <div
        className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-xl p-6 border border-yellow-200 hover:shadow-md transition-all duration-200 animate-pop-in"
        style={{ animationDelay: "300ms" }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-yellow-600 mb-1">
              Books Borrowed
            </p>
            <p className="text-2xl font-bold text-yellow-900 animate-count-up">
              {loading || !startAnimation
                ? "..."
                : Math.round(animatedValues.borrowBook)}
            </p>
          </div>
          <div className="p-3 bg-yellow-100 rounded-lg">
            <LuBook className="w-6 h-6 text-yellow-600 animate-pulse" />
          </div>
        </div>
      </div>
      <div
        className="bg-gradient-to-r from-red-50 to-red-100 rounded-xl p-6 border border-red-200 hover:shadow-md transition-all duration-200 animate-pop-in"
        style={{ animationDelay: "400ms" }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-red-600 mb-1">
              Books Due This Week
            </p>
            <p className="text-2xl font-bold text-red-900 animate-count-up">
              {loading || !startAnimation
                ? "..."
                : Math.round(animatedValues.bookDueThisWeek)}
            </p>
          </div>
          <div className="p-3 bg-red-100 rounded-lg">
            <LuBook className="w-6 h-6 text-red-600 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSummary;
