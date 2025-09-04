import React, { useMemo, useEffect, useState } from "react";
import { LuCalendar, LuPen, LuTrash } from "react-icons/lu";
import useCalendarManagementStore from "../../stores/superAdmin/calendarManagementStore";
import useFormsManagementStore from "../../stores/superAdmin/formsManagementStore";
import Pagination from "./Pagination";

const CalendarTable = ({ searchTerm, selectedYearId, onEdit }) => {
  const {
    calendarEvents,
    selectedYearEvents,
    isLoading,
    error,
    deleteCalendarEvent,
  } = useCalendarManagementStore();
  const { updateFormData } = useFormsManagementStore();
  const [currentPage, setCurrentPage] = useState(1);

  const recordsPerPage = 10;

  // Use selectedYearEvents if a year is selected, otherwise use calendarEvents
  const eventsToDisplay = selectedYearId ? selectedYearEvents : calendarEvents;

  // Memoize filtered records
  const filteredRecords = useMemo(
    () =>
      Array.isArray(eventsToDisplay)
        ? eventsToDisplay.filter(
            (event) =>
              event.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
              event.description
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase())
          )
        : [],
    [eventsToDisplay, searchTerm]
  );

  // Calculate paginated records
  const paginatedRecords = useMemo(() => {
    const start = (currentPage - 1) * recordsPerPage;
    const end = start + recordsPerPage;
    return filteredRecords.slice(start, end);
  }, [filteredRecords, currentPage]);

  const totalPages = Math.ceil(filteredRecords.length / recordsPerPage);

  // Reset to page 1 when search term or selected year changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedYearId]);

  // Handle edit
  const handleEdit = (event) => {
    updateFormData("calendarEvent", event);
    onEdit();
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (
      window.confirm("Are you sure you want to delete this calendar event?")
    ) {
      await deleteCalendarEvent(id);
    }
  };

  // Skeleton row for loading state
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
        <div className="w-24 h-4 bg-gray-200 rounded mx-auto"></div>
      </td>
      <td className="px-6 py-4 text-center">
        <div className="flex items-center justify-center gap-2">
          <div className="w-12 h-6 bg-gray-200 rounded"></div>
          <div className="w-12 h-6 bg-gray-200 rounded"></div>
        </div>
      </td>
    </tr>
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
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
                {filteredRecords.length}{" "}
                {filteredRecords.length === 1 ? "event" : "events"} found
                {searchTerm && (
                  <span className="ml-1">
                    for "
                    <span className="font-medium text-gray-700">
                      {searchTerm}
                    </span>
                    "
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full divide-y divide-gray-200">
          <thead className="bg-gray-50/50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                <div className="flex items-center gap-2">
                  <LuCalendar className="w-4 h-4" />
                  Title
                </div>
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Start Date
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                End Date
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
              Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
            ) : error ? (
              <tr>
                <td colSpan={5} className="px-6 py-16 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                      <LuCalendar className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                      <p className="font-medium text-red-900">
                        Failed to load calendar events
                      </p>
                      <p className="text-sm text-red-600 mt-1">{error}</p>
                    </div>
                  </div>
                </td>
              </tr>
            ) : filteredRecords.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-16 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                      <LuCalendar className="w-6 h-6 text-gray-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        No calendar events found
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        {searchTerm
                          ? "Try adjusting your search criteria"
                          : "No events available"}
                      </p>
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedRecords.map((event) => (
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
                          {event.title || "Untitled"}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center text-sm text-gray-900">
                    {event.start_date || "-"}
                  </td>
                  <td className="px-6 py-4 text-center text-sm text-gray-900">
                    {event.end_date || "-"}
                  </td>
                  <td className="px-6 py-4 text-center text-sm text-gray-900">
                    <p className="truncate max-w-xs" title={event.description}>
                      {event.description || "No description"}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                        onClick={() => handleEdit(event)}
                      >
                        <LuPen className="w-3.5 h-3.5" />
                        Edit
                      </button>
                      <button
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                        onClick={() => handleDelete(event.id)}
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

      {/* Pagination */}
      {!isLoading && !error && filteredRecords.length > 0 && (
        <div className="border-t border-gray-200 bg-white px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <p className="text-sm text-gray-600">
              Showing {currentPage * recordsPerPage - recordsPerPage + 1} to{" "}
              {Math.min(currentPage * recordsPerPage, filteredRecords.length)}{" "}
              of {filteredRecords.length} results
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
  );
};

export default CalendarTable;
