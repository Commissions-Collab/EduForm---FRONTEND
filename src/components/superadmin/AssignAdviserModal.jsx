import { useEffect, useState } from "react";
import useTeacherManagementStore from "../../stores/superAdmin/teacherManagementStore";
import toast from "react-hot-toast";

const AssignAdviserModal = ({ isOpen, onClose, teacher }) => {
  const {
    assignAdviser,
    fetchDropdownData,
    fetchSectionsByYear,
    getFilterData,
    loading,
  } = useTeacherManagementStore();

  // Extract from Zustand store
  const { academicYear, sections } = getFilterData();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sectionId, setSectionId] = useState("");
  const [academicYearId, setAcademicYearId] = useState("");

  useEffect(() => {
    if (isOpen) {
      fetchDropdownData();
    } else {
      // Reset when modal closes
      setSectionId("");
      setAcademicYearId("");
      setIsSubmitting(false);
    }
  }, [isOpen, fetchDropdownData]);

  // ✅ Handle academic year change
  const handleAcademicYearChange = async (yearId) => {
    setAcademicYearId(yearId);
    setSectionId("");
    if (yearId) {
      await fetchSectionsByYear(yearId); // fetch only available sections
    }
  };

  // ✅ Handle form submission
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
      toast.success("Teacher successfully assigned as section adviser!");
      onClose();
    } catch (error) {
      console.error("Failed to assign adviser:", error);
      toast.error("Failed to assign adviser.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ✅ Teacher’s full name formatter
  const formatTeacherName = (teacher) => {
    const parts = [
      teacher.first_name,
      teacher.middle_name,
      teacher.last_name,
    ].filter(Boolean);
    return parts.join(" ");
  };

  // ✅ Detect if teacher already has an advisory
  const hasAdvisory =
    teacher?.section_advisors && teacher.section_advisors.length > 0;

  if (!isOpen || !teacher) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Assign Section Adviser
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Assign <strong>{formatTeacherName(teacher)}</strong> as a section
            adviser
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Academic Year Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Academic Year *
            </label>
            <select
              value={academicYearId}
              onChange={(e) => handleAcademicYearChange(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:border-green-500"
              required
              disabled={loading}
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

          {/* Section Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Section *
            </label>
            <select
              value={sectionId}
              onChange={(e) => setSectionId(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:border-green-500"
              required
              disabled={!academicYearId || loading}
            >
              <option value="">
                {!academicYearId
                  ? "Select Academic Year First"
                  : "Select Section"}
              </option>
              {sections && sections.length > 0 ? (
                sections.map((section) => (
                  <option key={section.id} value={section.id}>
                    {section.name}
                  </option>
                ))
              ) : academicYearId ? (
                <option disabled>No available sections</option>
              ) : null}
            </select>
          </div>

          {/* Action Buttons */}
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
              className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors ${
                hasAdvisory
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              }`}
              disabled={
                hasAdvisory ||
                isSubmitting ||
                loading ||
                !sectionId ||
                !academicYearId
              }
            >
              {hasAdvisory
                ? "Already Adviser"
                : isSubmitting
                ? "Assigning..."
                : "Assign as Adviser"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssignAdviserModal;
