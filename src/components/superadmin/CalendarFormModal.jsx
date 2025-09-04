import React, { useState, useEffect } from "react";

import toast from "react-hot-toast";
import useCalendarManagementStore from "../../stores/superAdmin/calendarManagementStore";
import useFormsManagementStore from "../../stores/superAdmin/formsManagementStore";
import useAcademicYearManagementStore from "../../stores/superAdmin/academicYearManagementStore";

const CalendarFormModal = ({ isOpen, onClose, modalType }) => {
  const { createCalendarEvent, updateCalendarEvent } =
    useCalendarManagementStore();
  const { formData, updateFormData, setFormErrors, clearForm } =
    useFormsManagementStore();
  const { academicYears, fetchAcademicYears } =
    useAcademicYearManagementStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch academic years when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchAcademicYears();
    }
  }, [isOpen, fetchAcademicYears]);

  // Clear form when modal opens for create
  useEffect(() => {
    if (isOpen && modalType === "create") {
      clearForm("calendarEvent");
    }
  }, [isOpen, modalType, clearForm]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormErrors("calendarEvent", null);

    try {
      const data = formData.calendarEvent;
      // Validate dates
      if (
        data.start_date &&
        data.end_date &&
        new Date(data.end_date) < new Date(data.start_date)
      ) {
        setFormErrors("calendarEvent", "End date must be after start date");
        setIsSubmitting(false);
        toast.error("End date must be after start date");
        return;
      }

      let response;
      if (modalType === "edit" && formData.calendarEvent.id) {
        response = await updateCalendarEvent(formData.calendarEvent.id, data);
      } else {
        response = await createCalendarEvent(data);
      }

      if (response.success) {
        toast.success(
          `Calendar event ${
            modalType === "edit" ? "updated" : "created"
          } successfully`
        );
        clearForm("calendarEvent");
        onClose();
      } else {
        setFormErrors("calendarEvent", response.message);
        toast.error(response.message);
      }
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        `Failed to ${
          modalType === "edit" ? "update" : "create"
        } calendar event`;
      setFormErrors("calendarEvent", message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 max-w-lg w-full">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          {modalType === "edit" ? "Edit" : "Create"} Calendar Event
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Title
              </label>
              <input
                type="text"
                className="mt-1 block w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={formData.calendarEvent.title || ""}
                onChange={(e) =>
                  updateFormData("calendarEvent", { title: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Start Date
              </label>
              <input
                type="date"
                className="mt-1 block w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={formData.calendarEvent.start_date || ""}
                onChange={(e) =>
                  updateFormData("calendarEvent", {
                    start_date: e.target.value,
                  })
                }
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                End Date
              </label>
              <input
                type="date"
                className="mt-1 block w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={formData.calendarEvent.end_date || ""}
                onChange={(e) =>
                  updateFormData("calendarEvent", { end_date: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                className="mt-1 block w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={formData.calendarEvent.description || ""}
                onChange={(e) =>
                  updateFormData("calendarEvent", {
                    description: e.target.value,
                  })
                }
                rows={4}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Academic Year
              </label>
              <select
                className="mt-1 block w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={formData.calendarEvent.academic_year_id || ""}
                onChange={(e) =>
                  updateFormData("calendarEvent", {
                    academic_year_id: e.target.value,
                  })
                }
                required
              >
                <option value="">Select Academic Year</option>
                {academicYears.map((year) => (
                  <option key={year.id} value={year.id}>
                    {year.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {formData.calendarEvent?.errors && (
            <div className="mt-4 text-sm text-red-600">
              {formData.calendarEvent.errors}
            </div>
          )}

          <div className="mt-6 flex justify-end gap-2">
            <button
              type="button"
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Submitting..."
                : modalType === "edit"
                ? "Update"
                : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CalendarFormModal;
