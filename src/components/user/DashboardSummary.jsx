import React, { useEffect, useState } from "react";
import { BookOpen, Calendar, Book, TrendingUp } from "lucide-react";

const DashboardSummary = ({
  totalAverage = 0,
  gradeChangePercent = 0,
  attendanceRate = 0,
  borrowBook = 0,
  bookDueThisWeek = 0,
  loading = false,
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
        const duration = 800;
        const steps = 30;
        const increment = (end - start) / steps;
        let current = start;
        let stepCount = 0;

        const interval = setInterval(() => {
          stepCount++;
          current += increment;
          if (stepCount >= steps) {
            current = end;
            clearInterval(interval);
          }
          setAnimatedValues((prev) => ({ ...prev, [key]: current }));
        }, duration / steps);

        return () => clearInterval(interval);
      };

      animate(0, totalAverage ?? 0, "totalAverage");
      animate(0, gradeChangePercent ?? 0, "gradeChangePercent");
      animate(0, attendanceRate ?? 0, "attendanceRate");
      animate(0, borrowBook ?? 0, "borrowBook");
      animate(0, bookDueThisWeek ?? 0, "bookDueThisWeek");
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
      {/* Total Average Grade */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200 hover:shadow-md transition-all duration-200 animate-pop-in">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-blue-600 mb-1">
              Total Average Grade
            </p>
            <p className="text-2xl font-bold text-blue-900">
              {loading || !startAnimation
                ? "..."
                : (animatedValues.totalAverage ?? 0).toFixed(2)}
            </p>
          </div>
          <div className="p-3 bg-blue-100 rounded-lg">
            <BookOpen className="w-6 h-6 text-blue-600 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Grade Change */}
      <div
        className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-6 border border-green-200 hover:shadow-md transition-all duration-200 animate-pop-in"
        style={{ animationDelay: "100ms" }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-green-600 mb-1">
              Grade Change
            </p>
            <p className="text-2xl font-bold text-green-900">
              {loading || !startAnimation
                ? "..."
                : `${(animatedValues.gradeChangePercent ?? 0) > 0 ? "+" : ""}${(
                    animatedValues.gradeChangePercent ?? 0
                  ).toFixed(2)}%`}
            </p>
          </div>
          <div className="p-3 bg-green-100 rounded-lg">
            <TrendingUp className="w-6 h-6 text-green-600 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Attendance Rate */}
      <div
        className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200 hover:shadow-md transition-all duration-200 animate-pop-in"
        style={{ animationDelay: "200ms" }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-purple-600 mb-1">
              Attendance Rate
            </p>
            <p className="text-2xl font-bold text-purple-900">
              {loading || !startAnimation
                ? "..."
                : `${Math.round(animatedValues.attendanceRate ?? 0)}%`}
            </p>
          </div>
          <div className="p-3 bg-purple-100 rounded-lg">
            <Calendar className="w-6 h-6 text-purple-600 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Books Borrowed */}
      <div
        className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-xl p-6 border border-yellow-200 hover:shadow-md transition-all duration-200 animate-pop-in"
        style={{ animationDelay: "300ms" }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-yellow-600 mb-1">
              Books Borrowed
            </p>
            <p className="text-2xl font-bold text-yellow-900">
              {loading || !startAnimation
                ? "..."
                : Math.round(animatedValues.borrowBook ?? 0)}
            </p>
          </div>
          <div className="p-3 bg-yellow-100 rounded-lg">
            <Book className="w-6 h-6 text-yellow-600 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Books Due This Week */}
      <div
        className="bg-gradient-to-r from-red-50 to-red-100 rounded-xl p-6 border border-red-200 hover:shadow-md transition-all duration-200 animate-pop-in"
        style={{ animationDelay: "400ms" }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-red-600 mb-1">
              Books Due This Week
            </p>
            <p className="text-2xl font-bold text-red-900">
              {loading || !startAnimation
                ? "..."
                : Math.round(animatedValues.bookDueThisWeek ?? 0)}
            </p>
          </div>
          <div className="p-3 bg-red-100 rounded-lg">
            <Book className="w-6 h-6 text-red-600 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSummary;
