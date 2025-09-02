import React, { useState, useEffect, useMemo } from "react";

import {
  CalendarDays,
  Plus,
  Trash2,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { useSuperAdminStore } from "../../stores/superAdmin";

const Calendar = () => {
  const {
    academicCalendar,
    academicYears,
    fetchAcademicCalendar,
    fetchAcademicYears,
    fetchCalendarByYear,
    createCalendarEntry,
    updateCalendarEntry,
    deleteCalendarEntry,
    fetchCurrentAcademicYear,
  } = useSuperAdminStore();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [selectedAcademicYear, setSelectedAcademicYear] = useState(null);
  const [eventTypeFilter, setEventTypeFilter] = useState("all");

  const [eventForm, setEventForm] = useState({
    academic_year_id: "",
    date: "",
    type: "regular",
    title: "",
    description: "",
    is_class_day: true,
  });

  const eventTypes = [
    { value: "regular", label: "Regular Day", color: "bg-blue-500" },
    { value: "holiday", label: "Holiday", color: "bg-red-500" },
    { value: "exam", label: "Exam", color: "bg-yellow-500" },
    { value: "no_class", label: "No Class", color: "bg-gray-500" },
    { value: "special_event", label: "Special Event", color: "bg-purple-500" },
  ];

  // Load initial data
  useEffect(() => {
    const init = async () => {
      await fetchAcademicYears();
      const currentYear = await fetchCurrentAcademicYear();
      if (currentYear?.id) {
        setSelectedAcademicYear(currentYear.id);
        setEventForm((prev) => ({ ...prev, academic_year_id: currentYear.id }));
        fetchCalendarByYear(currentYear.id);
      } else {
        fetchAcademicCalendar();
      }
    };
    init();
  }, []);

  // Fetch calendar when academic year changes
  useEffect(() => {
    if (selectedAcademicYear) {
      fetchCalendarByYear(selectedAcademicYear);
    } else {
      fetchAcademicCalendar();
    }
  }, [selectedAcademicYear]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const firstDayOfWeek = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();

  const filteredEvents = useMemo(() => {
    let filtered = academicCalendar || [];
    if (eventTypeFilter !== "all") {
      filtered = filtered.filter((e) => e.type === eventTypeFilter);
    }
    return filtered;
  }, [academicCalendar, eventTypeFilter]);

  const getEventsForDate = (date) => {
    const dateStr = date.toISOString().split("T")[0];
    return filteredEvents.filter((e) => e.date === dateStr);
  };

  const handleDateClick = (day) => {
    const date = new Date(year, month, day);
    setSelectedDate(date);
    setEventForm((prev) => ({
      ...prev,
      date: date.toISOString().split("T")[0],
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
      await updateCalendarEntry(editingEvent.id, eventForm);
    } else {
      await createCalendarEntry(eventForm);
    }
    closeEventModal();
    if (selectedAcademicYear) fetchCalendarByYear(selectedAcademicYear);
    else fetchAcademicCalendar();
  };

  const handleDeleteEvent = async (id) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      await deleteCalendarEntry(id);
      if (selectedAcademicYear) fetchCalendarByYear(selectedAcademicYear);
      else fetchAcademicCalendar();
    }
  };

  const goToPreviousMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const goToNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const goToToday = () => setCurrentDate(new Date());

  const getEventTypeConfig = (type) =>
    eventTypes.find((et) => et.value === type) || eventTypes[0];

  const calendarDays = [];

  // Previous month
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const day = new Date(year, month - 1, lastDayOfMonth.getDate() - i);
    calendarDays.push({ date: day, isCurrentMonth: false });
  }
  // Current month
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    calendarDays.push({ date, isCurrentMonth: true });
  }
  // Next month to fill grid
  const remainingDays = 42 - calendarDays.length;
  for (let day = 1; day <= remainingDays; day++) {
    const date = new Date(year, month + 1, day);
    calendarDays.push({ date, isCurrentMonth: false });
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <CalendarDays className="h-8 w-8 text-blue-600" /> Academic
              Calendar
            </h1>
            <p className="text-gray-600 mt-2">
              Manage academic events and schedules
            </p>
          </div>
          <button
            onClick={() => openEventModal()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <Plus className="h-4 w-4" /> Add Event
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6 flex flex-wrap items-center gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Academic Year
            </label>
            <select
              value={selectedAcademicYear || ""}
              onChange={(e) => setSelectedAcademicYear(e.target.value || null)}
              className="border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="">All Years</option>
              {academicYears.map((year) => (
                <option key={year.id} value={year.id}>
                  {year.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Event Type
            </label>
            <select
              value={eventTypeFilter}
              onChange={(e) => setEventTypeFilter(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="all">All Types</option>
              {eventTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div className="ml-auto">
            <button
              onClick={goToToday}
              className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-md"
            >
              Today
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b">
            <button
              onClick={goToPreviousMonth}
              className="p-2 hover:bg-gray-100 rounded-md"
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
              className="p-2 hover:bg-gray-100 rounded-md"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          {/* Days of week */}
          <div className="grid grid-cols-7 border-b">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
              <div
                key={d}
                className="p-4 text-center text-sm font-medium text-gray-500"
              >
                {d}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7">
            {calendarDays.map(({ date, isCurrentMonth }, idx) => {
              const events = getEventsForDate(date);
              const isToday = date.toDateString() === new Date().toDateString();
              const isSelected =
                selectedDate &&
                date.toDateString() === selectedDate.toDateString();
              return (
                <div
                  key={idx}
                  className={`min-h-[120px] p-2 border-b border-r cursor-pointer ${
                    isCurrentMonth ? "bg-white hover:bg-gray-50" : "bg-gray-50"
                  } ${isSelected ? "bg-blue-50" : ""}`}
                  onClick={() =>
                    isCurrentMonth && handleDateClick(date.getDate())
                  }
                >
                  <div
                    className={`${isToday ? "text-blue-600 font-bold" : ""}`}
                  >
                    {date.getDate()}
                  </div>
                  <div className="space-y-1">
                    {events.slice(0, 3).map((event) => (
                      <div
                        key={event.id}
                        className={`text-xs p-1 rounded text-white truncate cursor-pointer ${
                          getEventTypeConfig(event.type).color
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          openEventModal(event);
                        }}
                        title={event.title || event.type}
                      >
                        {event.title || event.type}
                      </div>
                    ))}
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
                  {editingEvent ? "Edit Event" : "Add Event"}
                </h3>
                <button
                  onClick={closeEventModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <form onSubmit={handleSubmitEvent} className="p-6 space-y-4">
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
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="">Select Academic Year</option>
                    {academicYears.map((year) => (
                      <option key={year.id} value={year.id}>
                        {year.name}
                      </option>
                    ))}
                  </select>
                </div>

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
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>

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
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    {eventTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

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
                    placeholder="Optional"
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>

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
                    rows={3}
                    placeholder="Optional"
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>

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
                    className="h-4 w-4"
                  />
                  <label htmlFor="is_class_day" className="ml-2 text-sm">
                    This is a class day
                  </label>
                </div>

                <div className="flex items-center justify-between pt-4">
                  {editingEvent && (
                    <button
                      type="button"
                      onClick={() => handleDeleteEvent(editingEvent.id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
                    >
                      <Trash2 className="h-4 w-4 inline" /> Delete
                    </button>
                  )}

                  <div className="ml-auto flex gap-2">
                    <button
                      type="button"
                      onClick={closeEventModal}
                      className="px-4 py-2 rounded-md border"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                    >
                      {editingEvent ? "Update" : "Create"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Calendar;
