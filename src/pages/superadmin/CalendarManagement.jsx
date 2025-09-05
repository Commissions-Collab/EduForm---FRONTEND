import React, { useEffect, useState, useMemo } from "react";
import {
  LuCalendar,
  LuPlus,
  LuTrash,
  LuRefreshCw,
  LuBadgeAlert,
  LuClock,
  LuPen,
} from "react-icons/lu";
import useCalendarManagementStore from "../../stores/superAdmin/calendarManagementStore";
import CalendarFormModal from "../../components/superadmin/CalendarFormModal";
import Pagination from "../../components/superadmin/Pagination";

const CalendarManagement = () => {
  const {
    calendarEvents,
    selectedYearEvents,
    isLoading,
    error,
    fetchCalendarEvents,
    fetchEventsByYear,
    createCalendarEvent,
    updateCalendarEvent,
    deleteCalendarEvent,
  } = useCalendarManagementStore();

  const [selectedYear, setSelectedYear] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 7;

  useEffect(() => {
    fetchCalendarEvents();
  }, [fetchCalendarEvents]);

  const handleYearChange = (e) => {
    const yearId = e.target.value;
    setSelectedYear(yearId);
    setCurrentPage(1);
    if (yearId) {
      fetchEventsByYear(yearId);
    }
  };

  const handleCreateEvent = async (formData) => {
    const result = await createCalendarEvent(formData);
    if (result.success) {
      fetchCalendarEvents();
      setCurrentPage(1);
    }
  };

  const handleUpdateEvent = async (formData) => {
    if (editingEvent) {
      const result = await updateCalendarEvent(editingEvent.id, formData);
      if (result.success) {
        fetchCalendarEvents();
      }
    }
  };

  const handleDeleteEvent = async (id) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      const result = await deleteCalendarEvent(id);
      if (result.success) {
        fetchCalendarEvents();
        const events = selectedYear ? selectedYearEvents : calendarEvents;
        const totalPages = Math.ceil(events.length / eventsPerPage);
        if (currentPage > totalPages && totalPages > 0) {
          setCurrentPage(totalPages);
        }
      }
    }
  };

  const openEditModal = (event) => {
    setEditingEvent(event);
    setIsModalOpen(true);
  };

  // Memoize filtered events
  const filteredEvents = useMemo(
    () => (selectedYear ? selectedYearEvents : calendarEvents),
    [calendarEvents, selectedYearEvents, selectedYear]
  );

  // Calculate paginated events
  const paginatedEvents = useMemo(() => {
    const start = (currentPage - 1) * eventsPerPage;
    const end = start + eventsPerPage;
    return filteredEvents.slice(start, end);
  }, [filteredEvents, currentPage]);

  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);

  // Reset to page 1 when year changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedYear]);

  const SkeletonRow = () => (
    <tr className="animate-pulse">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
          <div className="w-24 h-4 bg-gray-200 rounded"></div>
        </div>
      </td>
      <td className="px-6 py-4 text-center">
        <div className="w-16 h-4 bg-gray-200 rounded mx-auto"></div>
      </td>
      <td className="px-6 py-4 text-center">
        <div className="w-16 h-4 bg-gray-200 rounded mx-auto"></div>
      </td>
      <td className="px-6 py-4 text-center">
        <div className="flex items-center justify-center gap-2">
          <div className="w-12 h-6 bg-gray-200 rounded"></div>
          <div className="w-12 h-6 bg-gray-200 rounded"></div>
        </div>
      </td>
    </tr>
  );
  const CalendarSkeleton = () => (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-12 h-12 bg-gray-200 rounded-xl animate-pulse" />
            <div className="space-y-2">
              <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-80 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <div className="flex flex-wrap items-center gap-4">
                <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
              </div>
              <div className="flex items-center space-x-3">
                <div className="h-10 w-32 bg-gray-200 rounded-lg animate-pulse" />
                <div className="h-10 w-24 bg-gray-200 rounded-lg animate-pulse" />
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl shadow-sm p-6 animate-pulse">
            <div className="h-5 w-32 bg-gray-200 rounded mb-4" />
            <div className="space-y-3">
              <div className="h-4 w-full bg-gray-200 rounded" />
              <div className="h-4 w-3/4 bg-gray-200 rounded" />
              <div className="h-4 w-1/2 bg-gray-200 rounded" />
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 animate-pulse">
            <div className="h-5 w-32 bg-gray-200 rounded mb-4" />
            <div className="space-y-3">
              <div className="h-4 w-full bg-gray-200 rounded" />
              <div className="h-4 w-3/4 bg-gray-200 rounded" />
              <div className="h-4 w-1/2 bg-gray-200 rounded" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (isLoading && !calendarEvents.length) {
    return <CalendarSkeleton />;
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <header className="mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Calendar Management
              </h1>
              <p className="text-gray-600 text-sm mt-1">
                Manage academic calendar events and schedules
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <div className="flex flex-wrap items-center gap-6 text-sm">
                <div className="flex items-center space-x-2">
                  <LuCalendar className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-500">
                    Filter by Academic Year:
                  </span>
                  <select
                    value={selectedYear}
                    onChange={handleYearChange}
                    className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">All Years</option>
                    <option value="1">2023-2024</option>
                    <option value="2">2024-2025</option>
                    <option value="3">2025-2026</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center space-x-2"
                >
                  <LuPlus className="w-4 h-4" />
                  <span>Add Event</span>
                </button>
                <button
                  onClick={fetchCalendarEvents}
                  disabled={isLoading}
                  className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  <LuRefreshCw
                    className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
                  />
                  <span>Refresh</span>
                </button>
              </div>
            </div>
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start space-x-3">
              <LuBadgeAlert className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-red-800 mb-1">
                  Error loading calendar data
                </p>
                <p className="text-sm text-red-700">{error}</p>
                <button
                  onClick={fetchCalendarEvents}
                  className="text-sm text-red-600 hover:text-red-800 underline mt-2"
                >
                  Try again
                </button>
              </div>
            </div>
          )}
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <section className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                <div className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 mb-2">
                        Calendar Events
                      </h2>
                      <p className="text-sm text-gray-600">
                        Manage academic calendar events
                      </p>
                    </div>
                    {!isLoading && (
                      <div className="text-sm text-gray-500">
                        {filteredEvents.length}{" "}
                        {filteredEvents.length === 1 ? "event" : "events"} found
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50/50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        <div className="flex items-center gap-2">
                          <LuCalendar className="w-4 h-4" />
                          Event
                        </div>
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Description
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {isLoading ? (
                      Array.from({ length: 5 }).map((_, i) => (
                        <SkeletonRow key={i} />
                      ))
                    ) : error ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-16 text-center">
                          <div className="flex flex-col items-center gap-3">
                            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                              <LuCalendar className="w-6 h-6 text-red-600" />
                            </div>
                            <div>
                              <p className="font-medium text-red-900">
                                Failed to load events
                              </p>
                              <p className="text-sm text-red-600 mt-1">
                                {error}
                              </p>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ) : paginatedEvents.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-16 text-center">
                          <div className="flex flex-col items-center gap-3">
                            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                              <LuCalendar className="w-6 h-6 text-gray-400" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">
                                No events found
                              </p>
                              <p className="text-sm text-gray-500 mt-1">
                                No events available for the selected academic
                                year
                              </p>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      paginatedEvents.map((event) => (
                        <tr
                          key={event.id}
                          className="hover:bg-gray-50/50 transition-colors"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                                <LuCalendar className="w-5 h-5 text-white" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900">
                                  {event.title}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-center text-sm text-gray-900">
                            {new Date(event.date).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 text-center text-sm text-gray-900">
                            {event.description || "-"}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                                onClick={() => openEditModal(event)}
                              >
                                <LuPen className="w-3.5 h-3.5" />
                                Edit
                              </button>
                              <button
                                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                                onClick={() => handleDeleteEvent(event.id)}
                              >
                                <LuTrash className="w-3.5 h-3.5" />
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {!isLoading && !error && filteredEvents.length > 0 && (
                <div className="border-t border-gray-200 bg-white px-6 py-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <p className="text-sm text-gray-600">
                      Showing {currentPage * eventsPerPage - eventsPerPage + 1}{" "}
                      to{" "}
                      {Math.min(
                        currentPage * eventsPerPage,
                        filteredEvents.length
                      )}{" "}
                      of {filteredEvents.length} results
                    </p>
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={setCurrentPage}
                    />
                  </div>
                </div>
              )}
            </div>
          </section>

          <section>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <LuClock className="w-5 h-5 text-indigo-600" />
                <span>Upcoming Events</span>
              </h2>
              <div className="space-y-3">
                {calendarEvents
                  .filter((event) => new Date(event.date) >= new Date())
                  .slice(0, 5)
                  .map((event) => (
                    <div
                      key={event.id}
                      className="flex items-center justify-between"
                    >
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {event.title}
                        </p>
                        <p className="text-sm text-gray-600">
                          {new Date(event.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                {calendarEvents.filter(
                  (event) => new Date(event.date) >= new Date()
                ).length === 0 && (
                  <p className="text-gray-500 text-sm">No upcoming events</p>
                )}
              </div>
            </div>
          </section>
        </main>

        <CalendarFormModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingEvent(null);
          }}
          event={editingEvent}
          onSubmit={editingEvent ? handleUpdateEvent : handleCreateEvent}
        />
      </div>
    </div>
  );
};

export default CalendarManagement;
