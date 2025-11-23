import React, { useEffect, useState } from "react";
import { ArrowLeft, FileSpreadsheet } from "lucide-react";
import { getItem, setItem } from "../../../lib/utils";
import MonthlyScheduleView from "../../../components/admin/MonthlyScheduleView"; // Changed from WeeklyScheduleView
import AttendanceTable from "../../../components/admin/AttendanceTable";
import useAttendanceStore from "../../../stores/admin/attendanceStore";
import useFilterStore from "../../../stores/admin/filterStore";

const DailyAttendance = () => {
  const {
    fetchScheduleAttendance,
    updateAllStudentsAttendance,
    exportSF2Excel,
    scheduleAttendance,
    loading,
    error,
  } = useAttendanceStore();
  const { globalFilters } = useFilterStore();

  const academicYearId = globalFilters?.academicYearId ?? null;
  const quarterId = globalFilters?.quarterId ?? null;
  const sectionId = globalFilters?.sectionId ?? null;

  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [showMonthlyView, setShowMonthlyView] = useState(true); // Changed from showWeeklyView
  const [exportMonth, setExportMonth] = useState(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
  });

  useEffect(() => {
    const savedScheduleId = getItem("selectedScheduleId", false);
    const savedDate = getItem("selectedDate", false);

    if (savedDate) {
      setSelectedDate(savedDate);
    }

    if (savedScheduleId) {
      fetchScheduleAttendance({
        scheduleId: savedScheduleId,
        sectionId: sectionId,
        academicYearId: academicYearId,
        quarterId: quarterId,
        date: savedDate || selectedDate,
      }).then((data) => {
        if (data?.schedule) {
          setSelectedSchedule(data.schedule);
          setShowMonthlyView(false);
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchScheduleAttendance, academicYearId, quarterId, sectionId]);

  useEffect(() => {
    if (
      selectedSchedule &&
      selectedDate &&
      academicYearId &&
      quarterId &&
      sectionId
    ) {
      fetchScheduleAttendance({
        scheduleId: selectedSchedule.id,
        sectionId: sectionId,
        academicYearId: academicYearId,
        quarterId: quarterId,
        date: selectedDate,
      });
    }
  }, [
    selectedSchedule,
    selectedDate,
    academicYearId,
    quarterId,
    sectionId,
    fetchScheduleAttendance,
  ]);

  const handleScheduleSelect = (schedule, date) => {
    setSelectedSchedule(schedule);
    if (date) {
      setSelectedDate(date);
    }
    setShowMonthlyView(false);

    setItem("selectedScheduleId", schedule.id);
    setItem("selectedDate", date || selectedDate);
  };

  const [refreshKey, setRefreshKey] = useState(0);

  const handleMarkAllPresent = async () => {
    if (!selectedSchedule) return alert("Please select a schedule first");

    try {
      await updateAllStudentsAttendance({
        schedule_id: selectedSchedule.id,
        status: "present",
        date: selectedDate,
      });

      await fetchScheduleAttendance({
        scheduleId: selectedSchedule.id,
        sectionId: sectionId,
        academicYearId: academicYearId,
        quarterId: quarterId,
        date: selectedDate,
      });

      setRefreshKey((prev) => prev + 1);
    } catch (error) {
      console.error("Failed to mark all present:", error);
    }
  };

  const handleMarkAllAbsent = async () => {
    if (!selectedSchedule) return alert("Please select a schedule first");

    try {
      await updateAllStudentsAttendance({
        schedule_id: selectedSchedule.id,
        status: "absent",
        date: selectedDate,
      });

      await fetchScheduleAttendance({
        scheduleId: selectedSchedule.id,
        sectionId: sectionId,
        academicYearId: academicYearId,
        quarterId: quarterId,
        date: selectedDate,
      });

      setRefreshKey((prev) => prev + 1);
    } catch (error) {
      console.error("Failed to mark all absent:", error);
    }
  };

  const handleBackToMonthly = () => { // Changed from handleBackToWeekly
    setShowMonthlyView(true);
    setSelectedSchedule(null);
  };

  const getAttendanceSummary = () => {
    if (!scheduleAttendance?.summary) return null;

    const summary = scheduleAttendance.summary;
    return {
      total: summary.total_students || 0,
      present: summary.present || 0,
      absent: summary.absent || 0,
      late: summary.late || 0,
      notRecorded: summary.not_recorded || 0,
    };
  };

  const summary = getAttendanceSummary();

  const handleExportSF2 = async () => {
    if (!sectionId || !academicYearId) {
      alert("Please select Section and Academic Year from the filters");
      return;
    }
    await exportSF2Excel(exportMonth);
  };

  return (
    <main className="p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            Daily Attendance
          </h1>
          <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-gray-600 mt-1">
            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full font-medium">
              SF2
            </span>
            {selectedSchedule && (
              <span className="text-gray-400 hidden sm:inline">•</span>
            )}
            {selectedSchedule && (
              <span className="text-xs sm:text-sm">
                {selectedSchedule.subject?.name} -{" "}
                {selectedSchedule.section?.name}
              </span>
            )}
          </div>
        </div>

        {/* Export SF2 Section */}
        <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
          {sectionId && academicYearId && (
            <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
              <div className="flex items-center gap-2">
                <label htmlFor="export-month" className="text-xs sm:text-sm text-gray-700 whitespace-nowrap">
                  Month:
                </label>
                <input
                  id="export-month"
                  type="month"
                  value={exportMonth}
                  onChange={(e) => setExportMonth(e.target.value)}
                  className="px-2 py-1 text-xs sm:text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                onClick={handleExportSF2}
                disabled={loading || !sectionId || !academicYearId}
                className="flex items-center gap-2 px-3 py-2 text-xs sm:text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Exporting...</span>
                  </>
                ) : (
                  <>
                    <FileSpreadsheet size={16} />
                    <span>Export SF2 Excel</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        {selectedSchedule && !showMonthlyView && summary && (
          <div className="w-full sm:w-auto">
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                onClick={handleMarkAllPresent}
                disabled={loading}
                className="px-3 py-2 text-xs sm:text-sm bg-green-100 text-green-800 rounded-lg hover:bg-green-200 disabled:opacity-50 transition-colors whitespace-nowrap"
              >
                Mark All Present ({summary.total})
              </button>
              <button
                onClick={handleMarkAllAbsent}
                disabled={loading}
                className="px-3 py-2 text-xs sm:text-sm bg-red-100 text-red-800 rounded-lg hover:bg-red-200 disabled:opacity-50 transition-colors whitespace-nowrap"
              >
                Mark All Absent ({summary.total})
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Monthly Schedule View */}
      {showMonthlyView && (
        <MonthlyScheduleView onScheduleClick={handleScheduleSelect} />
      )}

      {/* Selected Schedule Info */}
      {selectedSchedule && !showMonthlyView && (
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 lg:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <button
              onClick={handleBackToMonthly}
              className="text-blue-600 flex gap-2 items-center underline hover:text-blue-800 text-sm sm:text-base font-medium"
            >
              <ArrowLeft size={18} /> Monthly Schedule
            </button>

            {/* Date Selector */}
            <div className="flex items-center space-x-2">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full sm:w-auto p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Attendance Summary */}
          {summary && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4">
              <div className="bg-blue-50 p-3 rounded-lg text-center">
                <div className="text-xl sm:text-2xl font-bold text-blue-600">
                  {summary.total}
                </div>
                <div className="text-xs sm:text-sm text-blue-700">
                  Total Students
                </div>
              </div>
              <div className="bg-green-50 p-3 rounded-lg text-center">
                <div className="text-xl sm:text-2xl font-bold text-green-600">
                  {summary.present}
                </div>
                <div className="text-xs sm:text-sm text-green-700">Present</div>
              </div>
              <div className="bg-red-50 p-3 rounded-lg text-center">
                <div className="text-xl sm:text-2xl font-bold text-red-600">
                  {summary.absent}
                </div>
                <div className="text-xs sm:text-sm text-red-700">Absent</div>
              </div>
              <div className="bg-yellow-50 p-3 rounded-lg text-center">
                <div className="text-xl sm:text-2xl font-bold text-yellow-600">
                  {summary.late}
                </div>
                <div className="text-xs sm:text-sm text-yellow-700">Late</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg text-center col-span-2 sm:col-span-1">
                <div className="text-xl sm:text-2xl font-bold text-gray-600">
                  {summary.notRecorded}
                </div>
                <div className="text-xs sm:text-sm text-gray-700">
                  Not Recorded
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600 font-medium text-sm sm:text-base">Error</p>
          <p className="text-red-500 text-xs sm:text-sm">{error}</p>
        </div>
      )}

      {/* Attendance Table */}
      {selectedSchedule && !showMonthlyView ? (
        <AttendanceTable
          key={refreshKey}
          selectedDate={selectedDate}
          selectedSchedule={selectedSchedule}
        />
      ) : (
        !showMonthlyView && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 sm:p-8 text-center">
            <p className="text-gray-600 font-medium text-sm sm:text-base">
              Please select a schedule to view students
            </p>
            <p className="text-gray-500 text-xs sm:text-sm mt-1">
              Choose a class from your monthly schedule to start taking
              attendance.
            </p>
            <button
              onClick={() => setShowMonthlyView(true)}
              className="mt-4 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              View Monthly Schedule
            </button>
          </div>
        )
      )}
    </main>
  );
};

export default DailyAttendance;