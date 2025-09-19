import React from "react";
import StatusBadge from "./StatusBadge";
import PaginationControls from "./Pagination";
import { BadgeAlert, User } from "lucide-react";
import usePromotionStore from "../../stores/admin/promotionStore";

const PromotionTable = () => {
  const {
    promotionStudents,
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedRecords,
    loading,
  } = usePromotionStore();

  const records = paginatedRecords();
  const pages = totalPages();
  const hasRecords = Array.isArray(records) && records.length > 0;

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden mt-6">
        <div className="px-4 sm:px-6 py-4 border-b border-gray-200 bg-gray-50 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <div className="h-6 w-48 bg-gray-200 animate-pulse rounded"></div>
            <div className="h-4 w-64 bg-gray-200 animate-pulse rounded mt-1"></div>
          </div>
          <div className="h-6 w-24 bg-gray-200 animate-pulse rounded-full"></div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left">
                  <div className="h-4 w-32 bg-gray-200 animate-pulse rounded"></div>
                </th>
                <th className="px-6 py-4 text-center">
                  <div className="h-4 w-24 bg-gray-200 animate-pulse rounded"></div>
                </th>
                <th className="px-6 py-4 text-center">
                  <div className="h-4 w-24 bg-gray-200 animate-pulse rounded"></div>
                </th>
                <th className="px-6 py-4 text-center">
                  <div className="h-4 w-32 bg-gray-200 animate-pulse rounded"></div>
                </th>
                <th className="px-6 py-4 text-center">
                  <div className="h-4 w-20 bg-gray-200 animate-pulse rounded"></div>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {[...Array(5)].map((_, index) => (
                <tr key={index}>
                  <td className="px-6 py-5 flex items-center">
                    <div className="w-10 h-10 bg-gray-200 animate-pulse rounded-full mr-3"></div>
                    <div className="h-4 w-48 bg-gray-200 animate-pulse rounded"></div>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <div className="h-4 w-16 bg-gray-200 animate-pulse rounded mx-auto"></div>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <div className="h-4 w-16 bg-gray-200 animate-pulse rounded mx-auto"></div>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <div className="h-4 w-24 bg-gray-200 animate-pulse rounded mx-auto"></div>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <div className="h-4 w-20 bg-gray-200 animate-pulse rounded mx-auto"></div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 sm:px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="h-8 w-24 bg-gray-200 animate-pulse rounded"></div>
            <div className="h-4 w-32 bg-gray-200 animate-pulse rounded"></div>
            <div className="h-8 w-24 bg-gray-200 animate-pulse rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!hasRecords) {
    return (
      <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl border-2 border-amber-200 p-6 shadow-lg mt-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
            <BadgeAlert className="w-6 h-6 text-amber-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-amber-800 mb-2">
              Promotion Report Not Available
            </h3>
            <p className="text-amber-700">
              Promotion data may not be accessible due to incomplete grades,
              attendance records, or unfinalized results.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 mt-6">
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="px-4 sm:px-6 py-4 border-b border-gray-200 bg-gray-50 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
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

        <div className="overflow-x-auto">
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
                      <User className="w-5 h-5 text-indigo-600" />
                    </div>
                    <span className="text-sm font-semibold text-gray-900">
                      {student.student_name}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-center text-sm">
                    {student.final_average?.toFixed(2) ?? "0.00"}
                  </td>
                  <td className="px-6 py-5 text-center text-sm">
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

        <div className="px-4 sm:px-6 py-4 border-t border-gray-200 bg-gray-50">
          <PaginationControls
            currentPage={currentPage}
            totalPages={pages}
            onPrevious={() => setCurrentPage(Math.max(currentPage - 1, 1))}
            onNext={() => setCurrentPage(Math.min(currentPage + 1, pages))}
          />
        </div>
      </div>
    </div>
  );
};

export default PromotionTable;
