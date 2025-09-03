import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { LuArrowLeft } from "react-icons/lu";
import useAttendanceStore from "../../stores/admin/attendanceStore";
import useFilterStore from "../../stores/admin/filterStore";

const StudentAttendanceHistory = () => {
  const { studentId, scheduleId } = useParams();
  const navigate = useNavigate();
  const { globalFilters } = useFilterStore();
  const { fetchStudentAttendanceHistory, studentAttendance, loading, error } =
    useAttendanceStore();

  // State for date range
  const [dateRange, setDateRange] = useState({
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    if (studentId && scheduleId && globalFilters.academicYearId) {
      // Default to current academic year if no date range is provided
      const now = new Date();
      const defaultStartDate = `${now.getFullYear() - 1}-08-01`; // Start of academic year
      const defaultEndDate = `${now.getFullYear()}-07-31`; // End of academic year

      fetchStudentAttendanceHistory(
        studentId,
        scheduleId,
        dateRange.startDate || defaultStartDate,
        dateRange.endDate || defaultEndDate
      );
    }
  }, [
    studentId,
    scheduleId,
    globalFilters.academicYearId,
    dateRange,
    fetchStudentAttendanceHistory,
  ]);

  const data = studentAttendance;

  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case "present":
        return "bg-green-100 text-green-800";
      case "absent":
        return "bg-red-100 text-red-800";
      case "late":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "Invalid Date";
    }
  };

  const handleRetry = () => {
    if (studentId && scheduleId && globalFilters.academicYearId) {
      const now = new Date();
      const defaultStartDate = `${now.getFullYear() - 1}-08-01`;
      const defaultEndDate = `${now.getFullYear()}-07-31`;
      fetchStudentAttendanceHistory(
        studentId,
        scheduleId,
        dateRange.startDate || defaultStartDate,
        dateRange.endDate || defaultEndDate
      );
    }
  };

  return (
    <main className="p-4 lg:p-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Student Attendance History
        </h2>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm"
        >
          <LuArrowLeft className="w-4 h-4" />
          Back
        </button>
      </div>

      {/* Date Range Filter */}
      <div className="mb-6 bg-white rounded-lg p-4 shadow-sm border border-gray-200">
        <h3 className="text-sm font-semibold text-gray-900 mb-2">
          Filter by Date Range
        </h3>
        <div className="flex flex-col sm:flex-row gap-4">
          <div>
            <label className="text-sm text-gray-600">Start Date</label>
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) =>
                setDateRange({ ...dateRange, startDate: e.target.value })
              }
              className="mt-1 block w-full border border-gray-200 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="text-sm text-gray-600">End Date</label>
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) =>
                setDateRange({ ...dateRange, endDate: e.target.value })
              }
              className="mt-1 block w-full border border-gray-200 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <ClipLoader color="#3730A3" size={40} />
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600 font-medium">Error</p>
          <p className="text-red-500 text-sm mt-2">{error}</p>
          <button
            onClick={handleRetry}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      ) : data && Object.keys(data).length > 0 ? (
        <>
          {/* Student Information Card */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Student Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.student && (
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Student Name
                  </p>
                  <p className="text-sm text-gray-900">
                    {data.student.full_name || data.student.name}
                  </p>
                </div>
              )}
              {data.subject && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Subject</p>
                  <p className="text-sm text-gray-900">{data.subject.name}</p>
                </div>
              )}
              {data.section && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Section</p>
                  <p className="text-sm text-gray-900">{data.section.name}</p>
                </div>
              )}
              {data.academic_year && (
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Academic Year
                  </p>
                  <p className="text-sm text-gray-900">
                    {data.academic_year.name}
                  </p>
                </div>
              )}
              {data.period && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Period</p>
                  <p className="text-sm text-gray-900">
                    {formatDate(data.period.start_date)} to{" "}
                    {formatDate(data.period.end_date)}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Attendance Summary Card */}
          {data.attendance_summary &&
            Object.keys(data.attendance_summary).length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Attendance Summary
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(data.attendance_summary).map(
                    ([key, value]) => (
                      <div key={key} className="text-center">
                        <p className="text-2xl font-bold text-gray-900">
                          {value}
                        </p>
                        <p className="text-sm font-medium text-gray-500 capitalize">
                          {key.replace(/_/g, " ")}
                        </p>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}

          {/* Monthly Breakdown Card */}
          {data.monthly_breakdown &&
            Object.keys(data.monthly_breakdown).length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Monthly Breakdown
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(data.monthly_breakdown).map(
                    ([month, count]) => (
                      <div
                        key={month}
                        className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                      >
                        <span className="font-medium text-gray-900">
                          {month}
                        </span>
                        <span className="text-gray-600">{count} days</span>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}

          {/* Attendance Records Table */}
          {data.attendance_records && data.attendance_records.length > 0 && (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  Attendance Records
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      {data.attendance_records.some(
                        (record) => record.reason
                      ) && (
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Reason
                        </th>
                      )}
                      {data.attendance_records.some(
                        (record) => record.time_in
                      ) && (
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Time In
                        </th>
                      )}
                      {data.attendance_records.some(
                        (record) => record.time_out
                      ) && (
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Time Out
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {data.attendance_records.map((record, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatDate(record.date)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeClass(
                              record.status
                            )}`}
                          >
                            {record.status || "Unknown"}
                          </span>
                        </td>
                        {data.attendance_records.some((r) => r.reason) && (
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {record.reason || "-"}
                          </td>
                        )}
                        {data.attendance_records.some((r) => r.time_in) && (
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {record.time_in || "-"}
                          </td>
                        )}
                        {data.attendance_records.some((r) => r.time_out) && (
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {record.time_out || "-"}
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
          <p className="text-gray-600 font-medium">
            No Attendance Data Available
          </p>
          <p className="text-gray-500 text-sm mt-1">
            Please check if the student, schedule, and academic year are valid.
          </p>
          <button
            onClick={handleRetry}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      )}
    </main>
  );
};

export default StudentAttendanceHistory;
