import React from "react";
import {
  LuTriangleAlert,
  LuCircleX,
  LuCalendar,
  LuClock,
} from "react-icons/lu";
import { useStoreUser } from "../../stores/student";

const AttendanceCards = () => {
  const { attendanceData, attendanceLoading, attendanceError } = useStoreUser();

  if (attendanceLoading) {
    return (
      <div className="container mx-auto">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (attendanceError) {
    return (
      <div className="container mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">{attendanceError}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      {/* Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {/* Attendance Rate Card */}
        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Attendance Rate
          </h3>
          <p className="text-4xl font-bold text-gray-900 mb-4">
            {attendanceData.attendance_rate}%
          </p>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-green-500 h-2.5 rounded-full"
              style={{ width: `${attendanceData.attendance_rate}%` }}
            ></div>
          </div>
        </div>

        {/* Late Arrivals Card */}
        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Late Arrivals
          </h3>
          <p className="text-4xl font-bold text-gray-900 mb-2">
            {attendanceData.late_arrivals.count}
          </p>
          {attendanceData.late_arrivals.pattern && (
            <p className="flex items-center text-sm text-yellow-600 mb-1">
              <LuTriangleAlert className="w-4 h-4 mr-1" />
              Pattern on {attendanceData.late_arrivals.pattern}
            </p>
          )}
          <p className="text-sm text-gray-500">
            {attendanceData.late_arrivals.count > 0
              ? "Late arrivals detected"
              : "No late arrivals"}
          </p>
        </div>

        {/* Absences Card */}
        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Absences
          </h3>
          <p className="text-4xl font-bold text-gray-900 mb-2">
            {attendanceData.absences.count}
          </p>
          {attendanceData.absences.count > 0 && (
            <p className="flex items-center text-sm text-red-600 mb-1">
              <LuCircleX className="w-4 h-4 mr-1" />
              {attendanceData.absences.count} absence(s) recorded
            </p>
          )}
          {attendanceData.absences.count > 0 && (
            <p className="text-sm text-gray-500">Submit excuse within 3 days</p>
          )}
        </div>
      </div>

      {/* Daily Status Table */}
      {attendanceData.daily_status.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <LuCalendar className="w-5 h-5 mr-2" />
            Daily Attendance Records
          </h3>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Day
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Time In
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Remarks
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {attendanceData.daily_status.map((record, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {record.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {record.weekday}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            record.status === "present"
                              ? "bg-green-100 text-green-800"
                              : record.status === "late"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {record.status.charAt(0).toUpperCase() +
                            record.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {record.time_in ? (
                          <div className="flex items-center">
                            <LuClock className="w-4 h-4 mr-1" />
                            {record.time_in}
                          </div>
                        ) : (
                          "N/A"
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {record.remarks || "No remarks"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Quarterly Summary */}
      {attendanceData.quarterly_summary.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Quarterly Summary
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {attendanceData.quarterly_summary.map((quarter, index) => (
              <div
                key={index}
                className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"
              >
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  {quarter.quarter}
                </h4>
                <p className="text-2xl font-bold text-blue-600">
                  {quarter.attendance_rate}%
                </p>
                <p className="text-xs text-gray-500 mt-1">Attendance Rate</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceCards;
