import React, { useEffect, useState } from "react";
import { LuActivity } from "react-icons/lu";

const BmiSummary = ({ data, loading }) => {
  const latestRecord = data.length > 0 ? data[data.length - 1] : null;
  const [animatedBmi, setAnimatedBmi] = useState(0);

  useEffect(() => {
    if (!loading && latestRecord?.bmi) {
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
          setAnimatedBmi(current);
        }, duration / steps);
      };
      animate(0, latestRecord.bmi);
    }
  }, [loading, latestRecord]);

  const getCategoryStyle = (category) => {
    switch (category?.toLowerCase()) {
      case "underweight":
        return "text-yellow-800 animate-sparkle";
      case "normal":
        return "text-green-800 animate-sparkle";
      case "overweight":
      case "obese":
        return "text-red-800 animate-sparkle";
      default:
        return "text-blue-900";
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200 hover:shadow-md transition-all duration-200 animate-pop-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {loading ? (
          <div className="flex flex-col gap-2 w-full animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/2"></div>
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          </div>
        ) : !latestRecord ? (
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium text-blue-600">
              No BMI Data Available
            </p>
            <p className="text-lg text-gray-600">
              No recent BMI records found.
            </p>
          </div>
        ) : (
          <>
            <div>
              <p className="text-sm font-medium text-blue-600 mb-1">
                Latest BMI Record
              </p>
              <p
                className={`text-xl font-bold ${getCategoryStyle(
                  latestRecord.category
                )} animate-count-up`}
              >
                {animatedBmi ? animatedBmi.toFixed(1) : "N/A"} (
                {latestRecord.category || "N/A"})
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Recorded:{" "}
                {latestRecord.recorded_at
                  ? new Date(latestRecord.recorded_at).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-blue-600 mb-1">
                Height / Weight
              </p>
              <p className="text-xl font-bold text-blue-900">
                {latestRecord.height ? `${latestRecord.height} cm` : "N/A"} /{" "}
                {latestRecord.weight ? `${latestRecord.weight} kg` : "N/A"}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg self-start sm:self-center">
              <LuActivity className="w-6 h-6 text-blue-600 animate-pulse" />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BmiSummary;
