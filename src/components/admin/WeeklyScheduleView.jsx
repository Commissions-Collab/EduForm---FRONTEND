import React, { useEffect, useState } from "react";
import {
  LuCalendar,
  LuClock,
  LuMapPin,
  LuBook,
  LuUsers,
  LuChevronLeft,
  LuChevronRight,
} from "react-icons/lu";
import { useAdminStore } from "../../stores/useAdminStore";
import { getItem, setItem } from "../../lib/utils";

const WeeklyScheduleView = ({ onScheduleClick }) => {
  const {
    fetchWeeklySchedule,
    weeklySchedule,
    loading,
    error,
    globalFilters,
    fetchGlobalFilterOptions,
    getCurrentFilters,
  } = useAdminStore();

  // Get current filters with fallbacks
  const currentFilters = getCurrentFilters();
  const academicYearId = currentFilters.academicYearId;
  const sectionId = currentFilters.sectionId;
  const quarterId = currentFilters.quarterId;

  const [currentWeekStart, setCurrentWeekStart] = useState(() => {
    const today = new Date();
    const monday = new Date(today);
    monday.setDate(today.getDate() - today.getDay() + 1);
    return monday;
  });

  // Initialize filters on component mount
  useEffect(() => {
    fetchGlobalFilterOptions();
  }, [fetchGlobalFilterOptions]);

  // Fetch schedule when filters or week changes
  useEffect(() => {
    if (academicYearId && sectionId) {
      const weekStart = currentWeekStart.toISOString().split("T")[0];
      console.log("Fetching schedule with:", {
        sectionId,
        academicYearId,
        quarterId,
        weekStart,
      });
      fetchWeeklySchedule(sectionId, academicYearId, quarterId, weekStart);
    }
  }, [
    academicYearId,
    sectionId,
    quarterId,
    currentWeekStart,
    fetchWeeklySchedule,
  ]);

  const navigateWeek = (direction) => {
    const newWeekStart = new Date(currentWeekStart);
    newWeekStart.setDate(
      currentWeekStart.getDate() + (direction === "next" ? 7 : -7)
    );
    setCurrentWeekStart(newWeekStart);
  };

  const formatWeekRange = () => {
    const weekEnd = new Date(currentWeekStart);
    weekEnd.setDate(currentWeekStart.getDate() + 6);

    const startStr = currentWeekStart.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    const endStr = weekEnd.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    return `${startStr} - ${endStr}`;
  };

  const handleScheduleClick = (schedule, date) => {
    setItem("selectedScheduleId", schedule.id);
    setItem("selectedDate", date);
    onScheduleClick && onScheduleClick(schedule, date);
  };

  const getDaySchedules = (dayName) => {
    if (!weeklySchedule?.schedule) return [];
    return weeklySchedule.schedule[dayName]?.classes || [];
  };

  const getScheduleCardColor = (subject) => {
    const colors = [
      "bg-blue-100 border-blue-300 text-blue-800",
      "bg-green-100 border-green-300 text-green-800",
      "bg-purple-100 border-purple-300 text-purple-800",
      "bg-orange-100 border-orange-300 text-orange-800",
      "bg-pink-100 border-pink-300 text-pink-800",
      "bg-indigo-100 border-indigo-300 text-indigo-800",
      "bg-red-100 border-red-300 text-red-800",
    ];
    const hash = (subject?.name || "").split("").reduce((a, b) => {
      a = (a << 5) - a + b.charCodeAt(0);
      return a & a;
    }, 0);
    return colors[Math.abs(hash) % colors.length];
  };

  const formatTime = (time) => {
    if (!time) return "";

    const [hour, minute] = time.split(":");
    const date = new Date();
    date.setHours(hour, minute);

    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  // Show loading message if no filters are set yet
  if (!academicYearId || !sectionId) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center py-8">
          <LuCalendar size={48} className="mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">
            Setting up your schedule...
          </h3>
          <p className="text-gray-500">
            Please wait while we load your academic year and section
            information.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Weekly Schedule
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Click on any class to manage attendance
          </p>
        </div>

        {/* Week Navigation */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigateWeek("prev")}
            className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
            title="Previous Week"
          >
            <LuChevronLeft size={16} />
          </button>

          <div className="flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-lg">
            <LuCalendar size={16} className="text-blue-600" />
            <span className="font-medium text-blue-800">
              {formatWeekRange()}
            </span>
          </div>

          <button
            onClick={() => navigateWeek("next")}
            className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
            title="Next Week"
          >
            <LuChevronRight size={16} />
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-600 font-medium">Error</p>
          <p className="text-red-500 text-sm">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-5 gap-4">
          {days.map((day) => (
            <div key={day} className="space-y-3">
              <div className="text-center p-3 bg-gray-100 rounded-t-lg">
                <div className="h-4 bg-gray-300 rounded animate-pulse"></div>
              </div>
              <div className="space-y-2">
                {[1, 2].map((i) => (
                  <div
                    key={i}
                    className="h-24 bg-gray-100 rounded animate-pulse"
                  ></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {days.map((day) => {
            const daySchedules = getDaySchedules(day);
            const dayInfo = weeklySchedule?.schedule?.[day];
            const dayDate = new Date(currentWeekStart);
            dayDate.setDate(currentWeekStart.getDate() + days.indexOf(day));

            return (
              <div key={day} className="space-y-3">
                {/* Day Header */}
                <div
                  className={`text-center p-3 rounded-t-lg ${
                    dayInfo?.is_class_day === false
                      ? "bg-red-100 text-red-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  <div className="font-semibold">{day}</div>
                  <div className="text-sm">
                    {dayDate.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                  {dayInfo?.calendar_event && (
                    <div className="text-xs mt-1 bg-yellow-200 text-yellow-800 px-2 py-1 rounded">
                      {dayInfo.calendar_event.title}
                    </div>
                  )}
                </div>

                {/* Schedule Cards */}
                <div className="space-y-2 min-h-[200px]">
                  {daySchedules.length > 0 ? (
                    daySchedules.map((schedule) => (
                      <div
                        key={schedule.id}
                        onClick={() =>
                          handleScheduleClick(schedule, dayInfo?.date)
                        }
                        className={`p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-105 ${getScheduleCardColor(
                          schedule.subject
                        )} ${
                          schedule.status === "cancelled" ? "opacity-50" : ""
                        }`}
                        title="Click to manage attendance"
                      >
                        {schedule.status === "cancelled" && (
                          <div className="text-xs bg-red-500 text-white px-2 py-1 rounded mb-2">
                            CANCELLED
                          </div>
                        )}

                        <div className="space-y-2">
                          <div className="flex items-start space-x-2">
                            <LuBook
                              size={14}
                              className="mt-0.5 flex-shrink-0"
                            />
                            <div className="text-sm font-semibold leading-tight">
                              {schedule.subject?.name || "Unknown Subject"}
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            <LuUsers size={12} />
                            <div className="text-xs">
                              {schedule.section?.name || "Unknown Section"}
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            <LuClock size={12} />
                            <div className="text-xs">
                              {formatTime(schedule.time_start)} -{" "}
                              {formatTime(schedule.time_end)}
                            </div>
                          </div>

                          {schedule.room && (
                            <div className="flex items-center space-x-2">
                              <LuMapPin size={12} />
                              <div className="text-xs">{schedule.room}</div>
                            </div>
                          )}

                          {schedule.exception &&
                            schedule.exception.type === "rescheduled" && (
                              <div className="text-xs bg-yellow-500 text-white px-2 py-1 rounded">
                                Rescheduled:{" "}
                                {schedule.exception.new_time?.start} -{" "}
                                {schedule.exception.new_time?.end}
                                {schedule.exception.new_room &&
                                  ` | Room: ${schedule.exception.new_room}`}
                              </div>
                            )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-gray-400 p-4">
                      <LuCalendar
                        size={24}
                        className="mx-auto mb-2 opacity-50"
                      />
                      <div className="text-sm">No classes scheduled</div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Summary */}
      {weeklySchedule?.schedules && weeklySchedule.schedules.length > 0 && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <div className="text-sm text-blue-700">
            <strong>Week Summary:</strong> {weeklySchedule.schedules.length}{" "}
            classes scheduled
            {weeklySchedule.calendar_events &&
              weeklySchedule.calendar_events.length > 0 && (
                <span>
                  {" "}
                  | {weeklySchedule.calendar_events.length} special events
                </span>
              )}
          </div>
        </div>
      )}
    </div>
  );
};

export default WeeklyScheduleView;
