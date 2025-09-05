import React, { useEffect } from "react";
import { LuHeart, LuBadgeAlert, LuCalendar } from "react-icons/lu";
import useHealthProfileStore from "../../stores/users/healthProfileStore";

const HealthProfile = () => {
  const { bmiData, fetchBmiData } = useHealthProfileStore();

  useEffect(() => {
    fetchBmiData();
  }, [fetchBmiData]);

  const getBmiCategory = (bmi) => {
    if (!bmi) return "N/A";
    if (bmi < 18.5) return "Underweight";
    if (bmi >= 18.5 && bmi < 25) return "Normal";
    if (bmi >= 25 && bmi < 30) return "Overweight";
    return "Obese";
  };

  const latestRecord = bmiData.data.length > 0 ? bmiData.data[0] : null;
  const historicalRecords = bmiData.data.slice(1);

  return (
    <main className="p-4 lg:p-8 min-h-screen relative overflow-hidden">
      {/* Header Section */}
      <div className="relative z-10 mb-8 animate-fade-in">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 bg-white bg-opacity-80 backdrop-blur-sm rounded-xl p-6 shadow-sm">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              My Health Profile
            </h1>
            <p className="text-sm text-gray-600 mt-2">
              View your BMI and health metrics
            </p>
          </div>
        </div>
      </div>

      {/* Summary Banner */}
      {latestRecord && (
        <div className="relative z-10 bg-white bg-opacity-80 backdrop-blur-sm rounded-xl p-6 mb-8 flex flex-col sm:flex-row sm:items-center gap-6 shadow-lg animate-slide-up">
          <div className="flex-1">
            <p className="text-sm font-medium text-blue-600 mb-1">
              Current BMI
            </p>
            <p className="text-3xl font-bold text-blue-900 animate-count-up">
              {bmiData.isLoading ? "..." : latestRecord.bmi || "-"}
            </p>
            <span
              className={`inline-flex items-center px-3 py-1 mt-2 text-sm font-medium rounded-full ${
                getBmiCategory(latestRecord.bmi) === "Normal"
                  ? "bg-green-100 text-green-800"
                  : getBmiCategory(latestRecord.bmi) === "Underweight"
                  ? "bg-blue-100 text-blue-800"
                  : getBmiCategory(latestRecord.bmi) === "Overweight"
                  ? "bg-yellow-100 text-yellow-800"
                  : getBmiCategory(latestRecord.bmi) === "Obese"
                  ? "bg-red-100 text-red-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {getBmiCategory(latestRecord.bmi)}
            </span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-blue-600 mb-1">Height</p>
            <p className="text-3xl font-bold text-blue-900 animate-count-up">
              {bmiData.isLoading ? "..." : `${latestRecord.height || "-"} cm`}
            </p>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-blue-600 mb-1">Weight</p>
            <p className="text-3xl font-bold text-blue-900 animate-count-up">
              {bmiData.isLoading ? "..." : `${latestRecord.weight || "-"} kg`}
            </p>
          </div>
          <div className="p-3 bg-blue-100 rounded-full">
            <LuHeart className="w-8 h-8 text-blue-600" />
          </div>
        </div>
      )}

      {/* Error or No Data */}
      {bmiData.error ? (
        <div className="relative z-10 text-center py-16">
          <div className="flex flex-col items-center gap-4 animate-fade-in">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <LuBadgeAlert className="w-8 h-8 text-red-600" />
            </div>
            <div>
              <p className="font-medium text-red-900 text-lg">
                Failed to load health profile
              </p>
              <p className="text-sm text-red-600 mt-2">{bmiData.error}</p>
              <button
                onClick={fetchBmiData}
                disabled={bmiData.isLoading}
                className="mt-4 px-4 py-2 text-sm bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed transition-all duration-200"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      ) : !latestRecord && !bmiData.isLoading ? (
        <div className="relative z-10 text-center py-16">
          <div className="flex flex-col items-center gap-4 animate-fade-in">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
              <LuHeart className="w-8 h-8 text-gray-400" />
            </div>
            <div>
              <p className="font-medium text-gray-900 text-lg">
                No health profile available
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Contact your school administrator for assistance
              </p>
            </div>
          </div>
        </div>
      ) : null}

      {/* Health Records Timeline */}
      {historicalRecords.length > 0 && (
        <div className="relative z-10">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Your Health Journey
          </h2>
          <div className="relative space-y-8 lg:space-y-12">
            {/* Timeline Line */}
            <div className="absolute left-4 lg:left-8 top-0 h-full w-1 bg-blue-300 rounded-full"></div>
            {historicalRecords.map((record, index) => (
              <div
                key={record.id}
                className="relative pl-12 lg:pl-16 transform transition-all duration-300 hover:scale-105 animate-slide-up"
              >
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white">
                  <LuCalendar className="w-5 h-5" />
                </div>
                <div className="bg-white bg-opacity-80 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-blue-200 hover:shadow-blue-100/50">
                  <p className="text-lg font-semibold text-gray-900">
                    BMI: {record.bmi || "-"}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Measured:{" "}
                    {record.measurement_date
                      ? new Date(record.measurement_date).toLocaleDateString()
                      : "-"}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Height: {record.height || "-"} cm
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Weight: {record.weight || "-"} kg
                  </p>
                  <span
                    className={`inline-flex items-center px-3 py-1 mt-3 text-sm font-medium rounded-full ${
                      getBmiCategory(record.bmi) === "Normal"
                        ? "bg-green-100 text-green-800"
                        : getBmiCategory(record.bmi) === "Underweight"
                        ? "bg-blue-100 text-blue-800"
                        : getBmiCategory(record.bmi) === "Overweight"
                        ? "bg-yellow-100 text-yellow-800"
                        : getBmiCategory(record.bmi) === "Obese"
                        ? "bg-red-100 text-red-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {getBmiCategory(record.bmi)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
};

export default HealthProfile;
