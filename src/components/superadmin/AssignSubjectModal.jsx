import React, { useEffect, useState } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import useTeacherManagementStore from "../../stores/superAdmin/teacherManagementStore";

const AssignSubjectModal = ({ isOpen, onClose, teacher }) => {
  const {
    fetchDropdownData,
    fetchSubjects,
    fetchSectionsByYear,
    assignSubjects,
    academicYear,
    quarters,
    subjects,
    sections,
    loading,
  } = useTeacherManagementStore();

  const [selectedYear, setSelectedYear] = useState("");
  const [assignments, setAssignments] = useState([
    { subject_id: "", section_id: "", quarter_id: "" },
  ]);

  // Fetch academic year + quarters on open
  useEffect(() => {
    if (isOpen) fetchDropdownData();
  }, [isOpen, fetchDropdownData]);

  // Fetch subjects when modal opens
  useEffect(() => {
    if (isOpen) fetchSubjects();
  }, [isOpen, fetchSubjects]);

  // Fetch sections when year changes
  useEffect(() => {
    if (selectedYear) fetchSectionsByYear(selectedYear);
  }, [selectedYear, fetchSectionsByYear]);

  const handleAddRow = () =>
    setAssignments([
      ...assignments,
      { subject_id: "", section_id: "", quarter_id: "" },
    ]);

  const handleRemoveRow = (index) => {
    if (assignments.length > 1) {
      setAssignments(assignments.filter((_, i) => i !== index));
    }
  };

  const handleChange = (index, field, value) => {
    const updated = [...assignments];
    updated[index][field] = value;
    setAssignments(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!teacher?.id) return toast.error("Teacher not found.");
    if (!selectedYear) return toast.error("Please select an academic year.");
    if (assignments.filter((a) => a.subject_id).length === 0)
      return toast.error("Please select at least one subject.");

    try {
      await assignSubjects({
        teacher_id: teacher.id,
        academic_year_id: selectedYear,
        assignments,
      });
      toast.success("Subjects assigned successfully!");
      onClose();
    } catch {
      toast.error("Failed to assign subjects.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 flex justify-between items-center">
          <h2 className="text-white text-lg font-semibold">
            Assign Subjects —{" "}
            <span className="text-indigo-200">
              {teacher?.first_name} {teacher?.last_name}
            </span>
          </h2>
          <button onClick={onClose} className="text-white/80 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-6 max-h-[70vh] overflow-y-auto space-y-4"
        >
          {/* Academic Year */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Academic Year
            </label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select Academic Year</option>
              {academicYear ? (
                <option key={academicYear.id} value={academicYear.id}>
                  {academicYear.name}
                </option>
              ) : (
                <option disabled>No academic years found</option>
              )}
            </select>
          </div>

          {/* Assignments */}
          <div className="space-y-3">
            {assignments.map((row, index) => (
              <div
                key={index}
                className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-200 relative"
              >
                {/* Subject */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subject
                  </label>
                  <select
                    value={row.subject_id}
                    onChange={(e) =>
                      handleChange(index, "subject_id", e.target.value)
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-700"
                  >
                    <option value="">Select Subject</option>
                    {subjects.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Section */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Section
                  </label>
                  <select
                    value={row.section_id}
                    onChange={(e) =>
                      handleChange(index, "section_id", e.target.value)
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-700"
                  >
                    <option value="">Select Section</option>
                    {sections.map((sec) => (
                      <option key={sec.id} value={sec.id}>
                        {sec.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Quarter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quarter
                  </label>
                  <select
                    value={row.quarter_id}
                    onChange={(e) =>
                      handleChange(index, "quarter_id", e.target.value)
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-700"
                  >
                    <option value="">Select Quarter</option>
                    {quarters.map((q) => (
                      <option key={q.id} value={q.id}>
                        {q.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Remove button */}
                {assignments.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveRow(index)}
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={handleAddRow}
            className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-medium"
          >
            <Plus className="w-4 h-4" /> Add Another Subject
          </button>
        </form>

        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            type="button"
            className="px-5 py-2 rounded-lg text-gray-700 bg-white border border-gray-300 hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-5 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {loading ? "Saving..." : "Assign Subjects"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignSubjectModal;
