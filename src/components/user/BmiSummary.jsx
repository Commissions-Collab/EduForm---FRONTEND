import React, { useEffect, useState } from "react";
import { Scale, Info } from "lucide-react";

const BmiSummary = ({ data = [], loading = false }) => {
  const safeData = Array.isArray(data) ? data : [];
  const latestRecord =
    safeData.length > 0 ? safeData[safeData.length - 1] : null;
  const [animatedBmi, setAnimatedBmi] = useState(0);

  // Map quarter_id to quarter names
  const quarterNames = {
    1: "First Quarter",
    2: "Second Quarter",
    3: "Third Quarter",
    4: "Fourth Quarter",
  };

  useEffect(() => {
    if (!loading && latestRecord?.bmi) {
      const animate = (start, end) => {
        const duration = 1000;
        const steps = 60;
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
        return () => clearInterval(interval);
      };
      animate(0, latestRecord.bmi);
    }
  }, [loading, latestRecord?.bmi]);

  const getCategoryStyle = (category) => {
    switch (category?.toLowerCase()) {
      case "underweight":
        return "text-yellow-600";
      case "normal":
        return "text-green-900";
      case "overweight":
      case "obese":
        return "text-red-900";
      default:
        return "text-blue-900";
    }
  };

  const bmiInfo = (
    <div>
      <p className="font-semibold mb-2">BMI Categories:</p>
      <ul className="list-disc pl-4 space-y-1 text-sm">
        <li>Underweight: &lt; 18.5</li>
        <li>Normal: 18.5–24.9</li>
        <li>Overweight: 25–29.9</li>
        <li>Obese: ≥ 30</li>
      </ul>
    </div>
  );

  return (
    <div
      className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200 hover:shadow-md transition-all duration-200 animate-pop-in"
      aria-live="polite"
    >
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        {loading ? (
          <div className="flex flex-col gap-3 w-full animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/3"></div>
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        ) : !latestRecord ? (
          <div className="flex flex-col gap-2">
            <p className="text-sm font-semibold text-blue-600">
              No BMI Data Available
            </p>
            <p className="text-base text-gray-600">
              No recent BMI records found.
            </p>
          </div>
        ) : (
          <>
            <div>
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-blue-600">
                  Latest BMI Record
                </p>
                <Info
                  className="w-4 h-4 text-blue-600 cursor-pointer"
                  title={bmiInfo}
                />
              </div>
              <p
                className={`text-2xl font-bold ${getCategoryStyle(
                  latestRecord.category
                )} transition-all duration-500`}
              >
                {animatedBmi ? animatedBmi.toFixed(1) : "N/A"} (
                {latestRecord.category || "N/A"})
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Recorded:{" "}
                {latestRecord.recorded_at
                  ? new Date(latestRecord.recorded_at).toLocaleDateString(
                      "en-US",
                      { month: "long", day: "numeric", year: "numeric" }
                    )
                  : "N/A"}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Quarter:{" "}
                {latestRecord.quarter_id
                  ? quarterNames[latestRecord.quarter_id] ||
                    `Quarter ${latestRecord.quarter_id}`
                  : "N/A"}
              </p>
            </div>

            <div>
              <p className="text-sm font-semibold text-blue-600 mb-1">
                Height / Weight
              </p>
              <p className="text-xl font-bold text-blue-900">
                {latestRecord.height ? `${latestRecord.height} cm` : "N/A"} /{" "}
                {latestRecord.weight ? `${latestRecord.weight} kg` : "N/A"}
              </p>
              {latestRecord.remarks && (
                <p className="text-sm text-gray-600 mt-1 max-w-xs truncate">
                  Remarks: {latestRecord.remarks}
                </p>
              )}
            </div>

            <div className="p-3 bg-blue-100 rounded-lg self-start sm:self-center">
              <Scale className="w-6 h-6 text-blue-600 animate-pulse" />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BmiSummary;
