import React, { useEffect, useState } from "react";
import { Award } from "lucide-react";

const GradeSummary = ({
  quarter,
  quarterAverage,
  honorsEligibility,
  loading,
}) => {
  const [animatedAverage, setAnimatedAverage] = useState(0);

  useEffect(() => {
    if (!loading) {
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
          setAnimatedAverage(current);
        }, duration / steps);
      };
      animate(0, quarterAverage);
    }
  }, [loading, quarterAverage]);

  return (
    <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200 hover:shadow-md transition-all duration-200 animate-pop-in">
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
          <p className="text-xl font-bold text-blue-900 animate-count-up">
            {loading ? "..." : animatedAverage.toFixed(1)}
          </p>
        </div>
        <div>
          <p className="text-sm font-medium text-blue-600 mb-1">
            Honors Eligibility
          </p>
          <p
            className={`text-xl font-bold text-blue-900 ${
              honorsEligibility ? "animate-sparkle" : ""
            }`}
          >
            {loading ? "..." : honorsEligibility || "None"}
          </p>
        </div>
        <div className="p-3 bg-blue-100 rounded-lg self-start sm:self-center">
          <Award className="w-6 h-6 text-blue-600 animate-pulse" />
        </div>
      </div>
    </div>
  );
};

export default GradeSummary;
