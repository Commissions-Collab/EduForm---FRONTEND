import React, { useState, useEffect } from "react";
import { LuX, LuSave } from "react-icons/lu";
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "student_ids") {
      const selected = Array.from(
        e.target.selectedOptions,
        (option) => option.value
      );
      setFormData({ ...formData, [name]: selected });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await promoteStudents(formData);
      onClose();
    } catch (err) {
      // Error handled by store
    }
  };

  // Extract unique students from enrollments
  const students = Array.from(
    new Map(
      enrollments.map((e) => [
        e.student_id,
        {
          id: e.student_id,
          first_name: e.student?.first_name,
          middle_name: e.student?.middle_name,
          last_name: e.student?.last_name,
          lrn: e.student?.lrn,
        },
      ])
    ).values()
  );

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 bg-black/30"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-xl p-6 w-full max-w-3xl mx-4 sm:mx-0"
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
            <LuX className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="space-y-8">
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-4">
                Promotion Details
              </h3>
              {loading ? (
                <p className="text-sm text-gray-500">Loading data...</p>
              ) : error ? (
                <p className="text-sm text-red-500">Error: {error}</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label
                      htmlFor="student_ids"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Students <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="student_ids"
                      name="student_ids"
                      multiple
                      value={formData.student_ids}
                      onChange={handleChange}
                      className="mt-1 px-3 py-2 text-sm border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors h-40"
                      required
                    >
                      {students.length > 0 ? (
                        students.map((student) => (
                          <option key={student.id} value={student.id}>
                            {`${student.first_name} ${
                              student.middle_name || ""
                            } ${student.last_name} (${student.lrn || "N/A"})`}
                          </option>
                        ))
                      ) : (
                        <option disabled>No students available</option>
                      )}
                    </select>
                    {students.length === 0 && (
                      <p className="text-xs text-red-500 mt-1">
                        No students found. Please add students in the admin
                        panel.
                      </p>
                    )}
                  </div>
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
                    >
                      <option value="">Select Next Academic Year</option>
                      {academicYears.length > 0 ? (
                        academicYears.map((ay) => (
                          <option key={ay.id} value={ay.id}>
                            {ay.name || ay.id}
                          </option>
                        ))
                      ) : (
                        <option disabled>No academic years available</option>
                      )}
                    </select>
                    {academicYears.length === 0 && (
                      <p className="text-xs text-red-500 mt-1">
                        No academic years found. Please add academic years in
                        the admin panel.
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
                    >
                      <option value="">Select Next Grade Level</option>
                      {yearLevels.length > 0 ? (
                        yearLevels.map((yl) => (
                          <option key={yl.id} value={yl.id}>
                            {yl.name}
                          </option>
                        ))
                      ) : (
                        <option disabled>No grade levels available</option>
                      )}
                    </select>
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
                      className="mt-1 px-3 py-2 text-sm border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
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
                    {sections.length === 0 && (
                      <p className="text-xs text-red-500 mt-1">
                        No sections found. Please add sections in the admin
                        panel.
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
                academicYears.length === 0 ||
                yearLevels.length === 0 ||
                sections.length === 0
              }
              className={`px-4 py-2 text-sm rounded-lg flex items-center space-x-2 transition-all duration-200 shadow-sm hover:shadow ${
                loading ||
                academicYears.length === 0 ||
                yearLevels.length === 0 ||
                sections.length === 0
                  ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                  : "bg-indigo-600 text-white hover:bg-indigo-700"
              }`}
            >
              <LuSave className="w-4 h-4" />
              <span>Promote</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PromoteModal;
