import React from "react";
import { reasons } from "../../constants";
import { LuCircleCheck, LuCircleX, LuClock } from "react-icons/lu";

const AttendanceTable = ({ records, onStatusClick, onReasonChange }) => {
  const getStatusButtonStyle = (currentStatus, buttonStatus) => {
    if (currentStatus === buttonStatus) {
      switch (buttonStatus) {
        case "Present":
          return "bg-green-100 text-green-800";
        case "Absent":
          return "bg-red-100 text-red-800";
        case "Late":
          return "bg-yellow-100 text-yellow-800";
        default:
          return "bg-gray-100 text-gray-600";
      }
    } else {
      return "bg-gray-100 text-gray-600 hover:opacity-80";
    }
  };

  return (
    <div className="mt-8 overflow-x-auto bg-white rounded-lg shadow-md">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Student Name
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Status
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Reason
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
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

              <td className="px-4 py-4 text-sm flex space-x-2">
                <button
                  onClick={() => onStatusClick(student.id, "Present")}
                  className={`p-1 rounded-full ${getStatusButtonStyle(
                    student.status,
                    "Present"
                  )}`}
                  title="Present"
                >
                  <LuCircleCheck className="w-9 h-9" />
                </button>

                <button
                  onClick={() => onStatusClick(student.id, "Absent")}
                  className={`p-1 rounded-full ${getStatusButtonStyle(
                    student.status,
                    "Absent"
                  )}`}
                  title="Absent"
                >
                  <LuCircleX className="w-9 h-9" />
                </button>

                <button
                  onClick={() => onStatusClick(student.id, "Late")}
                  className={`p-1 rounded-full ${getStatusButtonStyle(
                    student.status,
                    "Late"
                  )}`}
                  title="Late"
                >
                  <LuClock className="w-9 h-9" />
                </button>
              </td>

              <td className="px-4 py-4 text-sm">
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

              <td className="px-4 py-4 text-sm text-blue-600 hover:underline cursor-pointer">
                View History
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AttendanceTable;
