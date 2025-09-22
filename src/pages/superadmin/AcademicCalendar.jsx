import React, { useEffect, useState } from "react";

import { CalendarDays, Plus, RefreshCcw, BadgeAlert } from "lucide-react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import toast from "react-hot-toast";
import useAcademicCalendarStore from "../../stores/superAdmin/calendarStore";
import useClassManagementStore from "../../stores/superAdmin/classManagementStore";
import CalendarEventList from "../../components/superadmin/CalendarEventList";
import CalendarEventModal from "../../components/superadmin/CalendarEventModal";

const AcademicCalendar = () => {
  const {
    calendars,
    currentPage,
    totalPages,
    loading: calendarLoading,
    error: calendarError,
    fetchCalendars,
    fetchByYear,
    setPage,
    resetAcademicCalendarStore,
  } = useAcademicCalendarStore();

  const {
    academicYears,
    loading: classLoading,
    error: classError,
    fetchAcademicYears,
    clearError,
  } = useClassManagementStore();

  const [selectedYear, setSelectedYear] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    console.log("academicYears in component:", academicYears);
    fetchAcademicYears();
    if (selectedYear) {
      fetchByYear(selectedYear, currentPage);
    } else {
      fetchCalendars(currentPage);
    }
  }, [
    selectedYear,
    fetchCalendars,
    fetchByYear,
    fetchAcademicYears,
    currentPage,
  ]);

  const handleRefresh = () => {
    if (selectedYear) {
      fetchByYear(selectedYear, currentPage);
    } else {
      fetchCalendars(currentPage);
    }
  };

  const handleOpenModal = () => {
    setSelectedEvent(null);
    setIsModalOpen(true);
  };

  const getTileContent = ({ date, view }) => {
    if (view === "month") {
      const events = calendars.filter(
        (event) => new Date(event.date).toDateString() === date.toDateString()
      );
      return events.length > 0 ? (
        <div className="absolute bottom-1 left-0 right-0 flex justify-center">
          <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
        </div>
      ) : null;
    }
    return null;
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
          <div className="flex items-center space-x-4 mb-6">
            <CalendarDays className="w-8 h-8 text-indigo-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Academic Calendar
              </h1>
              <p className="text-gray-600 text-sm mt-1">
                Manage school events and class days
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <div className="flex items-center space-x-3">
                <select
                  value={selectedYear || ""}
                  onChange={(e) =>
                    setSelectedYear(
                      e.target.value ? parseInt(e.target.value, 10) : null
                    )
                  }
                  className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  disabled={classError}
                >
                  <option value="">All Academic Years</option>
                  {Array.isArray(academicYears) && academicYears.length > 0 ? (
                    academicYears.map((year) => (
                      <option key={year.id} value={year.id}>
                        {year.name}
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>
                      No academic years available. Create one to add events.
                    </option>
                  )}
                </select>
                {!academicYears.length && !classError && (
                  <button
                    onClick={() => {
                      useClassManagementStore.getState().createAcademicYear({
                        name: `Year ${new Date().getFullYear()}`,
                      });
                    }}
                    className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                  >
                    Create Academic Year
                  </button>
                )}
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleOpenModal}
                  className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center space-x-2 transition-all duration-200 shadow-sm hover:shadow"
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
            <Calendar
              className="border-none"
              tileContent={getTileContent}
              onClickDay={(date) => {
                const event = calendars.find(
                  (e) => new Date(e.date).toDateString() === date.toDateString()
                );
                if (event) {
                  setSelectedEvent(event);
                  setIsModalOpen(true);
                }
              }}
            />
          </section>

          <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 lg:col-span-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <CalendarDays className="w-5 h-5 text-indigo-600" />
              <span>Event List</span>
            </h2>
            <CalendarEventList
              events={calendars}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setPage}
              onEdit={(event) => {
                setSelectedEvent(event);
                setIsModalOpen(true);
              }}
              onDelete={(id) => {
                if (
                  window.confirm("Are you sure you want to delete this event?")
                ) {
                  useAcademicCalendarStore.getState().deleteCalendar(id);
                }
              }}
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
          academicYears={academicYears}
        />
      </div>
    </div>
  );
};

export default AcademicCalendar;
