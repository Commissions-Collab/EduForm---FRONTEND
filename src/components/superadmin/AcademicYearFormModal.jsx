import React, { useState } from "react";
import useFormsManagementStore from "../../stores/superAdmin/formsManagementStore";

const AcademicYearFormModal = ({ isOpen, onClose, yearId, onSubmit }) => {
  const { formData, updateFormData, setFormErrors } = useFormsManagementStore();
  const [localFormData, setLocalFormData] = useState(
    formData.academicYear || {}
  );

  const handleChange = (e) => {
    setLocalFormData({ ...localFormData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!localFormData.name) {
      setFormErrors("academicYear", "Name is required");
      return;
    }
    if (!localFormData.start_date || !localFormData.end_date) {
      setFormErrors("academicYear", "Start and end dates are required");
      return;
    }
    updateFormData("academicYear", localFormData);
    setFormErrors("academicYear", null);
    onSubmit(localFormData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {yearId ? "Edit Academic Year" : "Create Academic Year"}
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={localFormData.name || ""}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Start Date
            </label>
            <input
              type="date"
              name="start_date"
              value={localFormData.start_date || ""}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">End Date</label>
            <input
              type="date"
              name="end_date"
              value={localFormData.end_date || ""}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
        </div>
        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            {yearId ? "Update" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AcademicYearFormModal;
