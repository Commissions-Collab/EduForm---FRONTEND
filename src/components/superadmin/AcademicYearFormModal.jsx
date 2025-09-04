import React, { useState, useEffect } from "react";

import toast from "react-hot-toast";
import useAcademicYearManagementStore from "../../stores/superAdmin/academicYearManagementStore";
import useFormsManagementStore from "../../stores/superAdmin/formsManagementStore";

const AcademicYearFormModal = ({ isOpen, onClose, modalType }) => {
  const { createAcademicYear, updateAcademicYear } =
    useAcademicYearManagementStore();
  const { formData, updateFormData, setFormErrors, clearForm } =
    useFormsManagementStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Clear form when modal opens for create
  useEffect(() => {
    if (isOpen && modalType === "create") {
      clearForm("academicYear");
    }
  }, [isOpen, modalType, clearForm]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormErrors("academicYear", null);

    try {
      const data = formData.academicYear;
      let response;

      if (modalType === "edit" && formData.academicYear.id) {
        response = await updateAcademicYear(formData.academicYear.id, data);
      } else {
        response = await createAcademicYear(data);
      }

      if (response.success) {
        toast.success(
          `Academic year ${
            modalType === "edit" ? "updated" : "created"
          } successfully`
        );
        clearForm("academicYear");
        onClose();
      } else {
        setFormErrors("academicYear", response.message);
      }
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        `Failed to ${modalType === "edit" ? "update" : "create"} academic year`;
      setFormErrors("academicYear", message);
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
          {modalType === "edit" ? "Edit" : "Create"} Academic Year
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                className="mt-1 block w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={formData.academicYear.name || ""}
                onChange={(e) =>
                  updateFormData("academicYear", { name: e.target.value })
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
                value={formData.academicYear.start_date || ""}
                onChange={(e) =>
                  updateFormData("academicYear", { start_date: e.target.value })
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
                value={formData.academicYear.end_date || ""}
                onChange={(e) =>
                  updateFormData("academicYear", { end_date: e.target.value })
                }
                required
              />
            </div>
          </div>

          {formData.academicYear?.errors && (
            <div className="mt-4 text-sm text-red-600">
              {formData.academicYear.errors}
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

export default AcademicYearFormModal;
