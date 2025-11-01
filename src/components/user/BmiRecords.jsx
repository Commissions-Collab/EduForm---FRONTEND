import React, { useState } from "react";
import { Scale, CircleAlert, ChevronDown, ChevronUp } from "lucide-react";

const BmiRecords = ({ data = [], loading = false, error = null }) => {
  const safeData = Array.isArray(data) ? data : [];
  const [sortOrder, setSortOrder] = useState("desc"); // Newest first
  const [expandedRemarks, setExpandedRemarks] = useState({});

  const quarterNames = {
    1: "First Quarter",
    2: "Second Quarter",
    3: "Third Quarter",
    4: "Fourth Quarter",
  };

  const getCategoryStyle = (category) => {
    switch (category?.toLowerCase()) {
      case "underweight":
        return "bg-yellow-50 text-yellow-900 border-yellow-200 hover:bg-yellow-100";
      case "normal":
        return "bg-green-50 text-green-900 border-green-200 hover:bg-green-100";
      case "overweight":
      case "obese":
        return "bg-red-50 text-red-900 border-red-200 hover:bg-red-100";
      default:
        return "bg-indigo-50 text-indigo-900 border-indigo-200 hover:bg-indigo-100";
    }
  };

  const sortedData = [...safeData].sort((a, b) => {
    const dateA = new Date(a.recorded_at || 0);
    const dateB = new Date(b.recorded_at || 0);
    return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
  });

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "desc" ? "asc" : "desc");
  };

  const toggleRemarks = (id) => {
    setExpandedRemarks((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div
      className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 animate-slide-up"
      aria-live="polite"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">BMI Records</h2>
        <div className="flex items-center gap-4">
          <button
            onClick={toggleSortOrder}
            className="flex items-center gap-1 text-sm font-medium text-blue-700 hover:text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md px-2 py-1"
            aria-label={`Sort by date ${
              sortOrder === "desc" ? "ascending" : "descending"
            }`}
          >
            Sort: {sortOrder === "desc" ? "Newest" : "Oldest"}
            {sortOrder === "desc" ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronUp className="w-4 h-4" />
            )}
          </button>
          <div className="p-2 bg-blue-100 rounded-lg">
            <Scale className="w-5 h-5 text-blue-600 animate-pulse" />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-40 bg-gray-100 rounded-lg border border-gray-200 p-4"
            >
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="flex flex-col items-center gap-3 py-8 animate-fade-in">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <CircleAlert className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <p className="font-semibold text-red-900">
              Failed to load BMI records
            </p>
            <p className="text-sm text-red-600 mt-1">{error}</p>
          </div>
        </div>
      ) : safeData.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-8 animate-fade-in">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
            <Scale className="w-6 h-6 text-gray-400" />
          </div>
          <p className="text-sm text-gray-500">No BMI records available</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedData.map((record, index) => {
            const recordDate = record.recorded_at
              ? new Date(record.recorded_at).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })
              : "N/A";

            return (
              <div
                key={record.id || index}
                className={`rounded-lg p-4 border shadow-sm hover:shadow-md transition-all duration-200 ${getCategoryStyle(
                  record.category
                )}`}
                style={{ animationDelay: `${index * 100}ms` }}
                role="article"
                aria-label={`BMI record for ${recordDate}`}
              >
                <div className="flex flex-col gap-2">
                  {/* Date Header */}
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold">{recordDate}</p>
                    <div className="p-2 bg-white bg-opacity-50 rounded-lg">
                      <Scale className="w-5 h-5 animate-pulse" />
                    </div>
                  </div>

                  {/* BMI Value & Category */}
                  <p className="text-xl font-bold">
                    BMI: {record.bmi ? record.bmi.toFixed(1) : "N/A"} (
                    {record.category || "N/A"})
                  </p>

                  {/* Height & Weight */}
                  <p className="text-sm">
                    Height: {record.height ? `${record.height} cm` : "N/A"}
                  </p>
                  <p className="text-sm">
                    Weight: {record.weight ? `${record.weight} kg` : "N/A"}
                  </p>

                  {/* Quarter */}
                  <p className="text-sm">
                    Quarter:{" "}
                    {record.quarter_id
                      ? quarterNames[record.quarter_id] ||
                        `Quarter ${record.quarter_id}`
                      : "N/A"}
                  </p>

                  {/* Remarks Toggle */}
                  {record.remarks && (
                    <div className="text-sm">
                      <button
                        onClick={() => toggleRemarks(record.id || index)}
                        className="flex items-center gap-1 text-blue-700 hover:text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        aria-expanded={!!expandedRemarks[record.id || index]}
                        aria-label={`Toggle remarks for record on ${recordDate}`}
                      >
                        Remarks
                        {expandedRemarks[record.id || index] ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </button>
                      {expandedRemarks[record.id || index] && (
                        <p className="mt-1">{record.remarks}</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BmiRecords;
