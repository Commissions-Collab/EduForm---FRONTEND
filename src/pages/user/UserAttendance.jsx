import React, { useEffect } from "react";
import AttendanceCards from "../../components/user/AttendanceCards";
import { useStoreUser } from "../../stores/student";

const UserAttendance = () => {
  const {
    attendanceData,
    fetchAttendance,
    fetchMonthOptions,
    monthOptions,
    selectedMonth,
    setSelectedMonth,
    attendanceLoading,
    attendanceError,
    clearAttendanceError,
  } = useStoreUser();

  useEffect(() => {
    fetchMonthOptions();
  }, [fetchMonthOptions]);

  useEffect(() => {
    // Always fetch attendance data with a month parameter
    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM format
    fetchAttendance(selectedMonth || currentMonth);
  }, [fetchAttendance, selectedMonth]);

  if (attendanceLoading) {
    return (
      <div className="p-5">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (attendanceError) {
    return (
      <div className="p-5">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">{attendanceError}</p>
          <button
            onClick={clearAttendanceError}
            className="mt-2 text-red-600 hover:text-red-800 underline"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-4">
        <h2 className="text-md sm:text-lg lg:text-1xl font-bold text-gray-800 mb-4 sm:mb-0">
          Attendance Records (SF2/SF4)
        </h2>
        <div className="flex items-center gap-2">
          <span className="text-gray-600">Month: </span>
          <select
            className="px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            value={selectedMonth || new Date().toISOString().slice(0, 7)}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            {monthOptions.map((month, index) => (
              <option key={index} value={month.value}>
                {month.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Attendance Summary */}
      {attendanceData.attendance_rate > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-700">
                Attendance Rate
              </h3>
              <p className="text-2xl font-bold text-green-600">
                {attendanceData.attendance_rate}%
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-700">
                Late Arrivals
              </h3>
              <p className="text-2xl font-bold text-yellow-600">
                {attendanceData.late_arrivals.count}
              </p>
              {attendanceData.late_arrivals.pattern && (
                <p className="text-sm text-gray-500">
                  Mostly on {attendanceData.late_arrivals.pattern}
                </p>
              )}
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-700">Absences</h3>
              <p className="text-2xl font-bold text-red-600">
                {attendanceData.absences.count}
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-700">
                Total Days
              </h3>
              <p className="text-2xl font-bold text-blue-600">
                {attendanceData.daily_status.length}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Attendance Cards Component */}
      <AttendanceCards />
    </div>
  );
};

export default UserAttendance;
