import { useEffect, useState } from "react";
import useTeacherManagementStore from "../../stores/superAdmin/teacherManagementStore";

const AssignAdviserModal = ({ isOpen, onClose, teacher }) => {
  const { assignAdviser, fetchDropdownData, getFilterData, loading } =
    useTeacherManagementStore();

  // Get filter data (academic years, sections)
  const { academicYear, sections } = getFilterData();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sectionId, setSectionId] = useState("");
  const [academicYearId, setAcademicYearId] = useState("");

  useEffect(() => {
    if (isOpen) {
      fetchDropdownData(); // loads academic years initially
    } else {
      // Reset when modal closes
      setSectionId("");
      setAcademicYearId("");
      setIsSubmitting(false);
    }
  }, [isOpen, fetchDropdownData]);

  if (!isOpen || !teacher) return null;

  const handleAcademicYearChange = async (yearId) => {
    setAcademicYearId(yearId);
    setSectionId(""); // reset section when year changes
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!sectionId || !academicYearId) return;

    setIsSubmitting(true);
    try {
      await assignAdviser({
        teacher_id: teacher.id,
        section_id: sectionId,
        academic_year_id: academicYearId,
      });
      onClose();
    } catch (error) {
      console.error("Failed to assign adviser:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTeacherName = (teacher) => {
    const parts = [
      teacher.first_name,
      teacher.middle_name,
      teacher.last_name,
    ].filter(Boolean);
    return parts.join(" ");
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Assign Section Adviser
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Assign {formatTeacherName(teacher)} as a section adviser
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Academic Year Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Academic Year *
            </label>
            <select
              value={academicYearId}
              onChange={(e) => handleAcademicYearChange(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:border-green-500"
              required
            >
              <option value="">Select Academic Year</option>
              {academicYear ? (
                <option key={academicYear.id} value={academicYear.id}>
                  {academicYear.name}{" "}
                  {academicYear.is_current ? "(Current)" : ""}
                </option>
              ) : (
                <option disabled>Loading academic years...</option>
              )}
            </select>
          </div>

          {/* Section Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Section *
            </label>
            <select
              value={sectionId}
              onChange={(e) => setSectionId(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:border-green-500"
              required
              disabled={!academicYearId}
            >
              <option value="">
                {!academicYearId
                  ? "Select Academic Year First"
                  : "Select Section"}
              </option>
              {sections && sections.length > 0 ? (
                sections.map((section) => (
                  <option
                    key={section.id}
                    value={section.id}
                    disabled={!!section.adviser} // disable if already has adviser
                  >
                    {section.name}
                    {section.adviser ? ` - Adviser: ${section.adviser}` : ""}
                  </option>
                ))
              ) : academicYearId ? (
                <option disabled>No sections found</option>
              ) : null}
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-green-400 disabled:cursor-not-allowed transition-colors"
              disabled={
                isSubmitting || loading || !sectionId || !academicYearId
              }
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Assigning...
                </span>
              ) : (
                "Assign as Adviser"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssignAdviserModal;
