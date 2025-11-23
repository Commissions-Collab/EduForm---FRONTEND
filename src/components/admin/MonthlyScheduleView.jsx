import React, { useEffect, useState } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import toast from "react-hot-toast";
import { setItem } from "../../lib/utils";
import useAttendanceStore from "../../stores/admin/attendanceStore";
import useFilterStore from "../../stores/admin/filterStore";

const MonthlyScheduleView = ({ onScheduleClick }) => {
  const { fetchMonthlySchedule, monthlySchedule, loading, error } =
    useAttendanceStore();
  const { globalFilters } = useFilterStore();

  const academicYearId = globalFilters?.academicYearId;
  const sectionId = globalFilters?.sectionId;
  const quarterId = globalFilters?.quarterId;

  const [currentMonth, setCurrentMonth] = useState(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });

  useEffect(() => {
    if (academicYearId && sectionId && quarterId) {
      if (!(currentMonth instanceof Date) || isNaN(currentMonth)) {
        toast.error("Invalid month date");
        return;
      }

      // FIX: Properly format the first day of the month in local time
      const year = currentMonth.getFullYear();
      const month = String(currentMonth.getMonth() + 1).padStart(2, "0");
      const monthStart = `${year}-${month}-01`;

      console.log("Fetching monthly schedule:", {
        sectionId,
        academicYearId,
        quarterId,
        monthStart,
        currentMonthInfo: {
          year,
          month,
          toString: currentMonth.toString(),
        },
      });
      fetchMonthlySchedule(sectionId, academicYearId, quarterId, monthStart);
    }
  }, [
    academicYearId,
    sectionId,
    quarterId,
    currentMonth,
    fetchMonthlySchedule,
  ]);

  // Debug: Log monthlySchedule when it changes
  useEffect(() => {
    console.log("Monthly Schedule Data:", monthlySchedule);
    if (monthlySchedule) {
      const keys = Object.keys(monthlySchedule);
      console.log("Schedule object keys:", keys);
      console.log("First 5 date keys:", keys.slice(0, 5));
      console.log("Last 5 date keys:", keys.slice(-5));
      console.log("Sample schedule entry:", Object.values(monthlySchedule)[0]);
    }
  }, [monthlySchedule]);

  useEffect(() => {
    if (error) {
      toast.error(`Failed to load schedule: ${error}`, {
        duration: 5000,
      });
    }
  }, [error]);

  const navigateMonth = (direction) => {
    const newMonth = new Date(currentMonth);
    if (direction === "next") {
      newMonth.setMonth(currentMonth.getMonth() + 1);
    } else {
      newMonth.setMonth(currentMonth.getMonth() - 1);
    }
    setCurrentMonth(newMonth);
  };

  const formatMonthYear = () => {
    return currentMonth.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  };

  const getDaysInMonth = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const days = [];
    const startPadding = firstDay.getDay(); // 0 = Sunday, 6 = Saturday

    // Add padding days from previous month
    for (let i = 0; i < startPadding; i++) {
      days.push(null);
    }

    // Add days of current month
    for (let day = 1; day <= lastDay.getDate(); day++) {
      const date = new Date(year, month, day);
      days.push(date);
    }

    return days;
  };
  const handleScheduleClick = (schedule, date) => {
    const dateStr = date.toISOString().split("T")[0];
    console.log("Schedule clicked:", schedule, dateStr);
    setItem("selectedScheduleId", schedule.id);
    setItem("selectedDate", dateStr);
    onScheduleClick && onScheduleClick(schedule, dateStr);
  };
  const getDaySchedules = (date) => {
    if (!date || !monthlySchedule) {
      return [];
    }

    // FIX: Use local date instead of ISO to avoid timezone issues
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const dateKey = `${year}-${month}-${day}`;

    const dayData = monthlySchedule[dateKey];

    if (!dayData) {
      console.log(
        `No data for ${dateKey}, day of week: ${date.toLocaleDateString(
          "en-US",
          { weekday: "long" }
        )}`
      );
      return [];
    }

    return dayData.classes || [];
  };

  const isClassDay = (date) => {
    if (!date || !monthlySchedule) return true;

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const dateKey = `${year}-${month}-${day}`;
    const dayData = monthlySchedule[dateKey]; // <-- Direct access, no fallback

    return dayData?.is_class_day !== false;
  };

  const getCalendarEvent = (date) => {
    if (!date || !monthlySchedule) return null;

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const dateKey = `${year}-${month}-${day}`;
    const dayData = monthlySchedule[dateKey]; // <-- Direct access, no fallback

    return dayData?.calendar_event || null;
  };

  const isToday = (date) => {
    if (!date) return false;
    const today = new Date();
    return date.toDateString() === today.toDateString();
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

  const days = getDaysInMonth();
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Calculate total classes by counting all classes across all days
  const totalClasses = monthlySchedule
    ? Object.values(monthlySchedule).reduce((total, dayData) => {
        return total + (dayData?.classes?.length || 0);
      }, 0)
    : 0;

  // Get calendar events - no longer available in monthlySchedule
  const calendarEvents = [];

  if (!academicYearId || !sectionId) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
        <div className="text-center py-6 sm:py-8">
          <Calendar
            size={40}
            className="mx-auto mb-4 text-gray-400 sm:w-12 sm:h-12"
          />
          <h3 className="text-base sm:text-lg font-medium text-gray-600 mb-2">
            Please select filters
          </h3>
          <p className="text-sm sm:text-base text-gray-500">
            Select an Academic Year and Section from the header to view the
            schedule.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 sm:mb-6">
        <div>
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
            Monthly Schedule
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            Click on any class to manage attendance
          </p>
        </div>

        {/* Month Navigation */}
        <div className="flex items-center justify-center sm:justify-end space-x-2 sm:space-x-4">
          <button
            onClick={() => navigateMonth("prev")}
            className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
            title="Previous Month"
          >
            <ChevronLeft size={16} />
          </button>

          <div className="flex items-center space-x-2 bg-blue-50 px-3 sm:px-4 py-2 rounded-lg">
            <Calendar size={14} className="text-blue-600 hidden sm:block" />
            <span className="font-medium text-blue-800 text-xs sm:text-sm">
              {formatMonthYear()}
            </span>
          </div>

          <button
            onClick={() => navigateMonth("next")}
            className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
            title="Next Month"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 sm:mb-6">
          <p className="text-red-600 font-medium text-sm sm:text-base">
            Failed to load schedule
          </p>
          <p className="text-red-500 text-xs sm:text-sm">{error}</p>
          <button
            onClick={() => {
              if (academicYearId && sectionId) {
                const monthStart = currentMonth.toISOString().split("T")[0];
                if (!/^\d{4}-\d{2}-\d{2}$/.test(monthStart)) {
                  toast.error("Invalid month start date format");
                  return;
                }
                fetchMonthlySchedule(
                  sectionId,
                  academicYearId,
                  quarterId,
                  monthStart
                );
              }
            }}
            className="mt-2 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-7 gap-2">
          {weekDays.map((day) => (
            <div
              key={day}
              className="text-center p-2 bg-gray-100 rounded font-semibold text-xs sm:text-sm"
            >
              {day}
            </div>
          ))}
          {Array.from({ length: 35 }).map((_, i) => (
            <div
              key={i}
              className="aspect-square bg-gray-100 rounded animate-pulse"
            ></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-7 gap-1 sm:gap-2">
          {/* Week day headers */}
          {weekDays.map((day) => (
            <div
              key={day}
              className="text-center p-2 bg-gray-100 rounded font-semibold text-xs sm:text-sm text-gray-700"
            >
              {day}
            </div>
          ))}

          {/* Calendar days */}
          {days.map((date, index) => {
            const daySchedules = getDaySchedules(date);
            const classDay = isClassDay(date);
            const calendarEvent = getCalendarEvent(date);
            const today = isToday(date);

            return (
              <div
                key={index}
                className={`min-h-[80px] sm:min-h-[120px] border rounded-lg p-1 sm:p-2 ${
                  !date
                    ? "bg-gray-50"
                    : !classDay
                    ? "bg-red-50 border-red-200"
                    : today
                    ? "bg-blue-50 border-blue-300"
                    : "bg-white hover:bg-gray-50"
                } transition-colors`}
              >
                {date && (
                  <>
                    <div
                      className={`text-xs sm:text-sm font-semibold mb-1 ${
                        today ? "text-blue-600" : "text-gray-700"
                      }`}
                    >
                      {date.getDate()}
                    </div>

                    {calendarEvent && (
                      <div className="text-[10px] bg-yellow-200 text-yellow-800 px-1 py-0.5 rounded mb-1 truncate">
                        {calendarEvent.title}
                      </div>
                    )}

                    <div className="space-y-1 overflow-y-auto max-h-[60px] sm:max-h-[90px]">
                      {daySchedules.length > 0 ? (
                        daySchedules.map((schedule, idx) => {
                          return (
                            <div
                              key={schedule.id || idx}
                              onClick={() =>
                                handleScheduleClick(schedule, date)
                              }
                              className={`p-1 rounded border cursor-pointer transition-all hover:shadow-md ${getScheduleCardColor(
                                schedule.subject
                              )} ${
                                schedule.status === "cancelled"
                                  ? "opacity-50"
                                  : ""
                              }`}
                              title="Click to manage attendance"
                            >
                              {schedule.status === "cancelled" && (
                                <div className="text-[8px] bg-red-500 text-white px-1 rounded mb-0.5">
                                  CANCELLED
                                </div>
                              )}

                              <div className="text-[10px] sm:text-xs font-semibold truncate">
                                {schedule.subject?.name || "Unknown Subject"}
                              </div>
                              <div className="flex items-center space-x-1 text-[8px] sm:text-[10px]">
                                <Clock size={8} className="hidden sm:block" />
                                <span className="truncate">
                                  {formatTime(schedule.time_start)}
                                </span>
                              </div>
                              {schedule.room && (
                                <div className="flex items-center space-x-1 text-[8px] sm:text-[10px]">
                                  <MapPin
                                    size={8}
                                    className="hidden sm:block"
                                  />
                                  <span className="truncate">
                                    {schedule.room}
                                  </span>
                                </div>
                              )}
                            </div>
                          );
                        })
                      ) : classDay ? (
                        <div className="text-[10px] text-gray-400 text-center py-2">
                          No classes
                        </div>
                      ) : (
                        <div className="text-[10px] text-red-600 text-center py-2">
                          No class day
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Summary */}
      {totalClasses > 0 && (
        <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-blue-50 rounded-lg">
          <div className="text-xs sm:text-sm text-blue-700">
            <strong>Month Summary:</strong> {totalClasses} classes scheduled
            {calendarEvents.length > 0 && (
              <span> | {calendarEvents.length} special events</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MonthlyScheduleView;
