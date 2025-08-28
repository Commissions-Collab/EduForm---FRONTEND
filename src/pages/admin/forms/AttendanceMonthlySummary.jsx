import React, { useEffect, useState } from "react";
import {
  LuPrinter,
  LuDownload,
  LuCalendar,
  LuUsers,
  LuLoader,
} from "react-icons/lu";
import { ClipLoader } from "react-spinners";

import { useAdminStore } from "../../../stores/useAdminStore";
import { getItem } from "../../../lib/utils";

const AttendanceMonthlySummary = () => {
  const {
    downloadAttendancePDF,
    fetchMonthlyAttendance,
    monthlyAttendanceData,
    loading,
    error,
  } = useAdminStore();

  const [downloadLoading, setDownloadLoading] = useState(false);

  useEffect(() => {
    // Load monthly attendance data when component mounts
    const sectionId = getItem("sectionId", false) || 1;
    const academicYearId = getItem("academicYearId", false) || 1;

    if (sectionId && academicYearId) {
      fetchMonthlyAttendance();
    }
  }, [fetchMonthlyAttendance]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    setDownloadLoading(true);
    try {
      await downloadAttendancePDF();
    } catch (err) {
      console.error("Download failed:", err);
    } finally {
      setDownloadLoading(false);
    }
  };

  // Calculate summary statistics from the new API response structure
  const calculateSummaryStats = () => {
    if (
      !monthlyAttendanceData?.students ||
      !Array.isArray(monthlyAttendanceData.students)
    ) {
      return {
        totalStudents: 0,
        totalDays: 0,
        presentCount: 0,
        absentCount: 0,
        halfDayCount: 0,
      };
    }

    const students = monthlyAttendanceData.students;
    const totalStudents = students.length;

    // Calculate totals from monthly_summary of each student
    let totalPresentDays = 0;
    let totalAbsentDays = 0;
    let totalHalfDays = 0;
    let totalSchoolDays = 0;

    students.forEach((student) => {
      const summary = student.monthly_summary;
      totalPresentDays += summary.present_days || 0;
      totalAbsentDays += summary.absent_days || 0;
      totalHalfDays += summary.half_days || 0;

      // Calculate school days for this student (excluding no_class days)
      const studentSchoolDays =
        (summary.present_days || 0) +
        (summary.absent_days || 0) +
        (summary.half_days || 0);
      totalSchoolDays = Math.max(totalSchoolDays, studentSchoolDays);
    });

    return {
      totalStudents,
      totalDays: totalSchoolDays,
      presentCount: totalPresentDays,
      absentCount: totalAbsentDays,
      halfDayCount: totalHalfDays,
    };
  };

  const summaryStats = calculateSummaryStats();

  // Calculate attendance rate
  const totalAttendanceRecords =
    summaryStats.presentCount +
    summaryStats.absentCount +
    summaryStats.halfDayCount;
  const attendanceRate =
    totalAttendanceRecords > 0
      ? (
          ((summaryStats.presentCount + summaryStats.halfDayCount * 0.5) /
            totalAttendanceRecords) *
          100
        ).toFixed(1)
      : 0;

  // Get current period info from API response or fallback to current date
  const periodInfo = monthlyAttendanceData?.period || {
    month_name: new Date().toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    }),
  };

  // Transform student data for daily attendance table
  const getDailyAttendanceData = () => {
    if (
      !monthlyAttendanceData?.students ||
      !monthlyAttendanceData?.calendar_days
    ) {
      return [];
    }

    return monthlyAttendanceData.calendar_days
      .filter((day) => !day.is_weekend && !day.is_holiday) // Only show school days
      .map((day) => {
        let dayPresent = 0;
        let dayAbsent = 0;
        let dayHalfDay = 0;

        // Count attendance for this day across all students
        monthlyAttendanceData.students.forEach((student) => {
          const dayAttendance = student.daily_attendance.find(
            (att) => att.date === day.date
          );
          if (dayAttendance) {
            switch (dayAttendance.status) {
              case "present":
                dayPresent++;
                break;
              case "absent":
                dayAbsent++;
                break;
              case "half_day":
                dayHalfDay++;
                break;
            }
          }
        });

        const totalStudents = monthlyAttendanceData.students.length;
        const attendedStudents = dayPresent + dayHalfDay;
        const dayRate =
          totalStudents > 0
            ? (((dayPresent + dayHalfDay * 0.5) / totalStudents) * 100).toFixed(
                1
              )
            : 0;

        return {
          date: day.date,
          dayName: day.day_name,
          day: day.day,
          present: dayPresent,
          absent: dayAbsent,
          halfDay: dayHalfDay,
          rate: dayRate,
        };
      });
  };

  const dailyData = getDailyAttendanceData();

  return (
    <main className="p-4">
      <div className="between mb-6">
        <div>
          <div>
            <h1 className="page-title">Monthly Attendance Summary</h1>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full font-medium">
                {periodInfo.month_name}
              </span>
              {monthlyAttendanceData?.section && (
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full font-medium">
                  {monthlyAttendanceData.section.name}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex space-x-3">
          <button
            className="gray-button flex items-center"
            onClick={handlePrint}
            disabled={loading}
          >
            <LuPrinter size={15} />
            <span className="ml-2">Print</span>
          </button>

          <button
            className="gray-button flex items-center"
            onClick={handleDownloadPDF}
            disabled={downloadLoading || loading}
          >
            {downloadLoading ? (
              <LuLoader className="w-6 h-6 text-blue-700 animate-spin" />
            ) : (
              <LuDownload size={15} />
            )}
            <span className="ml-2">
              {downloadLoading ? "Downloading..." : "Export PDF"}
            </span>
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6 text-center">
          <p className="text-yellow-800 font-semibold">
            {error.includes("advisory class")
              ? " Access Restricted"
              : " Access Restricted"}
          </p>
          <p className="text-yellow-700 mt-2">{error}</p>
        </div>
      )}

      {/* Summary Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100">
              <LuUsers className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">
                Total Students
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {summaryStats.totalStudents}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100">
              <LuCalendar className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">School Days</p>
              <p className="text-2xl font-bold text-gray-900">
                {summaryStats.totalDays}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100">
              <div className="h-6 w-6 text-purple-600 font-bold flex items-center justify-center">
                %
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">
                Attendance Rate
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {attendanceRate}%
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100">
              <div className="h-6 w-6 text-red-600 font-bold flex items-center justify-center">
                !
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">
                Total Absences
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {summaryStats.absentCount}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Attendance Breakdown */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Attendance Breakdown
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {summaryStats.presentCount}
            </div>
            <div className="text-sm font-medium text-gray-500">
              Present Days
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div
                className="bg-green-600 h-2 rounded-full"
                style={{
                  width: `${
                    totalAttendanceRecords > 0
                      ? (summaryStats.presentCount / totalAttendanceRecords) *
                        100
                      : 0
                  }%`,
                }}
              ></div>
            </div>
          </div>

          <div className="text-center">
            <div className="text-3xl font-bold text-red-600 mb-2">
              {summaryStats.absentCount}
            </div>
            <div className="text-sm font-medium text-gray-500">Absent Days</div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div
                className="bg-red-600 h-2 rounded-full"
                style={{
                  width: `${
                    totalAttendanceRecords > 0
                      ? (summaryStats.absentCount / totalAttendanceRecords) *
                        100
                      : 0
                  }%`,
                }}
              ></div>
            </div>
          </div>

          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-600 mb-2">
              {summaryStats.halfDayCount}
            </div>
            <div className="text-sm font-medium text-gray-500">Half Days</div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div
                className="bg-yellow-600 h-2 rounded-full"
                style={{
                  width: `${
                    totalAttendanceRecords > 0
                      ? (summaryStats.halfDayCount / totalAttendanceRecords) *
                        100
                      : 0
                  }%`,
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Class Statistics */}
      {monthlyAttendanceData?.class_statistics && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Class Performance
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-xl font-bold text-gray-900">
                {monthlyAttendanceData.class_statistics.average_attendance_rate}
                %
              </div>
              <div className="text-sm text-gray-600">Average Rate</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-xl font-bold text-green-600">
                {monthlyAttendanceData.class_statistics.students_above_90}
              </div>
              <div className="text-sm text-gray-600">Above 90%</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-xl font-bold text-red-600">
                {monthlyAttendanceData.class_statistics.students_below_75}
              </div>
              <div className="text-sm text-gray-600">Below 75%</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-xl font-bold text-blue-600">
                {monthlyAttendanceData.class_statistics.highest_attendance}%
              </div>
              <div className="text-sm text-gray-600">Highest Rate</div>
            </div>
          </div>
        </div>
      )}

      {/* Daily Attendance Overview */}
      {loading ? (
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex flex-col justify-center items-center">
            <LuLoader className="w-9 h-9 text-blue-700 animate-spin" />
            <span className="ml-3 text-gray-600">
              Loading attendance data...
            </span>
          </div>
        </div>
      ) : dailyData.length > 0 ? (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Daily Attendance Overview
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
                    Present
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Absent
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Half Day
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Attendance Rate
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {dailyData.map((day) => (
                  <tr key={day.date} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {new Date(day.date).toLocaleDateString("en-US", {
                        weekday: "short",
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">
                      {day.present}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-medium">
                      {day.absent}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-yellow-600 font-medium">
                      {day.halfDay}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          day.rate >= 90
                            ? "bg-green-100 text-green-800"
                            : day.rate >= 75
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {day.rate}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
          <p className="text-gray-600 font-medium">
            No attendance data available
          </p>
          <p className="text-gray-500 text-sm mt-1">
            Please ensure a section and academic year are selected and
            attendance data exists for this month.
          </p>
        </div>
      )}

      {/* Student List with Individual Stats */}
      {monthlyAttendanceData?.students &&
        monthlyAttendanceData.students.length > 0 && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden mt-6">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Individual Student Performance
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Present Days
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Absent Days
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Half Days
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Attendance Rate
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {monthlyAttendanceData.students.map((studentData) => (
                    <tr
                      key={studentData.student.id}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {studentData.student.full_name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {studentData.student.student_id} • LRN:{" "}
                              {studentData.student.lrn}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">
                        {studentData.monthly_summary.present_days}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-medium">
                        {studentData.monthly_summary.absent_days}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-yellow-600 font-medium">
                        {studentData.monthly_summary.half_days}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            studentData.attendance_rate >= 90
                              ? "bg-green-100 text-green-800"
                              : studentData.attendance_rate >= 75
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {studentData.attendance_rate}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
    </main>
  );
};

export default AttendanceMonthlySummary;
