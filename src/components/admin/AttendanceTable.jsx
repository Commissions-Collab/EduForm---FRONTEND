import React from "react";
import { reasons } from "../../constants";
import { LuCircleCheck, LuCircleX, LuClock } from "react-icons/lu";
import { getStatusButtonStyle } from "./ButtonStatus";
import PaginationControls from "./Pagination";

const AttendanceTable = ({
  records,
  onStatusClick,
  onReasonChange,
  currentPage,
  totalPages,
  onPreviousPage,
  onNextPage,
}) => (
  <>
    <div className="mt-8 overflow-x-auto bg-white rounded-lg shadow-md">
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
          {records.map((student) => (
            <tr key={student.id}>
              <td className="px-4 py-4 text-sm text-gray-900">
                {student.name}
              </td>
              <td className="px-4 py-4 text-sm flex justify-center space-x-2">
                {["Present", "Absent", "Late"].map((status) => (
                  <button
                    key={status}
                    onClick={() => onStatusClick(student.id, status)}
                    className={`p-1 rounded-full ${getStatusButtonStyle(
                      student.status,
                      status
                    )}`}
                    title={status}
                  >
                    {status === "Present" && (
                      <LuCircleCheck className="w-9 h-9" />
                    )}
                    {status === "Absent" && <LuCircleX className="w-9 h-9" />}
                    {status === "Late" && <LuClock className="w-9 h-9" />}
                  </button>
                ))}
              </td>
              <td className="px-4 py-4 text-sm text-center">
                {student.status === "Absent" ? (
                  <select
                    value={student.reason}
                    onChange={(e) => onReasonChange(student.id, e.target.value)}
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
          ))}
        </tbody>
      </table>
    </div>
    <PaginationControls
      currentPage={currentPage}
      totalPages={totalPages}
      onPrevious={onPreviousPage}
      onNext={onNextPage}
    />
  </>
);

export default AttendanceTable;
