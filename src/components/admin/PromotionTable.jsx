import React from "react";
import StatusBadge from "./StatusBadge";
import PaginationControls from "./Pagination";
import { LuBadgeAlert, LuLoader, LuUser } from "react-icons/lu";
import { useAdminStore } from "../../stores/admin";

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

  // Loading
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden mt-6">
        <div className="px-4 sm:px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-900">
            Promotion Records
          </h3>
        </div>
        <div className="py-20 flex flex-col items-center space-y-3">
          <LuLoader className="w-6 h-6 text-blue-700 animate-spin" />
          <p className="text-gray-500 text-sm">Loading promotion records...</p>
        </div>
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden mt-6">
        <div className="px-4 sm:px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-900">
            Promotion Records
          </h3>
        </div>
        <div className="py-20 text-center text-red-600">
          Failed to fetch promotion data. Please try again.
        </div>
      </div>
    );
  }

  // No Records
  if (!hasRecords) {
    return (
      <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl border-2 border-amber-200 p-6 shadow-lg mt-6">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
            <LuBadgeAlert className="w-6 h-6 text-amber-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-amber-800 mb-2">
              Promotion Report Not Available
            </h3>
            <p className="text-amber-700 mb-4">
              Promotion data may not be accessible due to incomplete grades,
              attendance records, or unfinalized results.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Records Table
  return (
    <div className="space-y-6 mt-6">
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="px-4 sm:px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
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

        {/* Table */}
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
                  <td className="px-6 py-5 flex items-center">
                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
                      <LuUser className="w-5 h-5 text-indigo-600" />
                    </div>
                    <span className="text-sm font-semibold text-gray-900">
                      {student.student_name}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-center">
                    {student.final_average?.toFixed(2) ?? "0.00"}
                  </td>
                  <td className="px-6 py-5 text-center">
                    {student.attendance_percentage?.toFixed(2) ?? "0.00"}%
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

        {/* Pagination */}
        <div className="px-4 sm:px-6 py-4 border-t border-gray-200 bg-gray-50">
          <PaginationControls
            currentPage={promotionCurrentPage}
            totalPages={pages}
            onPrevious={() =>
              setPromotionCurrentPage(Math.max(promotionCurrentPage - 1, 1))
            }
            onNext={() =>
              setPromotionCurrentPage(Math.min(promotionCurrentPage + 1, pages))
            }
          />
        </div>
      </div>
    </div>
  );
};

export default PromotionTable;
