import React from "react";
import StatusBadge from "./StatusBadge";
import PaginationControls from "./Pagination";
import { ClipLoader } from "react-spinners";
import { LuBadgeAlert, LuLoader, LuTrendingUp, LuUser } from "react-icons/lu";
import { useAdminStore } from "../../stores/useAdminStore";

const PromotionTable = () => {
  const {
    promotionStudents,
    promotionCurrentPage,
    setPromotionCurrentPage,
    totalPromotionPages,
    paginatedPromotionRecords,
    loading,
    error,
  } = useAdminStore();

  const records = paginatedPromotionRecords();
  const pages = totalPromotionPages();
  const hasRecords = Array.isArray(records) && records.length > 0;

  // Loading State
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden mt-6">
        <div className="px-4 sm:px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-900">
            Promotion Records
          </h3>
        </div>
        <div className="py-20">
          <div className="flex flex-col items-center space-y-3">
            <LuLoader className="w-6 h-6 text-blue-700 animate-spin" />
            <p className="text-gray-500 text-sm">
              Loading promotion records...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden mt-6">
        <div className="px-4 sm:px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-900">
            Promotion Records
          </h3>
        </div>
        <div className="py-20">
          <div className="flex flex-col items-center space-y-3">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <div className="text-center">
              <h3 className="text-red-900 font-medium">
                Error Loading Records
              </h3>
              <p className="text-red-600 text-sm mt-1">
                Failed to fetch promotion data. Please try again.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // No Records State
  if (!hasRecords) {
    return (
      <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl border-2 border-amber-200 p-6 shadow-lg mt-6">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
              <LuBadgeAlert className="w-6 h-6 text-amber-600" />
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-amber-800 mb-2">
              Promotion Report Not Available
            </h3>
            <p className="text-amber-700 mb-4">
              Promotion data may not be accessible due to the following reasons:
            </p>
            <div className="bg-white/60 rounded-lg p-4 space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                <span className="text-sm text-amber-700">
                  Some students have incomplete grades or attendance records
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                <span className="text-sm text-amber-700">
                  The grading or attendance period has not yet ended
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                <span className="text-sm text-amber-700">
                  Final calculations are still being processed
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 mt-6">
      {/* Main Table Card */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="px-4 sm:px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Promotion Records
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Student promotion status based on final grades and attendance
              </p>
            </div>
            <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              {records.length} students
            </div>
          </div>
        </div>

        {/* Desktop Table View (hidden on mobile) */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Student Name
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Grade Average
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Attendance %
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Honor Classification
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {records.map((student, index) => (
                <tr
                  key={student.student_id}
                  className={`hover:bg-gray-50 transition-colors ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50/30"
                  }`}
                >
                  <td className="px-6 py-5">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
                        <LuUser className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div className="text-sm font-semibold text-gray-900">
                        {student.student_name}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <div className="text-sm font-medium text-gray-900">
                      {student.final_average?.toFixed(2) ?? "0.00"}
                    </div>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <div className="text-sm text-gray-900">
                      {student.attendance_percentage?.toFixed(2) ?? "0.00"}%
                    </div>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <span
                      className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${
                        student.honor_classification === "With Highest Honors"
                          ? "bg-yellow-100 text-yellow-800"
                          : student.honor_classification === "With High Honors"
                          ? "bg-orange-100 text-orange-800"
                          : student.honor_classification === "With Honors"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {student.honor_classification || "No Honor"}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <StatusBadge status={student.promotion_status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View (shown on mobile and tablet) */}
        <div className="lg:hidden divide-y divide-gray-200">
          {records.map((student, index) => (
            <div key={student.student_id} className="p-4 sm:p-6 space-y-4">
              {/* Student Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
                    <LuUser className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">
                      {student.student_name}
                    </h4>
                  </div>
                </div>
                <StatusBadge status={student.promotion_status} />
              </div>

              {/* Student Details Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-3">
                  <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Grade Average
                  </dt>
                  <dd className="mt-1 text-lg font-semibold text-gray-900">
                    {student.final_average?.toFixed(2) ?? "0.00"}
                  </dd>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Attendance
                  </dt>
                  <dd className="mt-1 text-lg font-semibold text-gray-900">
                    {student.attendance_percentage?.toFixed(2) ?? "0.00"}%
                  </dd>
                </div>
              </div>

              {/* Honor Classification */}
              <div>
                <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                  Honor Classification
                </dt>
                <span
                  className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${
                    student.honor_classification === "With Highest Honors"
                      ? "bg-yellow-100 text-yellow-800"
                      : student.honor_classification === "With High Honors"
                      ? "bg-orange-100 text-orange-800"
                      : student.honor_classification === "With Honors"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {student.honor_classification || "No Honor"}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {hasRecords && (
          <div className="px-4 sm:px-6 py-4 border-t border-gray-200 bg-gray-50">
            <PaginationControls
              currentPage={promotionCurrentPage}
              totalPages={pages}
              onPrevious={() =>
                setPromotionCurrentPage(Math.max(promotionCurrentPage - 1, 1))
              }
              onNext={() =>
                setPromotionCurrentPage(
                  Math.min(promotionCurrentPage + 1, pages)
                )
              }
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default PromotionTable;
