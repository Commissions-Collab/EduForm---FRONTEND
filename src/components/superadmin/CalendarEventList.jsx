import React from "react";
import { LuCalendar, LuPen, LuTrash2 } from "react-icons/lu";
import Pagination from "./Pagination";

const CalendarEventList = ({
  events,
  currentPage,
  totalPages,
  onPageChange,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="space-y-3">
      {events.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <LuCalendar className="w-8 h-8 text-gray-400" />
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
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-gray-900">
                    {event.title}
                  </span>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      event.type === "holiday"
                        ? "bg-red-100 text-red-800"
                        : event.type === "exam"
                        ? "bg-yellow-100 text-yellow-800"
                        : event.type === "no_class"
                        ? "bg-gray-100 text-gray-800"
                        : event.type === "special_event"
                        ? "bg-purple-100 text-purple-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {event.type.replace("_", " ").toUpperCase()}
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  {new Date(event.date).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-500">{event.description}</p>
                <p className="text-xs text-gray-500">
                  Class Day: {event.is_class_day ? "Yes" : "No"}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onEdit(event)}
                  className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
                >
                  <LuPen className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(event.id)}
                  className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                >
                  <LuTrash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      {totalPages > 1 && (
        <div className="mt-4">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
};

export default CalendarEventList;
