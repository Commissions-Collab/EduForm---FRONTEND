import React, { useState } from "react";
import useFormsManagementStore from "../../stores/superAdmin/formsManagementStore";

const TeacherFormModal = ({ isOpen, onClose, formType, itemId, onSubmit }) => {
  const { formData, updateFormData, setFormErrors } = useFormsManagementStore();
  const [localFormData, setLocalFormData] = useState(formData[formType] || {});

  const handleChange = (e) => {
    setLocalFormData({ ...localFormData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formType) {
      setFormErrors("general", "No form type selected");
      return;
    }
    if (formType === "teacher" && !localFormData.name) {
      setFormErrors("teacher", "Name is required");
      return;
    }
    if (
      formType === "schedule" &&
      (!localFormData.title ||
        !localFormData.day ||
        !localFormData.start_time ||
        !localFormData.end_time)
    ) {
      setFormErrors("schedule", "All schedule fields are required");
      return;
    }
    updateFormData(formType, localFormData);
    setFormErrors(formType, null);
    onSubmit(localFormData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {formType === "teacher"
            ? itemId
              ? "Edit Teacher"
              : "Create Teacher"
            : "Create Schedule"}
        </h3>
        <div className="space-y-4">
          {formType === "teacher" ? (
            <>
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
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={localFormData.email || ""}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={localFormData.title || ""}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Day</label>
                <select
                  name="day"
                  value={localFormData.day || ""}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                >
                  <option value="">Select Day</option>
                  <option value="Monday">Monday</option>
                  <option value="Tuesday">Tuesday</option>
                  <option value="Wednesday">Wednesday</option>
                  <option value="Thursday">Thursday</option>
                  <option value="Friday">Friday</option>
                  <option value="Saturday">Saturday</option>
                  <option value="Sunday">Sunday</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Start Time
                </label>
                <input
                  type="time"
                  name="start_time"
                  value={localFormData.start_time || ""}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  End Time
                </label>
                <input
                  type="time"
                  name="end_time"
                  value={localFormData.end_time || ""}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Section (Optional)
                </label>
                <input
                  type="text"
                  name="section"
                  value={localFormData.section || ""}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
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
          <button
            onClick={handleSubmit}
            className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            {formType === "teacher" && itemId ? "Update" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeacherFormModal;
