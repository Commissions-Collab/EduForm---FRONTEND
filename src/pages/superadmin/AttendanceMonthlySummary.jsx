import React, { useEffect, useState, useRef } from "react";
import {
  Printer,
  Download,
  Calendar,
  Users,
  Loader,
  Filter,
  ChevronDown,
  Check,
  X,
  BookOpen,
  FileText,
  Settings2,
} from "lucide-react";
import useSuperAdminAttendanceStore from "../../stores/superAdmin/attendanceStore";
import useFilterStore from "../../stores/superAdmin/superAdminFilterStore";

const AttendanceMonthlySummary = () => {
  const {
    fetchMonthlyAttendance,
    downloadQuarterlyAttendancePDF,
    exportMonthlyAttendanceCSV,
    monthlyAttendanceData,
    loading,
    error,
  } = useSuperAdminAttendanceStore();

  const {
    filterOptions,
    loading: filterLoading,
    fetchGlobalFilterOptions,
    updateSectionsForAcademicYear,
  } = useFilterStore();

  const [downloadLoading, setDownloadLoading] = useState(false);
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);
  const [isUpdatingFilters, setIsUpdatingFilters] = useState(false);

  const [localFilters, setLocalFilters] = useState({
    academicYearId: null,
    sectionId: null,
  });

  const [appliedFilters, setAppliedFilters] = useState({
    academicYearId: null,
    sectionId: null,
  });

  const [currentMonth, setCurrentMonth] = useState(() => {
    const today = new Date();
    return { month: today.getMonth() + 1, year: today.getFullYear() };
  });

  const dropdownRef = useRef();

  useEffect(() => {
    fetchGlobalFilterOptions();
  }, [fetchGlobalFilterOptions]);

  useEffect(() => {
    if (
      appliedFilters.sectionId &&
      appliedFilters.academicYearId &&
      currentMonth.month &&
      currentMonth.year
    ) {
      if (
        currentMonth.month < 1 ||
        currentMonth.month > 12 ||
        currentMonth.year < 2000
      ) {
        return;
      }
      fetchMonthlyAttendance({
        sectionId: appliedFilters.sectionId,
        academicYearId: appliedFilters.academicYearId,
        month: currentMonth.month,
        year: currentMonth.year,
      });
    }
  }, [appliedFilters, currentMonth, fetchMonthlyAttendance]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsFilterExpanded(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAcademicYearChange = async (value) => {
    const academicYearId = value ? parseInt(value, 10) : null;

    setLocalFilters((prev) => ({
      ...prev,
      academicYearId,
      sectionId: null,
    }));

    if (academicYearId) {
      setIsUpdatingFilters(true);
      try {
        await updateSectionsForAcademicYear(academicYearId);
      } catch (error) {
        console.error("Error updating sections:", error);
      } finally {
        setIsUpdatingFilters(false);
      }
    }
  };

  const handleSectionChange = (value) => {
    setLocalFilters((prev) => ({
      ...prev,
      sectionId: value ? parseInt(value, 10) : null,
    }));
  };

  const applyFilters = () => {
    setAppliedFilters(localFilters);
    setIsFilterExpanded(false);
  };

  const clearAllFilters = () => {
    setLocalFilters({
      academicYearId: null,
      sectionId: null,
    });
    setAppliedFilters({
      academicYearId: null,
      sectionId: null,
    });
    setIsFilterExpanded(false);
  };

  const handleMonthChange = (e) => {
    const [year, month] = e.target.value.split("-").map(Number);
    if (month >= 1 && month <= 12 && year >= 2000) {
      setCurrentMonth({ month, year });
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    setDownloadLoading(true);
    try {
      await downloadQuarterlyAttendancePDF({
        sectionId: appliedFilters.sectionId,
        academicYearId: appliedFilters.academicYearId,
        quarterId: appliedFilters.quarterId,
      });
    } catch (err) {
      console.error("Download failed:", err);
    } finally {
      setDownloadLoading(false);
    }
  };

  const handleExportCSV = async () => {
    setDownloadLoading(true);
    try {
      await exportMonthlyAttendanceCSV();
    } catch (err) {
      console.error("Export failed:", err);
    } finally {
      setDownloadLoading(false);
    }
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

  const getCurrentSelections = () => {
    const selections = {};

    if (localFilters.academicYearId) {
      const year = filterOptions.academicYears?.find(
        (y) => y.id === localFilters.academicYearId
      );
      selections.academicYear = year ? year.name : null;
    }

    if (localFilters.sectionId) {
      const section = filterOptions.sections?.find(
        (s) => s.id === localFilters.sectionId
      );
      selections.section = section ? section.name : null;
    }

    return selections;
  };

  const selections = getCurrentSelections();
  const hasFiltersSelected =
    localFilters.academicYearId || localFilters.sectionId;
  const hasCompleteFilters =
    localFilters.academicYearId && localFilters.sectionId;
  const filterCount = Object.values(selections).filter(Boolean).length;

  const isLoadingFilters = loading || isUpdatingFilters || filterLoading;

  return (
    <div className="bg-gray-50 min-h-screen">
      <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                Monthly Attendance
              </h1>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 mt-1">
                <span className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full font-medium">
                  SF4
                </span>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700"
                onClick={handlePrint}
                disabled={loading}
              >
                <Printer size={18} />
                Print
              </button>
              <button
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700 disabled:opacity-50"
                onClick={handleExportCSV}
                disabled={downloadLoading || loading}
              >
                {downloadLoading ? (
                  <Loader className="w-4 h-4 animate-spin" />
                ) : (
                  <FileText size={18} />
                )}
                {downloadLoading ? "Exporting..." : "Export CSV"}
              </button>
            </div>
          </div>
        </div>

        {/* Filter Section */}
        <div className="mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Settings2 className="w-5 h-5 text-gray-700" />
                <h2 className="text-lg font-semibold text-gray-900">
                  Attendance Filters
                </h2>
              </div>
              {hasCompleteFilters && (
                <button
                  onClick={clearAllFilters}
                  className="text-sm text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-1 rounded transition-colors"
                >
                  Clear All
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Academic Year Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Academic Year
                </label>
                <select
                  value={localFilters.academicYearId || ""}
                  onChange={(e) => handleAcademicYearChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white text-gray-900 disabled:bg-gray-50 disabled:text-gray-500 cursor-pointer"
                  disabled={isLoadingFilters}
                >
                  <option value="">Select Year</option>
                  {filterOptions?.academicYears?.map((y) => (
                    <option key={y.id} value={y.id}>
                      {y.name} {y.is_current ? "• Current" : ""}
                    </option>
                  ))}
                </select>
              </div>

              {/* Section Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Section
                </label>
                <select
                  value={localFilters.sectionId || ""}
                  onChange={(e) => handleSectionChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white text-gray-900 disabled:bg-gray-50 disabled:text-gray-500 cursor-pointer"
                  disabled={isLoadingFilters || !localFilters.academicYearId}
                >
                  <option value="">Select Section</option>
                  {filterOptions?.sections?.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Month Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Month & Year
                </label>
                <input
                  type="month"
                  value={`${currentMonth.year}-${currentMonth.month
                    .toString()
                    .padStart(2, "0")}`}
                  onChange={handleMonthChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white text-gray-900 disabled:bg-gray-50 disabled:text-gray-500 cursor-pointer"
                  disabled={loading}
                />
              </div>

              {/* Apply Button */}
              <div className="flex items-end">
                <button
                  onClick={applyFilters}
                  className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  disabled={isLoadingFilters || !hasFiltersSelected}
                >
                  {isLoadingFilters && (
                    <Loader className="w-4 h-4 animate-spin" />
                  )}
                  Apply
                </button>
              </div>
            </div>

            {/* Filter Status */}
            {hasCompleteFilters && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                    <Calendar className="w-4 h-4" />
                    {selections.academicYear}
                  </span>
                  <span className="inline-flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm">
                    <BookOpen className="w-4 h-4" />
                    {selections.section}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8 text-center">
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        )}

        {/* No Filters Message */}
        {!appliedFilters.sectionId || !appliedFilters.academicYearId ? (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
            <Filter className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-blue-900 mb-2">
              Select filters to view data
            </h2>
            <p className="text-sm text-blue-700">
              Choose an academic year and section above to display attendance
              information
            </p>
          </div>
        ) : !error && monthlyAttendanceData ? (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">
                      Total Students
                    </p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                      {summaryStats.totalStudents}
                    </p>
                  </div>
                  <Users className="w-12 h-12 text-blue-100" />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">
                      School Days
                    </p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                      {summaryStats.totalDays}
                    </p>
                  </div>
                  <Calendar className="w-12 h-12 text-green-100" />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">
                      Attendance Rate
                    </p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                      {attendanceRate}%
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold">
                    %
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">
                      Total Absences
                    </p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                      {summaryStats.absentCount}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-600 font-bold">
                    !
                  </div>
                </div>
              </div>
            </div>

            {/* Attendance Breakdown */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Attendance Breakdown
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-600 mb-2">
                    {summaryStats.presentCount}
                  </div>
                  <p className="text-gray-600 font-medium mb-4">Present Days</p>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-green-600 h-3 rounded-full transition-all"
                      style={{
                        width: `${
                          totalAttendanceRecords > 0
                            ? (summaryStats.presentCount /
                                totalAttendanceRecords) *
                              100
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-red-600 mb-2">
                    {summaryStats.absentCount}
                  </div>
                  <p className="text-gray-600 font-medium mb-4">Absent Days</p>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-red-600 h-3 rounded-full transition-all"
                      style={{
                        width: `${
                          totalAttendanceRecords > 0
                            ? (summaryStats.absentCount /
                                totalAttendanceRecords) *
                              100
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-yellow-600 mb-2">
                    {summaryStats.halfDayCount}
                  </div>
                  <p className="text-gray-600 font-medium mb-4">Half Days</p>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-yellow-600 h-3 rounded-full transition-all"
                      style={{
                        width: `${
                          totalAttendanceRecords > 0
                            ? (summaryStats.halfDayCount /
                                totalAttendanceRecords) *
                              100
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Class Statistics */}
            {monthlyAttendanceData?.class_statistics && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  Class Performance
                </h3>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 border border-gray-200">
                    <p className="text-gray-600 text-sm font-medium">
                      Average Rate
                    </p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">
                      {
                        monthlyAttendanceData.class_statistics
                          .average_attendance_rate
                      }
                      %
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
                    <p className="text-green-700 text-sm font-medium">
                      Above 90%
                    </p>
                    <p className="text-2xl font-bold text-green-600 mt-2">
                      {monthlyAttendanceData.class_statistics.students_above_90}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4 border border-red-200">
                    <p className="text-red-700 text-sm font-medium">
                      Below 75%
                    </p>
                    <p className="text-2xl font-bold text-red-600 mt-2">
                      {monthlyAttendanceData.class_statistics.students_below_75}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                    <p className="text-blue-700 text-sm font-medium">
                      Highest Rate
                    </p>
                    <p className="text-2xl font-bold text-blue-600 mt-2">
                      {
                        monthlyAttendanceData.class_statistics
                          .highest_attendance
                      }
                      %
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Daily Attendance Table */}
            {loading ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 flex items-center justify-center gap-3">
                <Loader className="w-6 h-6 text-blue-600 animate-spin" />
                <span className="text-gray-600">Loading data...</span>
              </div>
            ) : dailyData.length > 0 ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Daily Attendance Overview
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                          Present
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                          Absent
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                          Half Day
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                          Rate
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {dailyData.map((day) => (
                        <tr key={day.date} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">
                            {new Date(day.date).toLocaleDateString("en-US", {
                              weekday: "short",
                              month: "short",
                              day: "numeric",
                            })}
                          </td>
                          <td className="px-6 py-4 text-sm font-medium text-green-600">
                            {day.present}
                          </td>
                          <td className="px-6 py-4 text-sm font-medium text-red-600">
                            {day.absent}
                          </td>
                          <td className="px-6 py-4 text-sm font-medium text-yellow-600">
                            {day.halfDay}
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <span
                              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
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
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center mb-8">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 font-medium">
                  No attendance data available
                </p>
                <p className="text-gray-500 text-sm mt-1">
                  Attendance records for this period will appear here
                </p>
              </div>
            )}

            {/* Student Performance Table */}
            {monthlyAttendanceData?.students &&
              monthlyAttendanceData.students.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Student Performance
                    </h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                            Student
                          </th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                            Present
                          </th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                            Absent
                          </th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                            Half Days
                          </th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                            Attendance Rate
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {monthlyAttendanceData.students.map((studentData) => (
                          <tr
                            key={studentData.student.id}
                            className="hover:bg-gray-50"
                          >
                            <td className="px-6 py-4">
                              <div className="text-sm font-medium text-gray-900">
                                {studentData.student.full_name}
                              </div>
                              <div className="text-xs text-gray-500">
                                {studentData.student.student_id} • LRN:{" "}
                                {studentData.student.lrn}
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm font-medium text-green-600">
                              {studentData.monthly_summary.present_days}
                            </td>
                            <td className="px-6 py-4 text-sm font-medium text-red-600">
                              {studentData.monthly_summary.absent_days}
                            </td>
                            <td className="px-6 py-4 text-sm font-medium text-yellow-600">
                              {studentData.monthly_summary.half_days}
                            </td>
                            <td className="px-6 py-4 text-sm">
                              <span
                                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
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
        ) : null}
      </main>
    </div>
  );
};

export default AttendanceMonthlySummary;
