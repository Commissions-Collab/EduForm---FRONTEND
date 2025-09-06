import React, { useState, useEffect } from "react";
import { LuX, LuSave } from "react-icons/lu";
import useEnrollmentStore from "../../stores/superAdmin/enrollmentStore";

const EnrollmentModal = ({ isOpen, onClose, selectedEnrollment }) => {
  const { createEnrollment, updateEnrollment } = useEnrollmentStore();
  const [formData, setFormData] = useState({
    student_id: "",
    academic_year_id: "",
    grade_level: "",
    section_id: "",
    enrollment_status: "enrolled",
  });

  useEffect(() => {
    if (selectedEnrollment) {
      setFormData({
        student_id: selectedEnrollment.student_id || "",
        academic_year_id: selectedEnrollment.academic_year_id || "",
        grade_level: selectedEnrollment.grade_level || "",
        section_id: selectedEnrollment.section_id || "",
        enrollment_status: selectedEnrollment.enrollment_status || "enrolled",
      });
    } else {
      setFormData({
        student_id: "",
        academic_year_id: "",
        grade_level: "",
        section_id: "",
        enrollment_status: "enrolled",
      });
    }
  }, [selectedEnrollment]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedEnrollment) {
        await updateEnrollment(selectedEnrollment.id, formData);
      } else {
        await createEnrollment(formData);
      }
      onClose();
    } catch (err) {
      // Error handled by store
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 bg-black/30"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="enrollment-modal-title"
    >
      <div
        className="bg-white rounded-xl shadow-xl p-6 w-full max-w-3xl mx-4 sm:mx-0"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2
            id="enrollment-modal-title"
            className="text-xl font-semibold text-gray-900"
          >
            {selectedEnrollment ? "Edit Enrollment" : "Add Enrollment"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-full p-1 transition-colors"
            aria-label="Close modal"
          >
            <LuX className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="space-y-8">
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-4">
                Enrollment Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="student_id"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Student ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="student_id"
                    name="student_id"
                    value={formData.student_id}
                    onChange={handleChange}
                    className="mt-1 px-3 py-2 text-sm border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    required
                    placeholder="e.g., 12345"
                    aria-required="true"
                  />
                </div>
                <div>
                  <label
                    htmlFor="academic_year_id"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Academic Year ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="academic_year_id"
                    name="academic_year_id"
                    value={formData.academic_year_id}
                    onChange={handleChange}
                    className="mt-1 px-3 py-2 text-sm border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    required
                    placeholder="e.g., 1"
                    aria-required="true"
                  />
                </div>
                <div>
                  <label
                    htmlFor="grade_level"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Grade Level ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="grade_level"
                    name="grade_level"
                    value={formData.grade_level}
                    onChange={handleChange}
                    className="mt-1 px-3 py-2 text-sm border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    required
                    placeholder="e.g., 7"
                    aria-required="true"
                  />
                </div>
                <div>
                  <label
                    htmlFor="section_id"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Section ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="section_id"
                    name="section_id"
                    value={formData.section_id}
                    onChange={handleChange}
                    className="mt-1 px-3 py-2 text-sm border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    required
                    placeholder="e.g., 101"
                    aria-required="true"
                  />
                </div>
                <div>
                  <label
                    htmlFor="enrollment_status"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Enrollment Status <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="enrollment_status"
                    name="enrollment_status"
                    value={formData.enrollment_status}
                    onChange={handleChange}
                    className="mt-1 px-3 py-2 text-sm border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    required
                    aria-required="true"
                  >
                    <option value="enrolled">Enrolled</option>
                    <option value="pending">Pending</option>
                    <option value="withdrawn">Withdrawn</option>
                    <option value="transferred">Transferred</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 flex items-center space-x-2 transition-all duration-200 shadow-sm hover:shadow"
            >
              <LuSave className="w-4 h-4" />
              <span>{selectedEnrollment ? "Update" : "Save"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EnrollmentModal;
