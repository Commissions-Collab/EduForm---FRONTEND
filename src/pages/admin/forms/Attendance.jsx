import React, { useEffect, useState } from "react";
import { LuUsers, LuCalendar } from "react-icons/lu";
import { getItem, setItem } from "../../../lib/utils";
import { useAdminStore } from "../../../stores/useAdminStore";
import AttendanceTable from "../../../components/admin/AttendanceTable";

const DailyAttendance = () => {
  const {
    fetchScheduleStudents,
    updateAllStudentsAttendance,
    fetchWeeklySchedule,
    weeklySchedule = [],
    loading,
    error,
  } = useAdminStore();

  const [selectedSchedule, setSelectedSchedule] = useState("");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  useEffect(() => {
    // Fetch teacher's weekly schedule when component mounts
    fetchWeeklySchedule();

    // Get previously selected schedule from localStorage
    const savedSchedule = getItem("scheduleId", false);
    if (savedSchedule) {
      setSelectedSchedule(savedSchedule);
    }
  }, [fetchWeeklySchedule]);

  useEffect(() => {
    // Fetch students when schedule is selected
    if (selectedSchedule) {
      setItem("scheduleId", selectedSchedule);
      fetchScheduleStudents();
    }
  }, [selectedSchedule, fetchScheduleStudents]);

  const handleScheduleChange = (scheduleId) => {
    setSelectedSchedule(scheduleId);
    setItem("scheduleId", scheduleId);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setItem("attendanceDate", date);
  };

  const handleMarkAllPresent = async () => {
    if (!selectedSchedule) {
      alert("Please select a schedule first");
      return;
    }

    try {
      await updateAllStudentsAttendance({
        schedule_id: selectedSchedule,
        status: "Present",
        date: selectedDate,
      });
      // Refresh the data after update
      fetchScheduleStudents();
    } catch (error) {
      console.error("Failed to mark all present:", error);
    }
  };

  const handleMarkAllAbsent = async () => {
    if (!selectedSchedule) {
      alert("Please select a schedule first");
      return;
    }

    try {
      await updateAllStudentsAttendance({
        schedule_id: selectedSchedule,
        status: "Absent",
        date: selectedDate,
      });
      fetchScheduleStudents();
    } catch (error) {
      console.error("Failed to mark all absent:", error);
    }
  };

  const getScheduleDisplayName = (schedule) => {
    return `${schedule.subject?.name || "Subject"} - ${
      schedule.section?.name || "Section"
    } (${schedule.time_start}-${schedule.time_end})`;
  };

  return (
    <main className="p-4">
      <div className="between mb-6">
        <div>
          <div>
            <h1 className="page-title">Daily Attendance </h1>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="px-2 py-1 bg-blue-100 text-blue-800  rounded-full font-medium">
                SF2
              </span>
            </div>
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
              onChange={(e) => handleScheduleChange(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-gray-700 disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
            >
              <option value="">-- Select a Schedule --</option>
              {Array.isArray(weeklySchedule) &&
                weeklySchedule.map((schedule) => (
                  <option key={schedule.id} value={schedule.id}>
                    {getScheduleDisplayName(schedule)}
                  </option>
                ))}
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
              onChange={(e) => handleDateChange(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-gray-700 disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
            />
          </div>
        </div>

        {/* Selected Schedule Info */}
        {selectedSchedule && weeklySchedule && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            {(() => {
              const selected = weeklySchedule.find(
                (s) => s.id.toString() === selectedSchedule
              );
              return selected ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Subject:</span>
                    <span className="ml-2 text-gray-900">
                      {selected.subject?.name}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Section:</span>
                    <span className="ml-2 text-gray-900">
                      {selected.section?.name}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Time:</span>
                    <span className="ml-2 text-gray-900">
                      {selected.time_start} - {selected.time_end}
                    </span>
                  </div>
                </div>
              ) : null;
            })()}
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-600 font-medium">Error</p>
          <p className="text-red-500 text-sm">{error}</p>
        </div>
      )}

      {/* Attendance Table - Only show if schedule is selected */}
      {selectedSchedule ? (
        <AttendanceTable />
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
