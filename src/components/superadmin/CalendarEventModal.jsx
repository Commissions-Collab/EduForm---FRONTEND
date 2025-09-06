import React, { useState, useEffect } from "react";
import { LuX, LuSave } from "react-icons/lu";
import useAcademicCalendarStore from "../../stores/superAdmin/calendarStore";

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
  }, [selectedEvent]);

  const handleChange = (e, index, field) => {
    const newEntries = [...formData.entries];
    newEntries[index] = { ...newEntries[index], [field]: e.target.value };
    setFormData({ ...formData, entries: newEntries });
  };

  const handleCheckboxChange = (index) => {
    const newEntries = [...formData.entries];
    newEntries[index].is_class_day = !newEntries[index].is_class_day;
    setFormData({ ...formData, entries: newEntries });
  };

  const handleAcademicYearChange = (e) => {
    setFormData({ ...formData, academic_year_id: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.3)" }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-lg p-6 w-full max-w-lg"
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
            <LuX className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Academic Year
              </label>
              <select
                value={formData.academic_year_id}
                onChange={handleAcademicYearChange}
                className="mt-1 px-3 py-2 text-sm border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                required
              >
                <option value="">Select Academic Year</option>
                {Array.isArray(academicYears) &&
                  academicYears.map((year) => (
                    <option key={year.id} value={year.id}>
                      {year.name}
                    </option>
                  ))}
              </select>
            </div>
            {formData.entries.map((entry, index) => (
              <div key={index} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Date
                  </label>
                  <input
                    type="date"
                    value={entry.date}
                    onChange={(e) => handleChange(e, index, "date")}
                    className="mt-1 px-3 py-2 text-sm border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Title
                  </label>
                  <input
                    type="text"
                    value={entry.title}
                    onChange={(e) => handleChange(e, index, "title")}
                    className="mt-1 px-3 py-2 text-sm border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Type
                  </label>
                  <select
                    value={entry.type}
                    onChange={(e) => handleChange(e, index, "type")}
                    className="mt-1 px-3 py-2 text-sm border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
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
                  <label className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    value={entry.description}
                    onChange={(e) => handleChange(e, index, "description")}
                    className="mt-1 px-3 py-2 text-sm border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    required
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={entry.is_class_day}
                    onChange={() => handleCheckboxChange(index)}
                    className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                  <label className="ml-2 text-sm text-gray-700">
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
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center space-x-2 transition-all duration-200 shadow-sm hover:shadow"
            >
              <LuSave className="w-4 h-4" />
              <span>{selectedEvent ? "Update" : "Save"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CalendarEventModal;
