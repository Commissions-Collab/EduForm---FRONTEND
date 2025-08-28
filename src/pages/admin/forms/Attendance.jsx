import React, { useEffect, useState } from "react";
import { LuUsers } from "react-icons/lu";
import { getItem, setItem } from "../../../lib/utils";
import { useAdminStore } from "../../../stores/useAdminStore";
import AttendanceTable from "../../../components/admin/AttendanceTable";

const DailyAttendance = () => {
  const {
    fetchScheduleStudents,
    updateAllStudentsAttendance,
    fetchWeeklySchedule,
    weeklySchedule,
    loading,
    error,
    globalFilters,
  } = useAdminStore();

  const filters = globalFilters || {};

  const academicYearId = filters.academicYearId ?? null;
  const quarterId = filters.quarterId ?? null;
  const sectionId = filters.sectionId ?? null;

  const [selectedSchedule, setSelectedSchedule] = useState("");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  useEffect(() => {
    if (academicYearId && quarterId && sectionId) {
      fetchWeeklySchedule(sectionId, academicYearId, quarterId);
    }
  }, [academicYearId, quarterId, sectionId, fetchWeeklySchedule]);

  useEffect(() => {
    const savedSchedule = getItem("scheduleId", false);
    if (savedSchedule) setSelectedSchedule(savedSchedule);

    const savedDate = getItem("attendanceDate", false);
    if (savedDate) setSelectedDate(savedDate);
  }, []);

  useEffect(() => {
    if (selectedSchedule && selectedDate) {
      setItem("scheduleId", selectedSchedule);
      setItem("attendanceDate", selectedDate);
      fetchScheduleStudents(selectedSchedule, selectedDate);
    }
  }, [selectedSchedule, selectedDate, fetchScheduleStudents]);

  const handleMarkAllPresent = async () => {
    if (!selectedSchedule) return alert("Please select a schedule first");
    try {
      await updateAllStudentsAttendance({
        schedule_id: selectedSchedule,
        status: "Present",
        date: selectedDate,
      });
      fetchScheduleStudents(selectedSchedule, selectedDate);
    } catch (error) {
      console.error("Failed to mark all present:", error);
    }
  };

  const handleMarkAllAbsent = async () => {
    if (!selectedSchedule) return alert("Please select a schedule first");
    try {
      await updateAllStudentsAttendance({
        schedule_id: selectedSchedule,
        status: "Absent",
        date: selectedDate,
      });
      fetchScheduleStudents(selectedSchedule, selectedDate);
    } catch (error) {
      console.error("Failed to mark all absent:", error);
    }
  };

  const getScheduleDisplayName = (schedule) => {
    return `${schedule.subject?.name || "Subject"} - ${
      schedule.section?.name || "Section"
    } (${schedule.time_start || "?"}-${schedule.time_end || "?"})`;
  };

  return (
    <main className="p-4">
      <div className="between mb-6">
        <div>
          <h1 className="page-title">Daily Attendance</h1>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full font-medium">
              SF2
            </span>
          </div>
        </div>

        <div className="flex space-x-3">
          <button
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center disabled:opacity-50"
            onClick={handleMarkAllPresent}
            disabled={loading || !selectedSchedule}
          >
            <LuUsers size={15} />
            <span className="ml-2">Mark All Present</span>
          </button>

          <button
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center disabled:opacity-50"
            onClick={handleMarkAllAbsent}
            disabled={loading || !selectedSchedule}
          >
            <LuUsers size={15} />
            <span className="ml-2">Mark All Absent</span>
          </button>
        </div>
      </div>

      {/* Schedule and Date Selector */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Select Schedule & Date
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Schedule Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Schedule/Class
            </label>
            <select
              value={selectedSchedule}
              onChange={(e) => setSelectedSchedule(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">-- Select a Schedule --</option>
              {Array.isArray(weeklySchedule) && weeklySchedule.length > 0 ? (
                weeklySchedule.map((schedule) => (
                  <option key={schedule.id} value={schedule.id}>
                    {getScheduleDisplayName(schedule)}
                  </option>
                ))
              ) : (
                <option disabled>
                  No schedules available for this section
                </option>
              )}
            </select>
          </div>

          {/* Date Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Attendance Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-600 font-medium">Error</p>
          <p className="text-red-500 text-sm">{error}</p>
        </div>
      )}

      {selectedSchedule ? (
        <AttendanceTable selectedDate={selectedDate} />
      ) : (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
          <p className="text-gray-600 font-medium">
            Please select a schedule to view students
          </p>
          <p className="text-gray-500 text-sm mt-1">
            Choose a schedule from the dropdown above to start taking
            attendance.
          </p>
        </div>
      )}
    </main>
  );
};

export default DailyAttendance;
