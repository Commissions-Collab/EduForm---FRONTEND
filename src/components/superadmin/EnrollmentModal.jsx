import React, { useState, useEffect } from "react";
import { LuX, LuSave } from "react-icons/lu";
import useEnrollmentStore from "../../stores/superAdmin/enrollmentStore";

const EnrollmentModal = ({ isOpen, onClose, selectedEnrollment }) => {
  const {
    students,
    academicYears,
    yearLevels,
    sections,
    createEnrollment,
    updateEnrollment,
    loading,
    error,
  } = useEnrollmentStore();

  const [formData, setFormData] = useState({
    student_id: "",
    academic_year_id: "",
    grade_level: "",
    section_id: "",
    enrollment_status: "enrolled",
  });

  const [formErrors, setFormErrors] = useState({});

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
    setFormErrors({});
  }, [selectedEnrollment]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error for this field when user starts typing
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.student_id) {
      errors.student_id = "Student is required";
    }
    if (!formData.academic_year_id) {
      errors.academic_year_id = "Academic year is required";
    }
    if (!formData.grade_level) {
      errors.grade_level = "Grade level is required";
    }
    if (!formData.section_id) {
      errors.section_id = "Section is required";
    }
    if (!formData.enrollment_status) {
      errors.enrollment_status = "Enrollment status is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

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
              {loading ? (
                <p className="text-sm text-gray-500">Loading data...</p>
              ) : error ? (
                <p className="text-sm text-red-500">Error: {error}</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="student_id"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Student <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="student_id"
                      name="student_id"
                      value={formData.student_id}
                      onChange={handleChange}
                      className={`mt-1 px-3 py-2 text-sm border rounded-lg w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
                        formErrors.student_id
                          ? "border-red-300"
                          : "border-gray-300"
                      }`}
                      required
                    >
                      <option value="">Select Student</option>
                      {students.length > 0 ? (
                        students.map((student) => (
                          <option
                            key={`student-${student.id}`}
                            value={student.student.id}
                          >
                            {`${student.student.first_name || ""} ${
                              student.student.middle_name
                                ? student.student.middle_name + " "
                                : ""
                            }${student.student.last_name || ""} (${
                              student.student.lrn || student.student.id
                            })`}
                          </option>
                        ))
                      ) : (
                        <option disabled>No students available</option>
                      )}
                    </select>
                    {formErrors.student_id && (
                      <p className="text-xs text-red-500 mt-1">
                        {formErrors.student_id}
                      </p>
                    )}
                    {students.length === 0 && (
                      <p className="text-xs text-red-500 mt-1">
                        No students found. Please add students in the admin
                        panel.
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="academic_year_id"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Academic Year <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="academic_year_id"
                      name="academic_year_id"
                      value={formData.academic_year_id}
                      onChange={handleChange}
                      className={`mt-1 px-3 py-2 text-sm border rounded-lg w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
                        formErrors.academic_year_id
                          ? "border-red-300"
                          : "border-gray-300"
                      }`}
                      required
                    >
                      <option value="">Select Academic Year</option>
                      {academicYears.length > 0 ? (
                        academicYears.map((ay) => (
                          <option key={ay.id} value={ay.id}>
                            {ay.name || ay.year || ay.id}
                          </option>
                        ))
                      ) : (
                        <option disabled>No academic years available</option>
                      )}
                    </select>
                    {formErrors.academic_year_id && (
                      <p className="text-xs text-red-500 mt-1">
                        {formErrors.academic_year_id}
                      </p>
                    )}
                    {academicYears.length === 0 && (
                      <p className="text-xs text-red-500 mt-1">
                        No academic years found. Please add academic years in
                        the admin panel.
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="grade_level"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Grade Level <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="grade_level"
                      name="grade_level"
                      value={formData.grade_level}
                      onChange={handleChange}
                      className={`mt-1 px-3 py-2 text-sm border rounded-lg w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
                        formErrors.grade_level
                          ? "border-red-300"
                          : "border-gray-300"
                      }`}
                      required
                    >
                      <option value="">Select Grade Level</option>
                      {yearLevels.length > 0 ? (
                        yearLevels.map((yl) => (
                          <option key={yl.id} value={yl.id}>
                            {yl.name || `Grade ${yl.level}`}
                          </option>
                        ))
                      ) : (
                        <option disabled>No grade levels available</option>
                      )}
                    </select>
                    {formErrors.grade_level && (
                      <p className="text-xs text-red-500 mt-1">
                        {formErrors.grade_level}
                      </p>
                    )}
                    {yearLevels.length === 0 && (
                      <p className="text-xs text-red-500 mt-1">
                        No grade levels found. Please add grade levels in the
                        admin panel.
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="section_id"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Section <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="section_id"
                      name="section_id"
                      value={formData.section_id}
                      onChange={handleChange}
                      className={`mt-1 px-3 py-2 text-sm border rounded-lg w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
                        formErrors.section_id
                          ? "border-red-300"
                          : "border-gray-300"
                      }`}
                      required
                    >
                      <option value="">Select Section</option>
                      {sections.length > 0 ? (
                        sections.map((section) => (
                          <option key={section.id} value={section.id}>
                            {section.name}
                          </option>
                        ))
                      ) : (
                        <option disabled>No sections available</option>
                      )}
                    </select>

                    {formErrors.section_id && (
                      <p className="text-xs text-red-500 mt-1">
                        {formErrors.section_id}
                      </p>
                    )}
                    {sections.length === 0 && (
                      <p className="text-xs text-red-500 mt-1">
                        No sections found. Please add sections in the admin
                        panel.
                      </p>
                    )}
                  </div>
                  {selectedEnrollment && (
                    <div>
                      <label
                        htmlFor="enrollment_status"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Enrollment Status{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="enrollment_status"
                        name="enrollment_status"
                        value={formData.enrollment_status}
                        onChange={handleChange}
                        className={`mt-1 px-3 py-2 text-sm border rounded-lg w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
                          formErrors.enrollment_status
                            ? "border-red-300"
                            : "border-gray-300"
                        }`}
                        required
                      >
                        <option value="enrolled">Enrolled</option>
                        <option value="withdrawn">Withdrawn</option>
                        <option value="transferred">Transferred</option>
                      </select>
                      {formErrors.enrollment_status && (
                        <p className="text-xs text-red-500 mt-1">
                          {formErrors.enrollment_status}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}
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
              disabled={
                loading ||
                students.length === 0 ||
                academicYears.length === 0 ||
                yearLevels.length === 0 ||
                sections.length === 0
              }
              className={`px-4 py-2 text-sm rounded-lg flex items-center space-x-2 transition-all duration-200 shadow-sm hover:shadow ${
                loading ||
                students.length === 0 ||
                academicYears.length === 0 ||
                yearLevels.length === 0 ||
                sections.length === 0
                  ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                  : "bg-indigo-600 text-white hover:bg-indigo-700"
              }`}
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
