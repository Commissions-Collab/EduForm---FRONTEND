import React, { useState, useEffect } from "react";

import { X, Save, Trash2 } from "lucide-react";
import useEnrollmentStore from "../../stores/superAdmin/enrollmentStore";

const BulkEnrollmentModal = ({
  isOpen,
  onClose,
  selectedStudentIds,
  selectedEnrollments,
}) => {
  const {
    students,
    academicYears,
    yearLevels,
    sections,
    bulkCreateEnrollments,
    loading,
    error,
  } = useEnrollmentStore();

  // Extract unique student IDs from selectedEnrollments
  const getUniqueStudentIds = () => {
    if (!selectedEnrollments || selectedEnrollments.length === 0) {
      return selectedStudentIds || [];
    }

    const uniqueStudentIds = [
      ...new Set(
        selectedEnrollments
          .map((enrollment) => enrollment.student_id || enrollment.student?.id)
          .filter((id) => id !== undefined)
      ),
    ];

    return uniqueStudentIds;
  };

  const [formData, setFormData] = useState({
    student_ids: getUniqueStudentIds(),
    academic_year_id: "",
    grade_level: "",
    section_id: "",
    enrollment_status: "enrolled",
  });

  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    const uniqueIds = getUniqueStudentIds();
    setFormData((prev) => ({
      ...prev,
      student_ids: uniqueIds,
    }));
  }, [selectedStudentIds, selectedEnrollments]);

  // Get selected students data
  const getSelectedStudents = () => {
    const studentIds = formData.student_ids;
    let selectedStudents = [];

    // If we have selectedEnrollments, use them directly
    if (selectedEnrollments && selectedEnrollments.length > 0) {
      // Create a map to avoid duplicates
      const uniqueStudentsMap = new Map();

      selectedEnrollments.forEach((enrollment) => {
        const studentId = enrollment.student_id || enrollment.student?.id;
        if (studentId && !uniqueStudentsMap.has(studentId)) {
          uniqueStudentsMap.set(studentId, {
            id: studentId,
            first_name: enrollment.student?.first_name,
            middle_name: enrollment.student?.middle_name,
            last_name: enrollment.student?.last_name,
            lrn: enrollment.student?.lrn,
            enrollment_id: enrollment.id,
          });
        }
      });

      selectedStudents = Array.from(uniqueStudentsMap.values());
    }
    // Fallback: try to find students from the students array using the IDs
    else if (students && students.length > 0) {
      selectedStudents = students.filter(
        (student) =>
          studentIds.includes(student.id.toString()) ||
          studentIds.includes(student.id)
      );
    }

    return selectedStudents;
  };

  const selectedStudents = getSelectedStudents();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear error for this field when user starts typing
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const removeStudent = (studentId) => {
    const updatedIds = formData.student_ids.filter(
      (id) => id !== studentId.toString() && id !== studentId
    );
    setFormData({ ...formData, student_ids: updatedIds });

    // Clear error if students are selected
    if (formErrors.student_ids && updatedIds.length > 0) {
      setFormErrors((prev) => ({ ...prev, student_ids: null }));
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.student_ids || formData.student_ids.length === 0) {
      errors.student_ids = "At least one student must be selected";
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

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      // Prepare data for backend
      const submitData = {
        student_ids: formData.student_ids.map((id) => parseInt(id, 10)),
        academic_year_id: parseInt(formData.academic_year_id, 10),
        grade_level: parseInt(formData.grade_level, 10), // Match backend validation
        section_id: parseInt(formData.section_id, 10),
      };

      await bulkCreateEnrollments(submitData);

      // Reset form and close modal
      setFormData({
        student_ids: [],
        academic_year_id: "",
        grade_level: "",
        section_id: "",
        enrollment_status: "enrolled",
      });
      setFormErrors({});
      onClose();
    } catch (err) {
      // Error handled by store
      console.error("Bulk enrollment error:", err);
    }
  };

  const handleClose = () => {
    // Reset form errors when closing
    setFormErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 bg-black/30"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="bulk-enrollment-modal-title"
    >
      <div
        className="bg-white rounded-xl shadow-xl p-6 w-full max-w-4xl mx-4 sm:mx-0 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2
            id="bulk-enrollment-modal-title"
            className="text-xl font-semibold text-gray-900"
          >
            Bulk Enrollment
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-full p-1 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-8">
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-4">
                Bulk Enrollment Details
              </h3>
              {loading ? (
                <p className="text-sm text-gray-500">Loading data...</p>
              ) : error ? (
                <p className="text-sm text-red-500">Error: {error}</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Selected Students <span className="text-red-500">*</span>
                      <span className="ml-2 text-xs text-gray-500">
                        ({formData.student_ids.length} selected)
                      </span>
                    </label>

                    {formData.student_ids.length === 0 ? (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                        <p className="text-sm text-gray-500">
                          No students selected. Please go back and select
                          students to enroll.
                        </p>
                      </div>
                    ) : selectedStudents.length === 0 ? (
                      <div className="border border-yellow-300 rounded-lg p-4 text-center bg-yellow-50">
                        <p className="text-sm text-yellow-700 font-medium mb-2">
                          Student data not fully loaded
                        </p>
                        <p className="text-xs text-gray-600">
                          Selected Student IDs:{" "}
                          {formData.student_ids.join(", ")}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          The bulk enrollment will proceed with these student
                          IDs.
                        </p>
                      </div>
                    ) : (
                      <div className="border border-gray-300 rounded-lg max-h-60 overflow-y-auto bg-gray-50">
                        <div className="p-4">
                          <div className="grid gap-3">
                            {selectedStudents.map((student, index) => (
                              <div
                                key={`student-${student.id}-${index}`}
                                className="flex items-center justify-between bg-white p-3 rounded-lg border shadow-sm hover:shadow-md transition-shadow"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                                    <span className="text-xs font-semibold text-white">
                                      {index + 1}
                                    </span>
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <div className="text-sm font-medium text-gray-900">
                                      {`${student.first_name || ""} ${
                                        student.middle_name
                                          ? student.middle_name + " "
                                          : ""
                                      }${student.last_name || ""}`.trim() ||
                                        "Unknown Student"}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                      LRN: {student.lrn || "N/A"} • ID:{" "}
                                      {student.id}
                                    </div>
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => removeStudent(student.id)}
                                  className="text-red-500 hover:text-red-700 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 rounded-full p-1 transition-colors"
                                  aria-label={`Remove ${student.first_name} ${student.last_name}`}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {formErrors.student_ids && (
                      <p className="text-xs text-red-500 mt-1">
                        {formErrors.student_ids}
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
                            {ay.name || ay.year || `Year ${ay.id}`}
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
                            {yl.name || `Grade ${yl.level || yl.id}`}
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
                  </div>

                  <div className="col-span-2">
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
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-8 flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={
                loading ||
                formData.student_ids.length === 0 ||
                !formData.academic_year_id ||
                !formData.grade_level ||
                !formData.section_id
              }
              className={`px-4 py-2 text-sm rounded-lg flex items-center space-x-2 transition-all duration-200 shadow-sm hover:shadow ${
                loading ||
                formData.student_ids.length === 0 ||
                !formData.academic_year_id ||
                !formData.grade_level ||
                !formData.section_id
                  ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                  : "bg-indigo-600 text-white hover:bg-indigo-700"
              }`}
            >
              <Save className="w-4 h-4" />
              <span>
                {loading
                  ? "Enrolling..."
                  : `Enroll ${formData.student_ids.length} Student${
                      formData.student_ids.length !== 1 ? "s" : ""
                    }`}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BulkEnrollmentModal;
