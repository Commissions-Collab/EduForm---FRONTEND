import React from "react";

const PerfectAttendanceTable = ({ records }) => {
  return (
    <div className="mt-8 overflow-x-auto bg-white rounded-lg shadow-md">
      <div className="p-5">
        <h1 className="text-lg font-semibold mb-1">
          Perfect Attendance Certificates
        </h1>
        <p className="text-sm text-gray-500">
          Manage and generate certificates for students with perfect attendance.
        </p>
      </div>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Student Name
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Certificate Type
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Quarters
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {records.map((record, idx) => (
            <tr key={idx}>
              <td className="px-4 py-4 text-sm text-gray-900">{record.name}</td>
              <td className="px-4 py-4 text-sm text-gray-900">
                {record.certificateType}
              </td>
              <td className="px-4 py-4 text-sm text-gray-900">
                {record.quarters}
              </td>
              <td className="px-4 py-4 space-x-2">
                <button className="text-blue-600 hover:underline">
                  Preview
                </button>
                <button className="text-green-600 hover:underline">
                  Print
                </button>
                <button className="text-indigo-600 hover:underline">
                  Download
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PerfectAttendanceTable;
