import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import useFormsManagementStore from "../../stores/superAdmin/formsManagementStore";
import useAcademicManagementStore from "../../stores/superAdmin/academicManagementStore";

const AcademicManagementModal = ({
  isOpen,
  onClose,
  formType,
  studentId,
  enrollmentId,
  yearLevelId,
  sectionId,
}) => {
  const { formData, updateFormData, setFormErrors, clearForm } =
    useFormsManagementStore();
  const {
    createStudent,
    updateStudent,
    createEnrollment,
    updateEnrollment,
    createYearLevel,
    updateYearLevel,
    createSection,
    updateSection,
  } = useAcademicManagementStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormErrors(formType, null);

    try {
      let response;
      const data = formData[formType];

      switch (formType) {
        case "student":
          if (studentId) {
            response = await updateStudent(studentId, data);
          } else {
            response = await createStudent(data); // Note: No createStudent in store; add if needed
          }
          break;
        case "enrollment":
          if (enrollmentId) {
            response = await updateEnrollment(enrollmentId, data);
          } else {
            response = await createEnrollment(data);
          }
          break;
        case "yearLevel":
          if (yearLevelId) {
            response = await updateYearLevel(yearLevelId, data);
          } else {
            response = await createYearLevel(data);
          }
          break;
        case "section":
          if (sectionId) {
            response = await updateSection(sectionId, data);
          } else {
            response = await createSection(data);
          }
          break;
        default:
          throw new Error("Invalid form type");
      }

      if (response.success) {
        toast.success(
          `${formType.charAt(0).toUpperCase() + formType.slice(1)} ${
            studentId || enrollmentId || yearLevelId || sectionId
              ? "updated"
              : "created"
          } successfully`
        );
        clearForm(formType);
        onClose();
      } else {
        setFormErrors(formType, response.message);
      }
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        `Failed to ${
          studentId || enrollmentId || yearLevelId || sectionId
            ? "update"
            : "create"
        } ${formType}`;
      setFormErrors(formType, message);
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
          {studentId || enrollmentId || yearLevelId || sectionId
            ? "Edit"
            : "Create"}{" "}
          {formType.charAt(0).toUpperCase() + formType.slice(1, -1)}
        </h2>
        <form onSubmit={handleSubmit}>
          {formType === "student" && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  LRN
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={formData.student.lrn || ""}
                  onChange={(e) =>
                    updateFormData("student", { lrn: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  First Name
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={formData.student.first_name || ""}
                  onChange={(e) =>
                    updateFormData("student", { first_name: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Last Name
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={formData.student.last_name || ""}
                  onChange={(e) =>
                    updateFormData("student", { last_name: e.target.value })
                  }
                />
              </div>
              {/* Add other student fields as needed */}
            </div>
          )}
          {formType === "enrollment" && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Student ID
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={formData.enrollment.student_id || ""}
                  onChange={(e) =>
                    updateFormData("enrollment", { student_id: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  School Year
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={formData.enrollment.school_year || ""}
                  onChange={(e) =>
                    updateFormData("enrollment", {
                      school_year: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Grade Level ID
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={formData.enrollment.grade_level || ""}
                  onChange={(e) =>
                    updateFormData("enrollment", {
                      grade_level: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Section ID
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={formData.enrollment.section_id || ""}
                  onChange={(e) =>
                    updateFormData("enrollment", { section_id: e.target.value })
                  }
                />
              </div>
            </div>
          )}
          {formType === "yearLevel" && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={formData.yearLevel.name || ""}
                  onChange={(e) =>
                    updateFormData("yearLevel", { name: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Code
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={formData.yearLevel.code || ""}
                  onChange={(e) =>
                    updateFormData("yearLevel", { code: e.target.value })
                  }
                />
              </div>
            </div>
          )}
          {formType === "section" && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={formData.section.name || ""}
                  onChange={(e) =>
                    updateFormData("section", { name: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Year Level ID
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={formData.section.year_level_id || ""}
                  onChange={(e) =>
                    updateFormData("section", { year_level_id: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Academic Year ID
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={formData.section.academic_year_id || ""}
                  onChange={(e) =>
                    updateFormData("section", {
                      academic_year_id: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Capacity
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={formData.section.capacity || ""}
                  onChange={(e) =>
                    updateFormData("section", { capacity: e.target.value })
                  }
                />
              </div>
            </div>
          )}

          {formData[formType]?.errors && (
            <div className="mt-4 text-sm text-red-600">
              {formData[formType].errors}
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
                : studentId || enrollmentId || yearLevelId || sectionId
                ? "Update"
                : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AcademicManagementModal;
