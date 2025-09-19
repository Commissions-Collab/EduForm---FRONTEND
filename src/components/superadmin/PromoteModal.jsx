import React, { useState, useEffect, useMemo } from "react";
import { X, Save } from "lucide-react";
import useEnrollmentStore from "../../stores/superAdmin/enrollmentStore";

const PromoteModal = ({ isOpen, onClose, selectedStudentIds }) => {
  const {
    enrollments,
    academicYears,
    yearLevels,
    sections,
    promoteStudents,
    loading,
    error,
  } = useEnrollmentStore();

  const [formData, setFormData] = useState({
    student_ids: selectedStudentIds || [],
    next_academic_year_id: "",
    next_grade_level_id: "",
    section_id: "",
  });

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      student_ids: selectedStudentIds || [],
    }));
  }, [selectedStudentIds]);

  // Get selected students with their current enrollment details
  const selectedStudents = useMemo(() => {
    if (!selectedStudentIds || selectedStudentIds.length === 0) {
      return [];
    }

    return enrollments
      .filter((enrollment) =>
        selectedStudentIds.includes(enrollment.student_id)
      )
      .map((enrollment) => ({
        id: enrollment.student_id,
        enrollment_id: enrollment.id,
        first_name: enrollment.student?.first_name,
        middle_name: enrollment.student?.middle_name,
        last_name: enrollment.student?.last_name,
        lrn: enrollment.student?.lrn,
        current_grade_level: enrollment.year_level,
        current_section: enrollment.section,
        current_academic_year: enrollment.academic_year,
      }));
  }, [enrollments, selectedStudentIds]);

  // Get the highest grade level among selected students
  const currentHighestGradeLevel = useMemo(() => {
    if (selectedStudents.length === 0) return null;

    return selectedStudents.reduce((highest, student) => {
      const currentLevel = student.current_grade_level;
      if (!currentLevel || !currentLevel.name) return highest;

      // Extract number from grade level name (e.g., "Grade 7" -> 7)
      const currentNum = parseInt(currentLevel.name.match(/\d+/)?.[0] || "0");
      const highestNum = highest
        ? parseInt(highest.name.match(/\d+/)?.[0] || "0")
        : 0;

      return currentNum > highestNum ? currentLevel : highest;
    }, null);
  }, [selectedStudents]);

  // Filter grade levels to show only higher levels
  const availableGradeLevels = useMemo(() => {
    if (!currentHighestGradeLevel) return yearLevels;

    const currentGradeNum = parseInt(
      currentHighestGradeLevel.name.match(/\d+/)?.[0] || "0"
    );

    return yearLevels.filter((level) => {
      const levelNum = parseInt(level.name.match(/\d+/)?.[0] || "0");
      return levelNum > currentGradeNum;
    });
  }, [yearLevels, currentHighestGradeLevel]);

  // Filter sections based on selected grade level
  const availableSections = useMemo(() => {
    if (!formData.next_grade_level_id) return [];

    // Assuming sections are linked to grade levels
    // You might need to adjust this based on your actual data structure
    return sections.filter((section) => {
      // If sections have a grade_level_id or year_level_id field
      return (
        section.year_level_id == formData.next_grade_level_id ||
        section.grade_level_id == formData.next_grade_level_id ||
        // If no direct relationship, show all sections
        (!section.year_level_id && !section.grade_level_id)
      );
    });
  }, [sections, formData.next_grade_level_id]);

  // Filter academic years to show future years
  const availableAcademicYears = useMemo(() => {
    if (selectedStudents.length === 0) return academicYears;

    // Get current academic year from selected students
    const currentAcademicYear = selectedStudents[0]?.current_academic_year;
    if (!currentAcademicYear) return academicYears;

    // Extract year from academic year name (e.g., "2023-2024" -> 2024)
    const currentYearMatch = currentAcademicYear.name.match(/(\d{4})-(\d{4})/);
    const currentEndYear = currentYearMatch ? parseInt(currentYearMatch[2]) : 0;

    return academicYears.filter((ay) => {
      const yearMatch = ay.name.match(/(\d{4})-(\d{4})/);
      const endYear = yearMatch ? parseInt(yearMatch[2]) : 0;
      return endYear > currentEndYear;
    });
  }, [academicYears, selectedStudents]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      // Reset section when grade level changes
      ...(name === "next_grade_level_id" && { section_id: "" }),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await promoteStudents(formData);
      onClose();
      // Reset form
      setFormData({
        student_ids: [],
        next_academic_year_id: "",
        next_grade_level_id: "",
        section_id: "",
      });
    } catch (err) {
      // Error handled by store
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 bg-black/30"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-xl p-6 w-full max-w-4xl mx-4 sm:mx-0 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Promote Students
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-full p-1 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-8">
            {/* Selected Students Display */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-4">
                Selected Students ({selectedStudents.length})
              </h3>
              {selectedStudents.length > 0 ? (
                <div className="bg-gray-50 rounded-lg p-4 max-h-48 overflow-y-auto">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedStudents.map((student) => (
                      <div
                        key={student.id}
                        className="bg-white p-3 rounded-lg border border-gray-200"
                      >
                        <div className="font-medium text-gray-900">
                          {`${student.first_name} ${
                            student.middle_name || ""
                          } ${student.last_name}`.trim()}
                        </div>
                        <div className="text-sm text-gray-500">
                          LRN: {student.lrn || "N/A"}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          Current: {student.current_grade_level?.name || "N/A"}{" "}
                          - {student.current_section?.name || "N/A"}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-8 text-center">
                  <p className="text-gray-500">No students selected</p>
                </div>
              )}
            </div>

            {/* Promotion Details */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-4">
                Promotion Details
              </h3>
              {loading ? (
                <p className="text-sm text-gray-500">Loading data...</p>
              ) : error ? (
                <p className="text-sm text-red-500">Error: {error}</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label
                      htmlFor="next_academic_year_id"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Next Academic Year <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="next_academic_year_id"
                      name="next_academic_year_id"
                      value={formData.next_academic_year_id}
                      onChange={handleChange}
                      className="mt-1 px-3 py-2 text-sm border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                      required
                      disabled={selectedStudents.length === 0}
                    >
                      <option value="">Select Next Academic Year</option>
                      {availableAcademicYears.length > 0 ? (
                        availableAcademicYears.map((ay) => (
                          <option key={ay.id} value={ay.id}>
                            {ay.name || ay.id}
                          </option>
                        ))
                      ) : (
                        <option disabled>
                          No future academic years available
                        </option>
                      )}
                    </select>
                    {availableAcademicYears.length === 0 && (
                      <p className="text-xs text-red-500 mt-1">
                        No future academic years available for promotion.
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="next_grade_level_id"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Next Grade Level <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="next_grade_level_id"
                      name="next_grade_level_id"
                      value={formData.next_grade_level_id}
                      onChange={handleChange}
                      className="mt-1 px-3 py-2 text-sm border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                      required
                      disabled={selectedStudents.length === 0}
                    >
                      <option value="">Select Next Grade Level</option>
                      {availableGradeLevels.length > 0 ? (
                        availableGradeLevels.map((yl) => (
                          <option key={yl.id} value={yl.id}>
                            {yl.name}
                          </option>
                        ))
                      ) : (
                        <option disabled>
                          {!formData.next_academic_year_id
                            ? "Select academic year first"
                            : currentGradeLevel
                            ? `No next grade level available for ${currentGradeLevel.name}`
                            : "No grade levels available"}
                        </option>
                      )}
                    </select>
                    {!formData.next_academic_year_id && (
                      <p className="text-xs text-amber-600 mt-1">
                        Please select an academic year first to see available
                        grade levels.
                      </p>
                    )}
                    {formData.next_academic_year_id &&
                      availableGradeLevels.length === 0 &&
                      currentGradeLevel && (
                        <p className="text-xs text-red-500 mt-1">
                          No next grade level available for{" "}
                          {currentGradeLevel.name}.
                          {currentGradeLevel.number >= 12 &&
                            " Students may have reached the highest grade level."}
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
                      className="mt-1 px-3 py-2 text-sm border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                      required
                      disabled={
                        !formData.next_grade_level_id ||
                        !formData.next_academic_year_id ||
                        selectedStudents.length === 0
                      }
                    >
                      <option value="">Select Section</option>
                      {availableSections.length > 0 ? (
                        availableSections.map((section) => (
                          <option key={section.id} value={section.id}>
                            {section.name}
                          </option>
                        ))
                      ) : (
                        <option disabled>
                          {!formData.next_academic_year_id ||
                          !formData.next_grade_level_id
                            ? "Select academic year and grade level first"
                            : "No sections available for selected grade level and academic year"}
                        </option>
                      )}
                    </select>
                    {(!formData.next_academic_year_id ||
                      !formData.next_grade_level_id) && (
                      <p className="text-xs text-amber-600 mt-1">
                        Please select academic year and grade level first to see
                        available sections.
                      </p>
                    )}
                    {formData.next_academic_year_id &&
                      formData.next_grade_level_id &&
                      availableSections.length === 0 && (
                        <p className="text-xs text-red-500 mt-1">
                          No sections available for the selected grade level and
                          academic year combination.
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
              onClick={onClose}
              className="px-4 py-2 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={
                loading ||
                selectedStudents.length === 0 ||
                availableAcademicYears.length === 0 ||
                availableGradeLevels.length === 0 ||
                availableSections.length === 0 ||
                !formData.next_academic_year_id ||
                !formData.next_grade_level_id ||
                !formData.section_id
              }
              className={`px-4 py-2 text-sm rounded-lg flex items-center space-x-2 transition-all duration-200 shadow-sm hover:shadow ${
                loading ||
                selectedStudents.length === 0 ||
                availableAcademicYears.length === 0 ||
                availableGradeLevels.length === 0 ||
                availableSections.length === 0 ||
                !formData.next_academic_year_id ||
                !formData.next_grade_level_id ||
                !formData.section_id
                  ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                  : "bg-indigo-600 text-white hover:bg-indigo-700"
              }`}
            >
              <Save className="w-4 h-4" />
              <span>
                Promote {selectedStudents.length} Student
                {selectedStudents.length !== 1 ? "s" : ""}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PromoteModal;
