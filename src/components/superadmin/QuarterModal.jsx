import React, { useState, useEffect } from "react";
import { X, Save, Plus } from "lucide-react";
import useClassManagementStore from "../../stores/superAdmin/classManagementStore";

const QuarterModal = ({
  isOpen,
  onClose,
  selectedQuarter,
  selectedAcademicYear,
  mode = "add",
}) => {
  const { createQuarter, updateQuarterDates, fetchQuartersByAcademicYear } =
    useClassManagementStore();

  const [academicYearId, setAcademicYearId] = useState("");
  const [academicYearName, setAcademicYearName] = useState("");
  const [academicYears, setAcademicYears] = useState([]);
  const [quarters, setQuarters] = useState([]);
  const [errors, setErrors] = useState({});

  const quarterLabels = [
    "1st Quarter",
    "2nd Quarter",
    "3rd Quarter",
    "4th Quarter",
  ];

  // Initialize form data based on mode and selected items
  useEffect(() => {
    if (isOpen) {
      if (mode === "edit" && selectedQuarter) {
        // Editing a single quarter from quarters tab
        setAcademicYearId(selectedQuarter.academic_year_id || "");
        setAcademicYearName(selectedQuarter.academicYear?.name || "");
        setQuarters([
          {
            id: selectedQuarter.id,
            name: selectedQuarter.name,
            start_date: selectedQuarter.start_date || "",
            end_date: selectedQuarter.end_date || "",
          },
        ]);
      } else if (mode === "edit" && selectedAcademicYear && !selectedQuarter) {
        // Editing all quarters from "Manage Quarters" button
        setAcademicYearId(selectedAcademicYear.id);
        setAcademicYearName(selectedAcademicYear.name || "");
        loadQuartersForAcademicYear(selectedAcademicYear.id);
      } else {
        // Add mode
        setAcademicYearId(selectedAcademicYear?.id || "");
        setAcademicYearName(selectedAcademicYear?.name || "");
        setQuarters([{ start_date: "", end_date: "" }]);
      }
      setErrors({});
    }
  }, [isOpen, mode, selectedQuarter, selectedAcademicYear]);

  // Load academic years for dropdown in add mode
  useEffect(() => {
    if (isOpen && mode === "add") {
      const state = useClassManagementStore.getState();
      if (state.academicYears && state.academicYears.data) {
        setAcademicYears(state.academicYears.data);
      }
    }
  }, [isOpen, mode]);

  const loadQuartersForAcademicYear = async (yearId) => {
    try {
      const data = await fetchQuartersByAcademicYear(yearId);
      if (data && data.length) {
        setQuarters(
          data.map((q) => ({
            id: q.id,
            name: q.name,
            start_date: q.start_date || "",
            end_date: q.end_date || "",
          }))
        );
      } else {
        setQuarters([{ start_date: "", end_date: "" }]);
      }
    } catch (err) {
      console.error("Error loading quarters:", err);
    }
  };

  const handleQuarterChange = (index, field, value) => {
    const updated = [...quarters];
    updated[index][field] = value;
    setQuarters(updated);
  };

  const handleAcademicYearChange = (e) => {
    const yearId = e.target.value;
    setAcademicYearId(yearId);

    // Find and set the academic year name
    const selectedYear = academicYears.find((y) => y.id == yearId);
    setAcademicYearName(selectedYear?.name || "");

    // Reset quarters when academic year changes
    setQuarters([{ start_date: "", end_date: "" }]);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!academicYearId) {
      newErrors.academic_year_id = "Academic year is required";
    }

    quarters.forEach((q, index) => {
      if (!q.start_date) {
        newErrors[`start_date_${index}`] = "Start date is required";
      }
      if (!q.end_date) {
        newErrors[`end_date_${index}`] = "End date is required";
      }
      if (
        q.start_date &&
        q.end_date &&
        new Date(q.end_date) < new Date(q.start_date)
      ) {
        newErrors[`end_date_${index}`] = "End date must be after start date";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddQuarter = () => {
    if (quarters.length >= 4) {
      alert("You can only add up to 4 quarters per academic year.");
      return;
    }
    setQuarters([...quarters, { start_date: "", end_date: "" }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      if (mode === "add") {
        await createQuarter({
          academic_year_id: academicYearId,
          quarters,
        });
      } else if (mode === "edit") {
        // Update each quarter
        for (const q of quarters) {
          if (q.id) {
            await updateQuarterDates(q.id, {
              start_date: q.start_date,
              end_date: q.end_date,
            });
          }
        }
      }
      onClose();
    } catch (err) {
      console.error("Error submitting form:", err);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 bg-black/30"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-lg p-6 w-full max-w-2xl overflow-y-auto max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            {mode === "add" ? "Add Quarters" : "Edit Quarters"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Academic Year Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Academic Year
            </label>
            {mode === "edit" ? (
              <input
                type="text"
                value={academicYearName}
                disabled
                className="mt-1 px-3 py-2 text-sm border border-gray-300 rounded-lg w-full bg-gray-100"
              />
            ) : (
              <select
                value={academicYearId}
                onChange={handleAcademicYearChange}
                className={`mt-1 px-3 py-2 text-sm border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  errors.academic_year_id
                    ? "border-red-300 bg-red-50"
                    : "border-gray-300"
                }`}
              >
                <option value="">-- Select Academic Year --</option>
                {academicYears.map((year) => (
                  <option key={year.id} value={year.id}>
                    {year.name}
                  </option>
                ))}
              </select>
            )}
            {errors.academic_year_id && (
              <p className="text-red-500 text-xs mt-1">
                {errors.academic_year_id}
              </p>
            )}
          </div>

          {/* Quarter Inputs */}
          {quarters.map((q, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg p-4 bg-gray-50"
            >
              <h3 className="font-semibold text-sm text-gray-700 mb-3">
                {q.name || quarterLabels[index] || `Quarter ${index + 1}`}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={q.start_date}
                    onChange={(e) =>
                      handleQuarterChange(index, "start_date", e.target.value)
                    }
                    className={`mt-1 px-3 py-2 text-sm border rounded-lg w-full focus:ring-2 focus:ring-indigo-500 ${
                      errors[`start_date_${index}`]
                        ? "border-red-300 bg-red-50"
                        : "border-gray-300"
                    }`}
                  />
                  {errors[`start_date_${index}`] && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors[`start_date_${index}`]}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={q.end_date}
                    onChange={(e) =>
                      handleQuarterChange(index, "end_date", e.target.value)
                    }
                    className={`mt-1 px-3 py-2 text-sm border rounded-lg w-full focus:ring-2 focus:ring-indigo-500 ${
                      errors[`end_date_${index}`]
                        ? "border-red-300 bg-red-50"
                        : "border-gray-300"
                    }`}
                  />
                  {errors[`end_date_${index}`] && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors[`end_date_${index}`]}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Add button visible only in add mode */}
          {mode === "add" && (
            <div className="flex justify-between items-center">
              <button
                type="button"
                onClick={handleAddQuarter}
                disabled={quarters.length >= 4}
                className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center space-x-1 disabled:opacity-50"
              >
                <Plus className="w-4 h-4" />
                <span>Add Quarter</span>
              </button>
              <span className="text-xs text-gray-500">
                {quarters.length}/4 quarters
              </span>
            </div>
          )}

          {/* Save/Cancel */}
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center space-x-2 transition"
            >
              <Save className="w-4 h-4" />
              <span>{mode === "add" ? "Save" : "Update"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuarterModal;
