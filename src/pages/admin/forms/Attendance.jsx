import React, { useEffect, useState } from "react";
import { LuCalendar, LuBook, LuArrowLeft } from "react-icons/lu";
import { getItem, setItem } from "../../../lib/utils";
import WeeklyScheduleView from "../../../components/admin/WeeklyScheduleView";
import AttendanceTable from "../../../components/admin/AttendanceTable";
import useAttendanceStore from "../../../stores/admin/attendanceStore";
import useFilterStore from "../../../stores/admin/filterStore";

const DailyAttendance = () => {
  const {
    fetchScheduleAttendance,
    updateAllStudentsAttendance,
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
  const [showWeeklyView, setShowWeeklyView] = useState(true);

  // Load saved schedule and date on mount
  useEffect(() => {
    const savedScheduleId = getItem("selectedScheduleId", false);
    const savedDate = getItem("selectedDate", false);

    if (savedDate) {
      setSelectedDate(savedDate);
    }

    if (savedScheduleId) {
      // Assuming schedule data can be fetched or retrieved from store
      fetchScheduleAttendance({
        scheduleId: savedScheduleId,
        sectionId: sectionId,
        academicYearId: academicYearId,
        quarterId: quarterId,
        date: savedDate || selectedDate,
      }).then((data) => {
        if (data?.schedule) {
          setSelectedSchedule(data.schedule);
          setShowWeeklyView(false);
        }
      });
    }
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
    setShowWeeklyView(false);

    // Save to localStorage
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

      // Refresh attendance data
      await fetchScheduleAttendance({
        scheduleId: selectedSchedule.id,
        sectionId: sectionId,
        academicYearId: academicYearId,
        quarterId: quarterId,
        date: selectedDate,
      });

      // Trigger table refresh
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

      // Refresh attendance data
      await fetchScheduleAttendance({
        scheduleId: selectedSchedule.id,
        sectionId: sectionId,
        academicYearId: academicYearId,
        quarterId: quarterId,
        date: selectedDate,
      });

      // Trigger table refresh
      setRefreshKey((prev) => prev + 1);
    } catch (error) {
      console.error("Failed to mark all absent:", error);
    }
  };

  const handleBackToWeekly = () => {
    setShowWeeklyView(true);
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

  return (
    <main className="p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Daily Attendance</h1>
          <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full font-medium">
              SF2
            </span>
            {selectedSchedule && <span className="text-gray-400">•</span>}
            {selectedSchedule && (
              <span>
                {selectedSchedule.subject?.name} -{" "}
                {selectedSchedule.section?.name}
              </span>
            )}
          </div>
        </div>

        {/* Quick Actions for selected schedule */}
        {selectedSchedule && !showWeeklyView && summary && (
          <div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={handleMarkAllPresent}
                disabled={loading}
                className="px-3 py-2 text-sm bg-green-100 text-green-800 rounded-lg hover:bg-green-200 disabled:opacity-50 transition-colors"
              >
                Mark All Present ({summary.total})
              </button>
              <button
                onClick={handleMarkAllAbsent}
                disabled={loading}
                className="px-3 py-2 text-sm bg-red-100 text-red-800 rounded-lg hover:bg-red-200 disabled:opacity-50 transition-colors"
              >
                Mark All Absent ({summary.total})
              </button>
              <button
                onClick={() => {
                  console.log(
                    "Export attendance for",
                    selectedSchedule.subject?.name,
                    selectedDate
                  );
                }}
                className="px-3 py-2 text-sm bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 transition-colors"
              >
                Export Attendance
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Weekly Schedule View */}
      {showWeeklyView && (
        <WeeklyScheduleView onScheduleClick={handleScheduleSelect} />
      )}

      {/* Selected Schedule Info */}
      {selectedSchedule && !showWeeklyView && (
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={handleBackToWeekly}
              className="text-blue-600 flex gap-2 items-center underline hover:text-blue-800 text-base font-medium"
            >
              <LuArrowLeft /> Weekly Schedule
            </button>

            {/* Date Selector */}
            <div className="flex items-center space-x-2">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Attendance Summary */}
          {summary && (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="bg-blue-50 p-3 rounded-lg text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {summary.total}
                </div>
                <div className="text-sm text-blue-700">Total Students</div>
              </div>
              <div className="bg-green-50 p-3 rounded-lg text-center">
                <div className="text-2xl font-bold text-green-600">
                  {summary.present}
                </div>
                <div className="text-sm text-green-700">Present</div>
              </div>
              <div className="bg-red-50 p-3 rounded-lg text-center">
                <div className="text-2xl font-bold text-red-600">
                  {summary.absent}
                </div>
                <div className="text-sm text-red-700">Absent</div>
              </div>
              <div className="bg-yellow-50 p-3 rounded-lg text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {summary.late}
                </div>
                <div className="text-sm text-yellow-700">Late</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg text-center">
                <div className="text-2xl font-bold text-gray-600">
                  {summary.notRecorded}
                </div>
                <div className="text-sm text-gray-700">Not Recorded</div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600 font-medium">Error</p>
          <p className="text-red-500 text-sm">{error}</p>
        </div>
      )}

      {/* Attendance Table */}
      {selectedSchedule && !showWeeklyView ? (
        <AttendanceTable
          key={refreshKey}
          selectedDate={selectedDate}
          selectedSchedule={selectedSchedule}
        />
      ) : (
        !showWeeklyView && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
            <p className="text-gray-600 font-medium">
              Please select a schedule to view students
            </p>
            <p className="text-gray-500 text-sm mt-1">
              Choose a class from your weekly schedule to start taking
              attendance.
            </p>
            <button
              onClick={() => setShowWeeklyView(true)}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              View Weekly Schedule
            </button>
          </div>
        )
      )}
    </main>
  );
};

export default DailyAttendance;
