import React from "react";
import { BookOpen, TrendingUp, TrendingDown, CircleAlert } from "lucide-react";

const GradeList = ({ grades = [], loading = false, error = null }) => {
  // Safe data access
  const safeGrades = Array.isArray(grades) ? grades : [];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-slide-up">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">Subject Grades</h2>
        <div className="p-2 bg-gray-100 rounded-lg">
          <BookOpen className="w-5 h-5 text-gray-600 animate-pulse" />
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
            <CircleAlert className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <p className="font-medium text-red-900">Failed to load grades</p>
            <p className="text-sm text-red-600 mt-1">{error}</p>
          </div>
        </div>
      ) : safeGrades.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-8 animate-fade-in">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-gray-400" />
          </div>
          <p className="text-sm text-gray-500">No grades available</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {safeGrades.map((grade, index) => {
            const trend = grade.trend ?? 0;
            const gradeValue = grade.grade ?? 0;
            const subject = grade.subject ?? "Unknown Subject";
            const classAverage = grade.class_average ?? "N/A";
            const teacher = grade.teacher ?? "N/A";

            return (
              <div
                key={`grade-${subject}-${index}`}
                className={`bg-gradient-to-r from-indigo-50 to-indigo-100 rounded-lg p-4 border border-indigo-200 hover:shadow-md transition-all duration-200 animate-pop-in ${
                  trend > 10 ? "animate-sparkle" : ""
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex flex-col gap-2">
                  {/* Subject Header */}
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-indigo-600">
                      {subject}
                    </p>
                    <div className="p-2 bg-indigo-100 rounded-lg">
                      <BookOpen className="w-5 h-5 text-indigo-600 animate-pulse" />
                    </div>
                  </div>

                  {/* Grade Score */}
                  <p className="text-xl font-bold text-indigo-900">
                    {typeof gradeValue === "number"
                      ? gradeValue.toFixed(2)
                      : gradeValue}
                  </p>

                  {/* Class Average & Trend */}
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-gray-600">
                      Class Avg: {classAverage}
                    </p>
                    {trend !== 0 && (
                      <span
                        className={`text-sm flex items-center gap-1 ${
                          trend > 0 ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {trend > 0 ? (
                          <TrendingUp className="w-4 h-4" />
                        ) : (
                          <TrendingDown className="w-4 h-4" />
                        )}
                        {Math.abs(trend)}%
                      </span>
                    )}
                  </div>

                  {/* Teacher */}
                  <p className="text-sm text-gray-500">Teacher: {teacher}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default GradeList;
