import React, { useState } from "react";
import useFormsManagementStore from "../../stores/superAdmin/formsManagementStore";

const FormModal = ({ isOpen, onClose, formType }) => {
  const { formData, updateFormData, setFormErrors } = useFormsManagementStore();
  const [localFormData, setLocalFormData] = useState(
    formType ? formData[formType.id] : {}
  );

  const handleChange = (e) => {
    setLocalFormData({ ...localFormData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formType) {
      setFormErrors("general", "No form type selected");
      return;
    }
    // Basic validation example
    if (!localFormData.name && formType.id !== "schedule") {
      setFormErrors(formType.id, "Name is required");
      return;
    }
    updateFormData(formType.id, localFormData);
    setFormErrors(formType.id, null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {formType ? `Edit ${formType.name} Form` : "Select Form Type"}
        </h3>
        <div className="space-y-4">
          {!formType ? (
            <p className="text-sm text-gray-600">
              Please select a form type from the table to edit.
            </p>
          ) : (
            <>
              {formType.id !== "schedule" && (
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={localFormData.name || ""}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
              )}
              {formType.id === "student" && (
                <>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="first_name"
                      value={localFormData.first_name || ""}
                      onChange={handleChange}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="last_name"
                      value={localFormData.last_name || ""}
                      onChange={handleChange}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      LRN
                    </label>
                    <input
                      type="text"
                      name="lrn"
                      value={localFormData.lrn || ""}
                      onChange={handleChange}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </>
              )}
              {(formType.id === "academicYear" ||
                formType.id === "calendarEvent") && (
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
                  />
                </div>
              )}
              {(formType.id === "academicYear" ||
                formType.id === "calendarEvent") && (
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    name="end_date"
                    value={localFormData.end_date || ""}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              )}
              {(formType.id === "calendarEvent" ||
                formType.id === "schedule") && (
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={localFormData.description || ""}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    rows="4"
                  />
                </div>
              )}
            </>
          )}
        </div>
        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            Cancel
          </button>
          {formType && (
            <button
              onClick={handleSubmit}
              className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Save
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FormModal;
