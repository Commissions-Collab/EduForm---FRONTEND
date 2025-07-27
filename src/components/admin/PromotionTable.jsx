import React from "react";
import StatusBadge from "./StatusBadge";
import PaginationControls from "./Pagination";
import { ClipLoader } from "react-spinners";
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

  const getPromotionStatus = (average) =>
    average >= 75 ? "Promoted" : "Retained";

  const getAttendancePercentage = (student) => {
    return student.attendanceRate || "0%";
  };

  return (
    <>
      <div className="mt-8 overflow-x-auto bg-white rounded-lg shadow-md min-h-[200px]">
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
                Promotion Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={5}>
                  <div className="flex justify-center items-center h-64">
                    <ClipLoader color="#3730A3" size={30} />
                  </div>
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={5}>
                  <div className="flex justify-center items-center h-64 text-red-600 font-medium">
                    Failed to fetch promotion data. Please try again.
                  </div>
                </td>
              </tr>
            ) : !hasRecords ? (
              <tr>
                <td colSpan={5}>
                  <div className="flex justify-center items-center h-64 text-gray-600 font-medium">
                    No promotion records available.
                  </div>
                </td>
              </tr>
            ) : (
              records.map((student) => {
                const average = student.finalAverage?.toFixed(2) || "0.00";
                const attendancePercent = getAttendancePercentage(student);
                const promotionStatus =
                  student.status || getPromotionStatus(Number(average));

                return (
                  <tr key={student.id}>
                    <td className="px-4 py-4 text-sm text-gray-900">
                      {student.name}
                    </td>
                    <td className="px-4 py-4 text-sm font-medium text-gray-900">
                      {average}
                    </td>
                    <td className="px-4 py-4 text-sm font-medium text-gray-900">
                      {attendancePercent}
                    </td>
                    <td className="px-4 py-4">
                      <StatusBadge status={promotionStatus} />
                    </td>
                    <td className="px-4 py-4 text-sm text-blue-600 hover:underline cursor-pointer">
                      View Record
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

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
