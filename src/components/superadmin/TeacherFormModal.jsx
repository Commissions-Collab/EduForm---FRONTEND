import React from "react";

import toast from "react-hot-toast";
import useTeacherManagementStore from "../../stores/superAdmin/teacherManagementStore";
import useFormsManagementStore from "../../stores/superAdmin/formsManagementStore";

const TeacherFormModal = ({ isOpen, onClose, modalType }) => {
  const { createTeacher, updateTeacher, isLoading } =
    useTeacherManagementStore();
  const { formData, formErrors, updateFormData, setFormErrors, clearForm } =
    useFormsManagementStore();

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formType = "teacher";
    const teacherData = formData[formType];

    // Basic client-side validation
    if (!teacherData.name || !teacherData.email) {
      setFormErrors(formType, "Name and email are required");
      return;
    }

    try {
      let result;
      if (modalType === "edit" && teacherData.id) {
        result = await updateTeacher(teacherData.id, teacherData);
      } else {
        result = await createTeacher(teacherData);
      }

      if (result.success) {
        clearForm(formType);
        onClose();
      } else {
        setFormErrors(formType, result.message);
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          {modalType === "edit" ? "Edit Teacher" : "Create Teacher"}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              className="block w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={formData.teacher.name || ""}
              onChange={(e) =>
                updateFormData("teacher", { name: e.target.value })
              }
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              className="block w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={formData.teacher.email || ""}
              onChange={(e) =>
                updateFormData("teacher", { email: e.target.value })
              }
            />
          </div>
          {formErrors.teacher && (
            <p className="text-sm text-red-600 mb-4">{formErrors.teacher}</p>
          )}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-xl"
              onClick={() => {
                clearForm("teacher");
                onClose();
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700"
              disabled={isLoading}
            >
              {isLoading
                ? "Saving..."
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

export default TeacherFormModal;
