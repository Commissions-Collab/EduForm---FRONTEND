import React, { useEffect, useState } from "react";
import {
  LuPrinter,
  LuDownload,
  LuCalendar,
  LuUsers,
  LuLoader,
  LuTriangleAlert,
} from "react-icons/lu";
import toast from "react-hot-toast";
import { getItem } from "../../../lib/utils";
import useAttendanceStore from "../../../stores/admin/attendanceStore";
import useFilterStore from "../../../stores/admin/filterStore";
import { useNavigate } from "react-router-dom";

const AttendanceMonthlySummary = () => {
  const {
    fetchMonthlyAttendance,
    downloadQuarterlyAttendancePDF,
    monthlyAttendanceData,
    loading,
    error,
  } = useAttendanceStore();
  const { globalFilters } = useFilterStore();
  const navigate = useNavigate();

  const [downloadLoading, setDownloadLoading] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(() => {
    const today = new Date();
    return { month: today.getMonth() + 1, year: today.getFullYear() };
  });

  const sectionId =
    globalFilters?.sectionId ||
    parseInt(getItem("sectionId", false), 10) ||
    null;
  const academicYearId =
    globalFilters?.academicYearId ||
    parseInt(getItem("academicYearId", false), 10) ||
    null;

  useEffect(() => {
    if (
      sectionId &&
      academicYearId &&
      currentMonth.month &&
      currentMonth.year
    ) {
      if (
        currentMonth.month < 1 ||
        currentMonth.month > 12 ||
        currentMonth.year < 2000
      ) {
        toast.error("Invalid month or year");
        return;
      }
      fetchMonthlyAttendance({
        sectionId,
        academicYearId,
        month: currentMonth.month,
        year: currentMonth.year,
      });
    } else {
      toast.error("Please select a section and academic year");
    }
  }, [sectionId, academicYearId, currentMonth, fetchMonthlyAttendance]);

  const handleMonthChange = (e) => {
    const [year, month] = e.target.value.split("-").map(Number);
    if (month >= 1 && month <= 12 && year >= 2000) {
      setCurrentMonth({ month, year });
    } else {
      toast.error("Invalid month or year selected");
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    setDownloadLoading(true);
    try {
      await downloadQuarterlyAttendancePDF();
    } catch (err) {
      toast.error("Failed to download PDF");
      console.error("Download failed:", err);
    } finally {
      setDownloadLoading(false);
    }
  };

  const handleSelectAdvisorySection = () => {
    // Navigate to a filter selection page or trigger a filter update
    navigate("/filters"); // Adjust to your app's filter selection route
  };

  // Calculate summary statistics
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

    let totalPresentDays = 0;
    let totalAbsentDays = 0;
    let totalHalfDays = 0;
    let totalSchoolDays = 0;

    students.forEach((student) => {
      const summary = student.monthly_summary;
      totalPresentDays += summary.present_days || 0;
      totalAbsentDays += summary.absent_days || 0;
      totalHalfDays += summary.half_days || 0;

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

  const periodInfo = monthlyAttendanceData?.period || {
    month_name: new Date(
      currentMonth.year,
      currentMonth.month - 1
    ).toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    }),
  };

  const getDailyAttendanceData = () => {
    if (
      !monthlyAttendanceData?.students ||
      !monthlyAttendanceData?.calendar_days
    ) {
      return [];
    }

    return monthlyAttendanceData.calendar_days
      .filter((day) => !day.is_weekend && !day.is_holiday)
      .map((day) => {
        let dayPresent = 0;
        let dayAbsent = 0;
        let dayHalfDay = 0;

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

  // Render only the warning message if the section is not the advisory class
  if (error === "This section is not your advisory class.") {
    return (
      <main className="p-4 max-w-7xl mx-auto">
        <div className="flex justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Monthly Attendance Summary
            </h1>
            <div className="flex items-center gap-2 text-sm text-gray-600 mt-2">
              <input
                type="month"
                value={`${currentMonth.year}-${currentMonth.month
                  .toString()
                  .padStart(2, "0")}`}
                onChange={handleMonthChange}
                className="px-2 py-1 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              />
              {monthlyAttendanceData?.section && (
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full font-medium">
                  {monthlyAttendanceData.section.name}
                </span>
              )}
            </div>
          </div>
        </div>
        <div
          className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 text-center max-w-2xl mx-auto"
          role="alert"
          aria-labelledby="advisory-error-title"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <LuTriangleAlert
              className="h-8 w-8 text-yellow-600"
              aria-hidden="true"
            />
            <h2
              id="advisory-error-title"
              className="text-xl font-semibold text-yellow-800"
            >
              Advisory Class Required
            </h2>
          </div>
          <p className="text-yellow-700 mb-6">
            The monthly attendance summary is only available for your advisory
            section. Please select your advisory section to view the data.
          </p>
          <button
            onClick={handleSelectAdvisorySection}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Select your advisory section"
          >
            Select Advisory Section
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="p-4 max-w-7xl mx-auto">
      <div className="flex justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Monthly Attendance Summary
          </h1>
          <div className="flex items-center gap-2 text-sm text-gray-600 mt-2">
            <input
              type="month"
              value={`${currentMonth.year}-${currentMonth.month
                .toString()
                .padStart(2, "0")}`}
              onChange={handleMonthChange}
              className="px-2 py-1 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
            {monthlyAttendanceData?.section && (
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full font-medium">
                {monthlyAttendanceData.section.name}
              </span>
            )}
          </div>
        </div>
        <div className="flex space-x-3">
          <button
            className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
            onClick={handlePrint}
            disabled={loading}
            aria-label="Print attendance summary"
          >
            <LuPrinter size={15} aria-hidden="true" />
            <span className="ml-2">Print</span>
          </button>
          <button
            className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
            onClick={handleDownloadPDF}
            disabled={downloadLoading || loading}
            aria-label={downloadLoading ? "Downloading PDF" : "Download PDF"}
          >
            {downloadLoading ? (
              <LuLoader
                className="w-6 h-6 text-blue-700 animate-spin"
                aria-hidden="true"
              />
            ) : (
              <LuDownload size={15} aria-hidden="true" />
            )}
            <span className="ml-2">
              {downloadLoading ? "Downloading..." : "Export PDF"}
            </span>
          </button>
        </div>
      </div>

      {error && error !== "This section is not your advisory class." && (
        <div
          className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6 text-center"
          role="alert"
          aria-labelledby="error-title"
        >
          <p id="error-title" className="text-yellow-600 font-semibold">
            Failed to Load Attendance
          </p>
          <p className="text-yellow-500 mt-2">{error}</p>
        </div>
      )}

      {!error && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100">
                  <LuUsers
                    className="h-6 w-6 text-blue-600"
                    aria-hidden="true"
                  />
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
                  <LuCalendar
                    className="h-6 w-6 text-green-600"
                    aria-hidden="true"
                  />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">
                    School Days
                  </p>
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
                          ? (summaryStats.presentCount /
                              totalAttendanceRecords) *
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
                <div className="text-sm font-medium text-gray-500">
                  Absent Days
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div
                    className="bg-red-600 h-2 rounded-full"
                    style={{
                      width: `${
                        totalAttendanceRecords > 0
                          ? (summaryStats.absentCount /
                              totalAttendanceRecords) *
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
                <div className="text-sm font-medium text-gray-500">
                  Half Days
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div
                    className="bg-yellow-600 h-2 rounded-full"
                    style={{
                      width: `${
                        totalAttendanceRecords > 0
                          ? (summaryStats.halfDayCount /
                              totalAttendanceRecords) *
                            100
                          : 0
                      }%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {monthlyAttendanceData?.class_statistics && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Class Performance
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-xl font-bold text-gray-900">
                    {
                      monthlyAttendanceData.class_statistics
                        .average_attendance_rate
                    }
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

          {loading ? (
            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="flex flex-col justify-center items-center">
                <LuLoader
                  className="w-9 h-9 text-blue-700 animate-spin"
                  aria-hidden="true"
                />
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
        </>
      )}
    </main>
  );
};

export default AttendanceMonthlySummary;
