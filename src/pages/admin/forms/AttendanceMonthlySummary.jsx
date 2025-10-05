import React, { useEffect, useState } from "react";
import {
  Printer,
  Download,
  Calendar,
  Users,
  Loader,
  TriangleAlert,
} from "lucide-react";
import toast from "react-hot-toast";
import { getItem } from "../../../lib/utils";
import { useNavigate } from "react-router-dom";
import useAttendanceStore from "../../../stores/admin/attendanceStore";
import useFilterStore from "../../../stores/admin/filterStore";

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
    navigate("/filters");
  };

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
              default:
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

  if (error === "This section is not your advisory class.") {
    return (
      <div className="bg-gray-50 min-h-screen">
        <main className="p-3 sm:p-4 lg:p-6 max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4 sm:mb-6">
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                Monthly Attendance Summary
              </h1>
              <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-gray-600 mt-2">
                <input
                  type="month"
                  value={`${currentMonth.year}-${currentMonth.month
                    .toString()
                    .padStart(2, "0")}`}
                  onChange={handleMonthChange}
                  className="px-2 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled={loading}
                />
                {monthlyAttendanceData?.section && (
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full font-medium text-xs sm:text-sm">
                    {monthlyAttendanceData.section.name}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 sm:p-6 text-center max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-4">
              <TriangleAlert className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-600" />
              <h2 className="text-base sm:text-xl font-semibold text-yellow-800">
                Advisory Class Required
              </h2>
            </div>
            <p className="text-sm sm:text-base text-yellow-700 mb-6">
              The monthly attendance summary is only available for your advisory
              section. Please select your advisory section to view the data.
            </p>
            <button
              onClick={handleSelectAdvisorySection}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
            >
              Select Advisory Section
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <main className="p-3 sm:p-4 lg:p-6 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div className="min-w-0 flex-1">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              Monthly Attendance Summary
            </h1>
            <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-gray-600 mt-2">
              <input
                type="month"
                value={`${currentMonth.year}-${currentMonth.month
                  .toString()
                  .padStart(2, "0")}`}
                onChange={handleMonthChange}
                className="px-2 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              />
              {monthlyAttendanceData?.section && (
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full font-medium text-xs sm:text-sm">
                  {monthlyAttendanceData.section.name}
                </span>
              )}
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              className="flex items-center px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-xs sm:text-sm"
              onClick={handlePrint}
              disabled={loading}
            >
              <Printer size={14} className="sm:w-4 sm:h-4" />
              <span className="ml-2">Print</span>
            </button>
            <button
              className="flex items-center px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-xs sm:text-sm"
              onClick={handleDownloadPDF}
              disabled={downloadLoading || loading}
            >
              {downloadLoading ? (
                <Loader className="w-4 h-4 text-blue-700 animate-spin" />
              ) : (
                <Download size={14} className="sm:w-4 sm:h-4" />
              )}
              <span className="ml-2">
                {downloadLoading ? "Downloading..." : "Export PDF"}
              </span>
            </button>
          </div>
        </div>

        {error && error !== "This section is not your advisory class." && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 text-center">
            <p className="text-sm text-yellow-600 font-semibold">
              Failed to Load Attendance
            </p>
            <p className="text-xs text-yellow-500 mt-1">{error}</p>
          </div>
        )}

        {!error && (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
              <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 border border-gray-200">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="p-2 rounded-full bg-blue-100 flex-shrink-0">
                    <Users className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-gray-500">
                      Total Students
                    </p>
                    <p className="text-lg sm:text-xl font-bold text-gray-900">
                      {summaryStats.totalStudents}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 border border-gray-200">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="p-2 rounded-full bg-green-100 flex-shrink-0">
                    <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-gray-500">
                      School Days
                    </p>
                    <p className="text-lg sm:text-xl font-bold text-gray-900">
                      {summaryStats.totalDays}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 border border-gray-200">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="p-2 rounded-full bg-purple-100 flex-shrink-0">
                    <div className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600 font-bold flex items-center justify-center text-sm">
                      %
                    </div>
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-gray-500">
                      Attendance Rate
                    </p>
                    <p className="text-lg sm:text-xl font-bold text-gray-900">
                      {attendanceRate}%
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 border border-gray-200">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="p-2 rounded-full bg-red-100 flex-shrink-0">
                    <div className="h-4 w-4 sm:h-5 sm:w-5 text-red-600 font-bold flex items-center justify-center text-sm">
                      !
                    </div>
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-gray-500">
                      Total Absences
                    </p>
                    <p className="text-lg sm:text-xl font-bold text-gray-900">
                      {summaryStats.absentCount}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-6 border border-gray-200">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">
                Attendance Breakdown
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-green-600 mb-2">
                    {summaryStats.presentCount}
                  </div>
                  <div className="text-xs sm:text-sm font-medium text-gray-500">
                    Present Days
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div
                      className="bg-green-600 h-2 rounded-full transition-all"
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
                  <div className="text-2xl sm:text-3xl font-bold text-red-600 mb-2">
                    {summaryStats.absentCount}
                  </div>
                  <div className="text-xs sm:text-sm font-medium text-gray-500">
                    Absent Days
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div
                      className="bg-red-600 h-2 rounded-full transition-all"
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
                  <div className="text-2xl sm:text-3xl font-bold text-yellow-600 mb-2">
                    {summaryStats.halfDayCount}
                  </div>
                  <div className="text-xs sm:text-sm font-medium text-gray-500">
                    Half Days
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div
                      className="bg-yellow-600 h-2 rounded-full transition-all"
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
              <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-6 border border-gray-200">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">
                  Class Performance
                </h3>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-lg sm:text-xl font-bold text-gray-900">
                      {
                        monthlyAttendanceData.class_statistics
                          .average_attendance_rate
                      }
                      %
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      Average Rate
                    </div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-lg sm:text-xl font-bold text-green-600">
                      {monthlyAttendanceData.class_statistics.students_above_90}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">Above 90%</div>
                  </div>
                  <div className="text-center p-3 bg-red-50 rounded-lg">
                    <div className="text-lg sm:text-xl font-bold text-red-600">
                      {monthlyAttendanceData.class_statistics.students_below_75}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">Below 75%</div>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-lg sm:text-xl font-bold text-blue-600">
                      {
                        monthlyAttendanceData.class_statistics
                          .highest_attendance
                      }
                      %
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      Highest Rate
                    </div>
                  </div>
                </div>
              </div>
            )}

            {loading ? (
              <div className="bg-white rounded-lg shadow-sm p-8 border border-gray-200">
                <div className="flex items-center justify-center gap-3">
                  <Loader className="w-6 h-6 text-blue-700 animate-spin" />
                  <span className="text-sm text-gray-600">
                    Loading attendance data...
                  </span>
                </div>
              </div>
            ) : dailyData.length > 0 ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
                <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                    Daily Attendance Overview
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <div className="inline-block min-w-full align-middle">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Date
                          </th>
                          <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Present
                          </th>
                          <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Absent
                          </th>
                          <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Half Day
                          </th>
                          <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Rate
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {dailyData.map((day) => (
                          <tr key={day.date} className="hover:bg-gray-50">
                            <td className="px-3 sm:px-6 py-3 whitespace-nowrap text-xs sm:text-sm font-medium text-gray-900">
                              {new Date(day.date).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                              })}
                            </td>
                            <td className="px-3 sm:px-6 py-3 whitespace-nowrap text-xs sm:text-sm text-green-600 font-medium">
                              {day.present}
                            </td>
                            <td className="px-3 sm:px-6 py-3 whitespace-nowrap text-xs sm:text-sm text-red-600 font-medium">
                              {day.absent}
                            </td>
                            <td className="px-3 sm:px-6 py-3 whitespace-nowrap text-xs sm:text-sm text-yellow-600 font-medium">
                              {day.halfDay}
                            </td>
                            <td className="px-3 sm:px-6 py-3 whitespace-nowrap text-xs sm:text-sm">
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
              </div>
            ) : (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
                <p className="text-sm text-gray-600 font-medium">
                  No attendance data available
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Please ensure attendance data exists for this month.
                </p>
              </div>
            )}

            {monthlyAttendanceData?.students &&
              monthlyAttendanceData.students.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                  <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                      Individual Student Performance
                    </h3>
                  </div>
                  <div className="overflow-x-auto">
                    <div className="inline-block min-w-full align-middle">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                              Student
                            </th>
                            <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                              Present
                            </th>
                            <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                              Absent
                            </th>
                            <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                              Half Days
                            </th>
                            <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                              Rate
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {monthlyAttendanceData.students.map((studentData) => (
                            <tr
                              key={studentData.student.id}
                              className="hover:bg-gray-50"
                            >
                              <td className="px-3 sm:px-6 py-3">
                                <div className="text-xs sm:text-sm font-medium text-gray-900">
                                  {studentData.student.full_name}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {studentData.student.student_id} • LRN:{" "}
                                  {studentData.student.lrn}
                                </div>
                              </td>
                              <td className="px-3 sm:px-6 py-3 whitespace-nowrap text-xs sm:text-sm text-green-600 font-medium">
                                {studentData.monthly_summary.present_days}
                              </td>
                              <td className="px-3 sm:px-6 py-3 whitespace-nowrap text-xs sm:text-sm text-red-600 font-medium">
                                {studentData.monthly_summary.absent_days}
                              </td>
                              <td className="px-3 sm:px-6 py-3 whitespace-nowrap text-xs sm:text-sm text-yellow-600 font-medium">
                                {studentData.monthly_summary.half_days}
                              </td>
                              <td className="px-3 sm:px-6 py-3 whitespace-nowrap text-xs sm:text-sm">
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
                </div>
              )}
          </>
        )}
      </main>
    </div>
  );
};

export default AttendanceMonthlySummary;
