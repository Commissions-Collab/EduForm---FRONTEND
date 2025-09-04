import React from "react";
import toast from "react-hot-toast";
import useFormsManagementStore from "../../stores/superAdmin/formsManagementStore";

const FormsEditModal = ({ isOpen, onClose, formType }) => {
  const { formData, formErrors, updateFormData, setFormErrors } =
    useFormsManagementStore();

  // Define form fields based on form type
  const formFields = {
    academicYear: [
      { name: "name", label: "Academic Year Name", type: "text" },
      { name: "start_date", label: "Start Date", type: "date" },
      { name: "end_date", label: "End Date", type: "date" },
    ],
    teacher: [
      { name: "name", label: "Teacher Name", type: "text" },
      { name: "email", label: "Email", type: "email" },
    ],
    calendarEvent: [
      { name: "title", label: "Event Title", type: "text" },
      { name: "start_date", label: "Start Date", type: "date" },
      { name: "end_date", label: "End Date", type: "date" },
      { name: "description", label: "Description", type: "textarea" },
    ],
    // Add more form types as needed
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const data = formData[formType] || {};

    // Basic validation
    const requiredFields =
      formFields[formType]?.map((field) => field.name) || [];
    const missingFields = requiredFields.filter((field) => !data[field]);
    if (missingFields.length > 0) {
      setFormErrors(
        formType,
        `Missing required fields: ${missingFields.join(", ")}`
      );
      return;
    }

    // Update form data (no API call, just update store)
    toast.success(`${formType} form data updated`);
    onClose();
  };

  if (!isOpen || !formType) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Edit {formType.charAt(0).toUpperCase() + formType.slice(1)} Form
        </h2>
        <form onSubmit={handleSubmit}>
          {formFields[formType]?.map((field) => (
            <div key={field.name} className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {field.label}
              </label>
              {field.type === "textarea" ? (
                <textarea
                  className="block w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={formData[formType]?.[field.name] || ""}
                  onChange={(e) =>
                    updateFormData(formType, { [field.name]: e.target.value })
                  }
                />
              ) : (
                <input
                  type={field.type}
                  className="block w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={formData[formType]?.[field.name] || ""}
                  onChange={(e) =>
                    updateFormData(formType, { [field.name]: e.target.value })
                  }
                />
              )}
            </div>
          ))}
          {formErrors[formType] && (
            <p className="text-sm text-red-600 mb-4">{formErrors[formType]}</p>
          )}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-xl"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormsEditModal;
