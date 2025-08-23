import React, { useState, useEffect, useMemo } from "react";
import { useSuperAdminStore } from "../../stores/useSuperAdminStore";
import {
  CalendarDays,
  Plus,
  Edit2,
  Trash2,
  Filter,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";

const Calendar = () => {
  const {
    academicCalendars,
    academicYears,
    currentAcademicYear,
    fetchAcademicCalendar,
    fetchAcademicYears,
    getCurrentAcademicYear,
    fetchAcademicCalendarByYear,
    createAcademicCalendarEvent,
    updateAcademicCalendarEvent,
    deleteAcademicCalendarEvent,
    isLoading,
    isCreating,
    isUpdating,
    isDeleting,
  } = useSuperAdminStore();

  // Calendar state
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [selectedAcademicYear, setSelectedAcademicYear] = useState(null);
  const [eventTypeFilter, setEventTypeFilter] = useState("all");

  // Form state
  const [eventForm, setEventForm] = useState({
    academic_year_id: "",
    date: "",
    type: "regular",
    title: "",
    description: "",
    is_class_day: true,
  });

  // Event types configuration
  const eventTypes = [
    {
      value: "regular",
      label: "Regular Day",
      color: "bg-blue-500",
      textColor: "text-blue-700",
    },
    {
      value: "holiday",
      label: "Holiday",
      color: "bg-red-500",
      textColor: "text-red-700",
    },
    {
      value: "exam",
      label: "Exam",
      color: "bg-yellow-500",
      textColor: "text-yellow-700",
    },
    {
      value: "no_class",
      label: "No Class",
      color: "bg-gray-500",
      textColor: "text-gray-700",
    },
    {
      value: "special_event",
      label: "Special Event",
      color: "bg-purple-500",
      textColor: "text-purple-700",
    },
  ];

  // Initialize data
  useEffect(() => {
    const initializeData = async () => {
      await fetchAcademicYears();
      await getCurrentAcademicYear();
    };
    initializeData();
  }, []);

  // Set default academic year
  useEffect(() => {
    if (currentAcademicYear && !selectedAcademicYear) {
      setSelectedAcademicYear(currentAcademicYear.id);
      setEventForm((prev) => ({
        ...prev,
        academic_year_id: currentAcademicYear.id,
      }));
    }
  }, [currentAcademicYear, selectedAcademicYear]);

  // Fetch calendar events when academic year changes
  useEffect(() => {
    if (selectedAcademicYear) {
      fetchAcademicCalendarByYear(selectedAcademicYear);
    } else {
      fetchAcademicCalendar();
    }
  }, [selectedAcademicYear]);

  // Calendar calculations
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const firstDayOfWeek = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();

  // Filter events
  const filteredEvents = useMemo(() => {
    let filtered = academicCalendars;

    if (eventTypeFilter !== "all") {
      filtered = filtered.filter((event) => event.type === eventTypeFilter);
    }

    return filtered;
  }, [academicCalendars, eventTypeFilter]);

  // Get events for a specific date
  const getEventsForDate = (date) => {
    const dateStr = date.toISOString().split("T")[0];
    return filteredEvents.filter((event) => event.date === dateStr);
  };

  // Calendar navigation
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Event handlers
  const handleDateClick = (day) => {
    const clickedDate = new Date(year, month, day);
    setSelectedDate(clickedDate);
    setEventForm((prev) => ({
      ...prev,
      date: clickedDate.toISOString().split("T")[0],
    }));
  };

  const openEventModal = (event = null) => {
    if (event) {
      setEditingEvent(event);
      setEventForm({
        academic_year_id: event.academic_year_id,
        date: event.date,
        type: event.type,
        title: event.title || "",
        description: event.description || "",
        is_class_day: event.is_class_day,
      });
    } else {
      setEditingEvent(null);
      setEventForm({
        academic_year_id: selectedAcademicYear || "",
        date: selectedDate ? selectedDate.toISOString().split("T")[0] : "",
        type: "regular",
        title: "",
        description: "",
        is_class_day: true,
      });
    }
    setShowEventModal(true);
  };

  const closeEventModal = () => {
    setShowEventModal(false);
    setEditingEvent(null);
    setSelectedDate(null);
  };

  const handleSubmitEvent = async (e) => {
    e.preventDefault();

    if (editingEvent) {
      await updateAcademicCalendarEvent(editingEvent.id, eventForm);
    } else {
      await createAcademicCalendarEvent(eventForm);
    }

    closeEventModal();
  };

  const handleDeleteEvent = async (eventId) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      await deleteAcademicCalendarEvent(eventId);
    }
  };

  const getEventTypeConfig = (type) => {
    return eventTypes.find((et) => et.value === type) || eventTypes[0];
  };

  // Generate calendar days
  const calendarDays = [];

  // Previous month days
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const day = new Date(year, month - 1, lastDayOfMonth.getDate() - i);
    calendarDays.push({ date: day, isCurrentMonth: false });
  }

  // Current month days
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    calendarDays.push({ date, isCurrentMonth: true });
  }

  // Next month days to complete the grid
  const remainingDays = 42 - calendarDays.length;
  for (let day = 1; day <= remainingDays; day++) {
    const date = new Date(year, month + 1, day);
    calendarDays.push({ date, isCurrentMonth: false });
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <CalendarDays className="h-8 w-8 text-blue-600" />
                Academic Calendar
              </h1>
              <p className="text-gray-600 mt-2">
                Manage academic events and schedules
              </p>
            </div>
            <button
              onClick={() => openEventModal()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Add Event
            </button>
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <div className="flex flex-wrap items-center gap-4">
            {/* Academic Year Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Academic Year
              </label>
              <select
                value={selectedAcademicYear || ""}
                onChange={(e) =>
                  setSelectedAcademicYear(e.target.value || null)
                }
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Years</option>
                {academicYears.map((year) => (
                  <option key={year.id} value={year.id}>
                    {year.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Event Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Event Type
              </label>
              <select
                value={eventTypeFilter}
                onChange={(e) => setEventTypeFilter(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Types</option>
                {eventTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Today Button */}
            <div className="ml-auto">
              <button
                onClick={goToToday}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm transition-colors"
              >
                Today
              </button>
            </div>
          </div>
        </div>

        {/* Calendar */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Calendar Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <button
              onClick={goToPreviousMonth}
              className="p-2 hover:bg-gray-100 rounded-md transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <h2 className="text-xl font-semibold text-gray-900">
              {currentDate.toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </h2>

            <button
              onClick={goToNextMonth}
              className="p-2 hover:bg-gray-100 rounded-md transition-colors"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          {/* Days of Week */}
          <div className="grid grid-cols-7 border-b">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div
                key={day}
                className="p-4 text-center text-sm font-medium text-gray-500"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7">
            {calendarDays.map(({ date, isCurrentMonth }, index) => {
              const events = getEventsForDate(date);
              const isToday = date.toDateString() === new Date().toDateString();
              const isSelected =
                selectedDate &&
                date.toDateString() === selectedDate.toDateString();

              return (
                <div
                  key={index}
                  className={`min-h-[120px] p-2 border-b border-r cursor-pointer transition-colors ${
                    isCurrentMonth ? "bg-white hover:bg-gray-50" : "bg-gray-50"
                  } ${isSelected ? "bg-blue-50" : ""}`}
                  onClick={() =>
                    isCurrentMonth && handleDateClick(date.getDate())
                  }
                >
                  <div
                    className={`text-sm font-medium mb-2 ${
                      isCurrentMonth ? "text-gray-900" : "text-gray-400"
                    } ${isToday ? "text-blue-600 font-bold" : ""}`}
                  >
                    {date.getDate()}
                  </div>

                  <div className="space-y-1">
                    {events.slice(0, 3).map((event) => {
                      const typeConfig = getEventTypeConfig(event.type);
                      return (
                        <div
                          key={event.id}
                          className={`text-xs p-1 rounded text-white truncate cursor-pointer ${typeConfig.color}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            openEventModal(event);
                          }}
                          title={event.title || typeConfig.label}
                        >
                          {event.title || typeConfig.label}
                        </div>
                      );
                    })}

                    {events.length > 3 && (
                      <div className="text-xs text-gray-500">
                        +{events.length - 3} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Event Modal */}
        {showEventModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
              <div className="flex items-center justify-between p-6 border-b">
                <h3 className="text-lg font-semibold">
                  {editingEvent ? "Edit Event" : "Add New Event"}
                </h3>
                <button
                  onClick={closeEventModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div onSubmit={handleSubmitEvent} className="p-6 space-y-4">
                {/* Academic Year */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Academic Year *
                  </label>
                  <select
                    value={eventForm.academic_year_id}
                    onChange={(e) =>
                      setEventForm((prev) => ({
                        ...prev,
                        academic_year_id: e.target.value,
                      }))
                    }
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Academic Year</option>
                    {academicYears.map((year) => (
                      <option key={year.id} value={year.id}>
                        {year.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date *
                  </label>
                  <input
                    type="date"
                    value={eventForm.date}
                    onChange={(e) =>
                      setEventForm((prev) => ({
                        ...prev,
                        date: e.target.value,
                      }))
                    }
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Event Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Event Type *
                  </label>
                  <select
                    value={eventForm.type}
                    onChange={(e) =>
                      setEventForm((prev) => ({
                        ...prev,
                        type: e.target.value,
                      }))
                    }
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {eventTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={eventForm.title}
                    onChange={(e) =>
                      setEventForm((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                    placeholder="Event title (optional)"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={eventForm.description}
                    onChange={(e) =>
                      setEventForm((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    placeholder="Event description (optional)"
                    rows={3}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Is Class Day */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_class_day"
                    checked={eventForm.is_class_day}
                    onChange={(e) =>
                      setEventForm((prev) => ({
                        ...prev,
                        is_class_day: e.target.checked,
                      }))
                    }
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="is_class_day"
                    className="ml-2 text-sm text-gray-700"
                  >
                    This is a class day
                  </label>
                </div>

                {/* Form Actions */}
                <div className="flex items-center justify-between pt-4">
                  {editingEvent && (
                    <button
                      type="button"
                      onClick={() => handleDeleteEvent(editingEvent.id)}
                      disabled={isDeleting}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md flex items-center gap-2 disabled:opacity-50"
                    >
                      <Trash2 className="h-4 w-4" />
                      {isDeleting ? "Deleting..." : "Delete"}
                    </button>
                  )}

                  <div className="flex items-center gap-2 ml-auto">
                    <button
                      type="button"
                      onClick={closeEventModal}
                      className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSubmitEvent}
                      disabled={isCreating || isUpdating}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md disabled:opacity-50"
                    >
                      {isCreating || isUpdating
                        ? "Saving..."
                        : editingEvent
                        ? "Update"
                        : "Create"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Calendar;
