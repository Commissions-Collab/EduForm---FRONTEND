import React from "react";
import StatusBadge from "./StatusBadge";
import PaginationControls from "./Pagination";
import { ClipLoader } from "react-spinners";
import { LuBadgeAlert } from "react-icons/lu";
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

  // === Alert Block ===
  const renderAlert = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-64">
          <ClipLoader color="#3730A3" size={30} />
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex justify-center items-center h-64 text-red-600 font-medium">
          Failed to fetch promotion data. Please try again.
        </div>
      );
    }

    if (!hasRecords) {
      return (
        <div className="mt-10 rounded-md border border-yellow-400 bg-yellow-50 px-6 py-4 flex items-start gap-3 shadow-sm">
          <LuBadgeAlert className="w-6 h-6 text-yellow-500 mt-1" />
          <div>
            <h2 className="text-lg font-semibold text-yellow-800">
              Promotion Report Not Available
            </h2>
            <p className="text-sm text-yellow-700 mt-1">
              Promotion data may not be accessible because:
            </p>
            <ul className="list-disc pl-5 mt-1 text-sm text-yellow-700">
              <li>
                Some students have incomplete grades or attendance records.
              </li>
              <li>The grading or attendance period has not yet ended.</li>
            </ul>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <>
      {/* Render alert messages (outside the table) */}
      {renderAlert()}

      {/* Only render table if there are records */}
      {!loading && !error && hasRecords && (
        <div className="mt-6 overflow-x-auto bg-white rounded-lg shadow-md min-h-[400px]">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Student Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Grade Average
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Attendance %
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Honor Classification
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {records.map((student) => (
                <tr key={student.student_id}>
                  <td className="px-4 py-4 text-sm text-gray-900 font-medium">
                    {student.student_name}
                  </td>
                  <td className="px-4 py-4 text-sm">
                    {student.final_average?.toFixed(2) ?? "0.00"}
                  </td>
                  <td className="px-4 py-4 text-sm">
                    {student.attendance_percentage?.toFixed(2) ?? "0.00"}%
                  </td>
                  <td className="px-4 py-4 text-sm">
                    {student.honor_classification}
                  </td>
                  <td className="px-4 py-4">
                    <StatusBadge status={student.promotion_status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {!loading && hasRecords && (
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
      )}
    </>
  );
};

export default PromotionTable;
