import React, { useEffect, useState } from "react";
import {
  CalendarDays,
  Plus,
  RefreshCcw,
  BadgeAlert,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import useAcademicCalendarStore from "../../stores/superAdmin/calendarStore";
import useClassManagementStore from "../../stores/superAdmin/classManagementStore";

// Mini Calendar Component
const MiniCalendar = ({ events, onDateClick }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();
  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const getDaysArray = () => {
    const days = [];

    // Empty cells for days before month starts
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days;
  };

  const hasEvent = (day) => {
    if (!day) return false;
    const dateStr = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    ).toDateString();
    return events.some(
      (event) => new Date(event.date).toDateString() === dateStr
    );
  };

  const getEventsForDay = (day) => {
    if (!day) return [];
    const dateStr = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    ).toDateString();
    return events.filter(
      (event) => new Date(event.date).toDateString() === dateStr
    );
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          {months[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h3>
        <div className="flex space-x-1">
          <button
            onClick={() => navigateMonth(-1)}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => navigateMonth(1)}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {daysOfWeek.map((day) => (
          <div
            key={day}
            className="p-2 text-center text-xs font-medium text-gray-500"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {getDaysArray().map((day, index) => (
          <div key={index} className="relative">
            {day ? (
              <button
                onClick={() => {
                  const clickedEvents = getEventsForDay(day);
                  if (clickedEvents.length > 0) {
                    onDateClick(clickedEvents[0]);
                  }
                }}
                className={`w-full p-2 text-sm text-center rounded transition-colors ${
                  hasEvent(day)
                    ? "bg-indigo-100 text-indigo-800 hover:bg-indigo-200"
                    : "hover:bg-gray-100"
                }`}
              >
                {day}
                {hasEvent(day) && (
                  <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
                    <div className="w-1 h-1 bg-indigo-600 rounded-full"></div>
                  </div>
                )}
              </button>
            ) : (
              <div className="w-full p-2"></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// Event List Component
const CalendarEventList = ({
  events,
  currentPage,
  totalPages,
  onPageChange,
  onEdit,
  onDelete,
}) => {
  const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const getVisiblePages = () => {
      const pages = [];
      const maxVisible = 5;
      let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
      let end = Math.min(totalPages, start + maxVisible - 1);

      if (end - start < maxVisible - 1) {
        start = Math.max(1, end - maxVisible + 1);
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      return pages;
    };

    if (totalPages <= 1) return null;

    return (
      <div className="flex items-center justify-center space-x-2 mt-4">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 text-sm border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
        >
          Previous
        </button>

        {getVisiblePages().map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-3 py-1 text-sm rounded-md ${
              page === currentPage
                ? "bg-indigo-600 text-white"
                : "border hover:bg-gray-50"
            }`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 text-sm border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
        >
          Next
        </button>
      </div>
    );
  };

  const getTypeColor = (type) => {
    const colors = {
      holiday: "bg-red-100 text-red-800",
      exam: "bg-yellow-100 text-yellow-800",
      no_class: "bg-gray-100 text-gray-800",
      special_event: "bg-purple-100 text-purple-800",
      regular: "bg-green-100 text-green-800",
    };
    return colors[type] || colors.regular;
  };

  return (
    <div className="space-y-3">
      {events.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CalendarDays className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-500">No events available</p>
        </div>
      ) : (
        <div className="max-h-[500px] overflow-y-auto">
          {events.map((event) => (
            <div
              key={event.id}
              className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex items-center justify-between mb-3"
            >
              <div className="space-y-1 flex-1">
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-gray-900">
                    {event.title}
                  </span>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${getTypeColor(
                      event.type
                    )}`}
                  >
                    {event.type.replace("_", " ").toUpperCase()}
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  {new Date(event.date).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-500">{event.description}</p>
                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  <span>Class Day: {event.is_class_day ? "Yes" : "No"}</span>
                  {event.academic_year && (
                    <span>Year: {event.academic_year.name}</span>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2 ml-4">
                <button
                  onClick={() => onEdit(event)}
                  className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
                  title="Edit"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => onDelete(event.id)}
                  className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                  title="Delete"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </div>
  );
};

// Modal Component
const CalendarEventModal = ({
  isOpen,
  onClose,
  selectedEvent,
  academicYears,
}) => {
  const { bulkCreateCalendars, updateCalendar } = useAcademicCalendarStore();
  const [formData, setFormData] = useState({
    academic_year_id: "",
    entries: [
      { date: "", title: "", type: "", description: "", is_class_day: false },
    ],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (selectedEvent) {
      setFormData({
        academic_year_id: selectedEvent.academic_year_id,
        entries: [
          {
            date: selectedEvent.date,
            title: selectedEvent.title,
            type: selectedEvent.type,
            description: selectedEvent.description,
            is_class_day: selectedEvent.is_class_day,
          },
        ],
      });
    } else {
      setFormData({
        academic_year_id: "",
        entries: [
          {
            date: "",
            title: "",
            type: "",
            description: "",
            is_class_day: false,
          },
        ],
      });
    }
  }, [selectedEvent, isOpen]);

  const handleChange = (e, index, field) => {
    const newEntries = [...formData.entries];
    if (field === "is_class_day") {
      newEntries[index] = { ...newEntries[index], [field]: e.target.checked };
    } else {
      newEntries[index] = { ...newEntries[index], [field]: e.target.value };
    }
    setFormData({ ...formData, entries: newEntries });
  };

  const handleAcademicYearChange = (e) => {
    setFormData({ ...formData, academic_year_id: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (selectedEvent) {
        await updateCalendar(selectedEvent.id, {
          ...formData.entries[0],
          academic_year_id: formData.academic_year_id,
        });
      } else {
        await bulkCreateCalendars(formData);
      }
      onClose();
    } catch (err) {
      // Error is handled by the store
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            {selectedEvent ? "Edit Event" : "Add New Event"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Academic Year *
              </label>
              <select
                value={formData.academic_year_id}
                onChange={handleAcademicYearChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                required
              >
                <option value="">Select Academic Year</option>
                {Array.isArray(academicYears) &&
                  academicYears.map((year) => (
                    <option key={year.id} value={year.id}>
                      {year.name} {year.is_current && "(Current)"}
                    </option>
                  ))}
              </select>
            </div>

            {formData.entries.map((entry, index) => (
              <div key={index} className="space-y-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date *
                  </label>
                  <input
                    type="date"
                    value={entry.date}
                    onChange={(e) => handleChange(e, index, "date")}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={entry.title}
                    onChange={(e) => handleChange(e, index, "title")}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    placeholder="Event title"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type *
                  </label>
                  <select
                    value={entry.type}
                    onChange={(e) => handleChange(e, index, "type")}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    required
                  >
                    <option value="">Select Type</option>
                    <option value="regular">Regular</option>
                    <option value="holiday">Holiday</option>
                    <option value="exam">Exam</option>
                    <option value="no_class">No Class</option>
                    <option value="special_event">Special Event</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description *
                  </label>
                  <textarea
                    value={entry.description}
                    onChange={(e) => handleChange(e, index, "description")}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    placeholder="Event description"
                    rows={3}
                    required
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={entry.is_class_day}
                    onChange={(e) => handleChange(e, index, "is_class_day")}
                    className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    id={`is_class_day_${index}`}
                  />
                  <label
                    htmlFor={`is_class_day_${index}`}
                    className="ml-2 text-sm text-gray-700"
                  >
                    Is Class Day
                  </label>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center space-x-2 transition-all duration-200 shadow-sm hover:shadow disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>
                {isSubmitting ? "Saving..." : selectedEvent ? "Update" : "Save"}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const AcademicCalendar = () => {
  const {
    calendars,
    currentPage,
    totalPages,
    total,
    loading: calendarLoading,
    error: calendarError,
    selectedYearId,
    fetchCalendars,
    fetchByYear,
    setPage,
    setSelectedYearId,
    deleteCalendar,
    resetAcademicCalendarStore,
  } = useAcademicCalendarStore();

  const {
    academicYears,
    loading: classLoading,
    error: classError,
    fetchAcademicYears,
    clearError,
  } = useClassManagementStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Extract academic years array from the object structure
  const academicYearsArray = academicYears?.data || [];

  useEffect(() => {
    fetchAcademicYears();
    fetchCalendars(1); // Start with page 1
  }, []);

  const handleYearChange = (yearId) => {
    setSelectedYearId(yearId);
    if (yearId) {
      fetchByYear(yearId, 1);
    } else {
      fetchCalendars(1);
    }
  };

  const handleRefresh = () => {
    if (selectedYearId) {
      fetchByYear(selectedYearId, currentPage);
    } else {
      fetchCalendars(currentPage);
    }
  };

  const handleOpenModal = () => {
    setSelectedEvent(null);
    setIsModalOpen(true);
  };

  const handleDeleteEvent = async (id) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      await deleteCalendar(id);
    }
  };

  const CalendarSkeleton = () => (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <div className="h-10 w-32 bg-gray-200 rounded-lg animate-pulse" />
              <div className="h-10 w-24 bg-gray-200 rounded-lg animate-pulse" />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse lg:col-span-4">
            <div className="h-64 w-full bg-gray-200 rounded" />
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse lg:col-span-8">
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-12 w-full bg-gray-200 rounded" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (calendarLoading || classLoading) {
    return <CalendarSkeleton />;
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <header className="mb-8">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              Academic Calendar
            </h1>
            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 mt-1">
              <span className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full font-medium">
                Manage academic events and holidays
              </span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 mt-5 p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <div className="flex items-center space-x-3">
                <select
                  value={selectedYearId || ""}
                  onChange={(e) =>
                    handleYearChange(
                      e.target.value ? parseInt(e.target.value, 10) : null
                    )
                  }
                  className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  disabled={classError}
                >
                  <option value="">All Academic Years</option>
                  {Array.isArray(academicYearsArray) &&
                  academicYearsArray.length > 0 ? (
                    academicYearsArray.map((year) => (
                      <option key={year.id} value={year.id}>
                        {year.name}
                        {year.is_current && " (Current)"}
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>
                      No academic years available. Create one to add events.
                    </option>
                  )}
                </select>
                <button
                  onClick={handleRefresh}
                  className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                  title="Refresh"
                >
                  <RefreshCcw className="w-4 h-4" />
                </button>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleOpenModal}
                  className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center space-x-2 transition-all duration-200 shadow-sm hover:shadow disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!academicYearsArray.length}
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Event</span>
                </button>
              </div>
            </div>
          </div>

          {(calendarError || classError) && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start space-x-3">
              <BadgeAlert className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-red-800 mb-1">Error</p>
                <p className="text-sm text-red-700">
                  {calendarError || classError}
                </p>
                <button
                  onClick={() => {
                    clearError();
                    fetchAcademicYears();
                    handleRefresh();
                  }}
                  className="text-sm text-red-600 hover:text-red-800 underline mt-2 transition-colors"
                >
                  Try again
                </button>
              </div>
            </div>
          )}
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 lg:col-span-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <CalendarDays className="w-5 h-5 text-indigo-600" />
              <span>Calendar View</span>
            </h2>
            <MiniCalendar
              events={calendars}
              onDateClick={(event) => {
                setSelectedEvent(event);
                setIsModalOpen(true);
              }}
            />
          </section>

          <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 lg:col-span-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                <CalendarDays className="w-5 h-5 text-indigo-600" />
                <span>Event List</span>
              </h2>
              <span className="text-sm text-gray-500">
                Page {currentPage} of {totalPages}
              </span>
            </div>
            <CalendarEventList
              events={calendars}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setPage}
              onEdit={(event) => {
                setSelectedEvent(event);
                setIsModalOpen(true);
              }}
              onDelete={handleDeleteEvent}
            />
          </section>
        </main>

        <CalendarEventModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedEvent(null);
          }}
          selectedEvent={selectedEvent}
          academicYears={academicYearsArray}
        />
      </div>
    </div>
  );
};

export default AcademicCalendar;
