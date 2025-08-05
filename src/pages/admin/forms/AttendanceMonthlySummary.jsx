import React, { useEffect, useState } from "react";
import { LuPrinter, LuDownload, LuCalendar, LuUsers } from "react-icons/lu";
import { ClipLoader } from "react-spinners";

import { useAdminStore } from "../../../stores/useAdminStore";
import { getItem } from "../../../lib/utils";

const AttendanceMonthlySummary = () => {
  const {
    downloadAttendancePDF,
    fetchScheduleAttendanceHistory,
    scheduleAttendance,
    loading,
    error,
  } = useAdminStore();

  const [sectionName, setSectionName] = useState("Grade 10-A");
  const [downloadLoading, setDownloadLoading] = useState(false);

  useEffect(() => {
    // Load attendance data when component mounts
    const scheduleId = getItem("scheduleId", false);
    if (scheduleId) {
      fetchScheduleAttendanceHistory();
    }

    // Get section name from localStorage if available
    const storedSectionName = getItem("sectionName", false);
    if (storedSectionName) {
      setSectionName(storedSectionName);
    }
  }, [fetchScheduleAttendanceHistory]);

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

  // Calculate summary statistics from scheduleAttendance data
  const calculateSummaryStats = () => {
    if (!scheduleAttendance || typeof scheduleAttendance !== "object") {
      return {
        totalStudents: 0,
        totalDays: 0,
        presentCount: 0,
        absentCount: 0,
        lateCount: 0,
      };
    }

    let totalStudents = 0;
    let totalDays = 0;
    let presentCount = 0;
    let absentCount = 0;
    let lateCount = 0;

    // If scheduleAttendance is grouped by date
    Object.values(scheduleAttendance).forEach((dateData) => {
      if (Array.isArray(dateData)) {
        totalStudents = Math.max(totalStudents, dateData.length);
        totalDays++;

        dateData.forEach((student) => {
          switch (student.status?.toLowerCase()) {
            case "present":
              presentCount++;
              break;
            case "absent":
              absentCount++;
              break;
            case "late":
              lateCount++;
              break;
          }
        });
      }
    });

    return { totalStudents, totalDays, presentCount, absentCount, lateCount };
  };

  const summaryStats = calculateSummaryStats();
  const attendanceRate =
    summaryStats.presentCount + summaryStats.lateCount > 0
      ? (
          ((summaryStats.presentCount + summaryStats.lateCount) /
            (summaryStats.presentCount +
              summaryStats.absentCount +
              summaryStats.lateCount)) *
          100
        ).toFixed(1)
      : 0;

  return (
    <main className="p-4">
      <div className="between mb-6">
        <div>
          <h1 className="page-title">Monthly Attendance Summary (SF4)</h1>
          <p className="text-gray-600 text-sm mt-1">{sectionName}</p>
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
              <ClipLoader color="#666666" size={15} />
            ) : (
              <LuDownload size={15} />
            )}
            <span className="ml-2">
              {downloadLoading ? "Downloading..." : "Export PDF by Quarter"}
            </span>
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-600 font-medium">Error</p>
          <p className="text-red-500 text-sm">{error}</p>
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
            <div className="text-sm font-medium text-gray-500">Present</div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div
                className="bg-green-600 h-2 rounded-full"
                style={{
                  width: `${
                    summaryStats.presentCount +
                      summaryStats.absentCount +
                      summaryStats.lateCount >
                    0
                      ? (summaryStats.presentCount /
                          (summaryStats.presentCount +
                            summaryStats.absentCount +
                            summaryStats.lateCount)) *
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
            <div className="text-sm font-medium text-gray-500">Absent</div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div
                className="bg-red-600 h-2 rounded-full"
                style={{
                  width: `${
                    summaryStats.presentCount +
                      summaryStats.absentCount +
                      summaryStats.lateCount >
                    0
                      ? (summaryStats.absentCount /
                          (summaryStats.presentCount +
                            summaryStats.absentCount +
                            summaryStats.lateCount)) *
                        100
                      : 0
                  }%`,
                }}
              ></div>
            </div>
          </div>

          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-600 mb-2">
              {summaryStats.lateCount}
            </div>
            <div className="text-sm font-medium text-gray-500">Late</div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div
                className="bg-yellow-600 h-2 rounded-full"
                style={{
                  width: `${
                    summaryStats.presentCount +
                      summaryStats.absentCount +
                      summaryStats.lateCount >
                    0
                      ? (summaryStats.lateCount /
                          (summaryStats.presentCount +
                            summaryStats.absentCount +
                            summaryStats.lateCount)) *
                        100
                      : 0
                  }%`,
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Daily Attendance Overview */}
      {loading ? (
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex justify-center items-center">
            <ClipLoader color="#3730A3" size={40} />
            <span className="ml-3 text-gray-600">
              Loading attendance data...
            </span>
          </div>
        </div>
      ) : scheduleAttendance && Object.keys(scheduleAttendance).length > 0 ? (
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
                    Late
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Attendance Rate
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {Object.entries(scheduleAttendance).map(([date, students]) => {
                  if (!Array.isArray(students)) return null;

                  const dayPresent = students.filter(
                    (s) => s.status?.toLowerCase() === "present"
                  ).length;
                  const dayAbsent = students.filter(
                    (s) => s.status?.toLowerCase() === "absent"
                  ).length;
                  const dayLate = students.filter(
                    (s) => s.status?.toLowerCase() === "late"
                  ).length;
                  const dayRate =
                    students.length > 0
                      ? (
                          ((dayPresent + dayLate) / students.length) *
                          100
                        ).toFixed(1)
                      : 0;

                  return (
                    <tr key={date} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {new Date(date).toLocaleDateString("en-US", {
                          weekday: "short",
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">
                        {dayPresent}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-medium">
                        {dayAbsent}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-yellow-600 font-medium">
                        {dayLate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            dayRate >= 90
                              ? "bg-green-100 text-green-800"
                              : dayRate >= 75
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {dayRate}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
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
            Please ensure a schedule is selected and attendance data exists.
          </p>
        </div>
      )}
    </main>
  );
};

export default AttendanceMonthlySummary;
