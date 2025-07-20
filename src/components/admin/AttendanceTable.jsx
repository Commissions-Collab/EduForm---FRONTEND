import React, { useState } from "react";
import { LuCircleCheck, LuCircleX, LuClock } from "react-icons/lu";
import { ClipLoader } from "react-spinners";
import { reasons } from "../../constants";
import { useAttendanceStore } from "../../stores/useAttendanceStore";
import PaginationControls from "./Pagination";
import { getStatusButtonStyle } from "./ButtonStatus";

const RECORDS_PER_PAGE = 5;

const AttendanceTable = () => {
  const { records, setStatus, setReason, loading, error } =
    useAttendanceStore();

  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(records.length / RECORDS_PER_PAGE);
  const paginatedRecords = records.slice(
    (currentPage - 1) * RECORDS_PER_PAGE,
    currentPage * RECORDS_PER_PAGE
  );

  const hasRecords =
    Array.isArray(paginatedRecords) && paginatedRecords.length > 0;

  return (
    <>
      <div className="mt-8 overflow-x-auto bg-white rounded-lg shadow-md min-h-[200px]">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Student Name
              </th>
              <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase">
                Status
              </th>
              <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase">
                Reason
              </th>
              <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={4}>
                  <div className="flex justify-center items-center h-64">
                    <ClipLoader color="#3730A3" size={30} />
                  </div>
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={4}>
                  <div className="flex justify-center items-center h-64 text-red-600 font-medium">
                    Failed to fetch attendance data. Please try again.
                  </div>
                </td>
              </tr>
            ) : !hasRecords ? (
              <tr>
                <td colSpan={4}>
                  <div className="flex justify-center items-center h-64 text-gray-600 font-medium">
                    No attendance records available.
                  </div>
                </td>
              </tr>
            ) : (
              paginatedRecords.map((student) => (
                <tr key={student.id}>
                  <td className="px-4 py-4 text-sm text-gray-900">
                    {student.name}
                  </td>
                  <td className="px-4 py-4 text-sm flex justify-center space-x-2">
                    {["Present", "Absent", "Late"].map((status) => (
                      <button
                        key={status}
                        onClick={() => setStatus(student.id, status)}
                        className={`p-1 rounded-full ${getStatusButtonStyle(
                          student.status,
                          status
                        )}`}
                        title={status}
                      >
                        {status === "Present" && (
                          <LuCircleCheck className="w-9 h-9" />
                        )}
                        {status === "Absent" && (
                          <LuCircleX className="w-9 h-9" />
                        )}
                        {status === "Late" && <LuClock className="w-9 h-9" />}
                      </button>
                    ))}
                  </td>
                  <td className="px-4 py-4 text-sm text-center">
                    {student.status === "Absent" ? (
                      <select
                        value={student.reason}
                        onChange={(e) => setReason(student.id, e.target.value)}
                        className="w-36 p-1 border border-gray-300 rounded text-sm"
                      >
                        <option value="">Select Reason</option>
                        {reasons.map((reason, index) => (
                          <option key={index} value={reason}>
                            {reason}
                          </option>
                        ))}
                      </select>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="px-4 py-4 text-sm text-center text-blue-600 hover:underline cursor-pointer">
                    View History
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {!loading && hasRecords && (
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPrevious={() => setCurrentPage(Math.max(currentPage - 1, 1))}
          onNext={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
        />
      )}
    </>
  );
};

export default AttendanceTable;
