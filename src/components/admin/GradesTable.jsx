import React, { useEffect, useState } from "react";
import PaginationControls from "./Pagination";
import StatusBadge from "./StatusBadge";
import { LuLoader, LuUser, LuSave, LuFilter } from "react-icons/lu";
import { VscLayoutStatusbar } from "react-icons/vsc";
import toast from "react-hot-toast";
import { useAdminStore } from "../../stores/admin";

const GradesTable = ({
  selectedAcademicYear,
  selectedQuarter,
  selectedSection,
}) => {
  const {
    students,
    subjects,
    currentPage,
    setPage,
    totalPages,
    paginatedGradeRecords,
    updateGrade,
    updateMultipleGrades,
    loading,
    error,
  } = useAdminStore();

  const [localGradeState, setLocalGradeState] = useState({});
  const [savingGrades, setSavingGrades] = useState({});
  const [unsavedChanges, setUnsavedChanges] = useState({});
  const [isBulkSaving, setIsBulkSaving] = useState(false);

  // Create enhanced records with local state
  const records = paginatedGradeRecords().map((student) => ({
    ...student,
    grades:
      student.grades?.map((grade) => ({
        ...grade,
        grade:
          localGradeState[`${student.id}-${grade.subject_id}`] !== undefined
            ? localGradeState[`${student.id}-${grade.subject_id}`]
            : grade.grade,
      })) || [],
  }));

  const pages = totalPages();
  const hasRecords = Array.isArray(records) && records.length > 0;
  const hasUnsavedChanges = Object.keys(unsavedChanges).length > 0;

  const handleGradeChange = (studentId, subjectId, grade) => {
    let numericGrade =
      grade === "" ? "" : Math.min(Math.max(Number(grade), 0), 100);

    const gradeKey = `${studentId}-${subjectId}`;
    const originalGrade = students
      .find((s) => s.id === studentId)
      ?.grades?.find((g) => g.subject_id === subjectId)?.grade;

    setLocalGradeState((prev) => ({
      ...prev,
      [gradeKey]: numericGrade,
    }));

    if (String(numericGrade) !== String(originalGrade)) {
      setUnsavedChanges((prev) => ({
        ...prev,
        [gradeKey]: {
          studentId,
          subjectId,
          grade: numericGrade,
          originalGrade,
        },
      }));
    } else {
      setUnsavedChanges((prev) => {
        const newState = { ...prev };
        delete newState[gradeKey];
        return newState;
      });
    }
  };

  const saveGrade = async (studentId, subjectId) => {
    const gradeKey = `${studentId}-${subjectId}`;
    const gradeValue = localGradeState[gradeKey];

    if (gradeValue === undefined) return;

    setSavingGrades((prev) => ({ ...prev, [gradeKey]: true }));

    try {
      const payload = {
        student_id: Number(studentId),
        subject_id: Number(subjectId),
        quarter_id: Number(selectedQuarter),
        academic_year_id: Number(selectedAcademicYear),
        grade:
          gradeValue === "" || gradeValue === null || gradeValue === undefined
            ? null
            : Number(gradeValue),
      };

      await updateGrade(payload);

      setLocalGradeState((prev) => {
        const newState = { ...prev };
        delete newState[gradeKey];
        return newState;
      });

      setUnsavedChanges((prev) => {
        const newState = { ...prev };
        delete newState[gradeKey];
        return newState;
      });

      toast.success("Grade saved successfully!");
    } catch (error) {
      console.error("Failed to save grade:", error);
      toast.error(error.message || "Failed to save grade. Please try again.");
    } finally {
      setSavingGrades((prev) => {
        const newState = { ...prev };
        delete newState[gradeKey];
        return newState;
      });
    }
  };

  const saveAllChanges = async () => {
    const changeKeys = Object.keys(unsavedChanges);
    if (changeKeys.length === 0) return;

    setIsBulkSaving(true);

    const gradeUpdates = changeKeys.map((key) => {
      const change = unsavedChanges[key];
      return {
        student_id: change.studentId,
        subject_id: change.subjectId,
        quarter_id: Number(selectedQuarter),
        academic_year_id: Number(selectedAcademicYear),
        grade:
          change.grade === "" ||
          change.grade === null ||
          change.grade === undefined
            ? null
            : Number(change.grade),
      };
    });

    try {
      await updateMultipleGrades(gradeUpdates);

      setLocalGradeState({});
      setUnsavedChanges({});
      setSavingGrades({});

      toast.success(`All ${changeKeys.length} changes saved successfully!`);
    } catch (error) {
      console.error("Bulk save failed:", error);
      toast.error(
        error.message || "Some grades failed to save. Please try again."
      );
    } finally {
      setIsBulkSaving(false);
    }
  };

  const showFiltersMessage =
    !selectedAcademicYear || !selectedQuarter || !selectedSection;

  if (showFiltersMessage) {
    return (
      <div className="bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
        <div className="px-4 sm:px-6 py-5 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">
            Grade Entry Spreadsheet
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            Please select all filters above to view and edit grades
          </p>
        </div>

        <div className="py-20">
          <div className="flex flex-col items-center space-y-3">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <LuFilter className="w-8 h-8 text-blue-600" />
            </div>
            <div className="text-center">
              <h3 className="text-gray-900 font-medium">Select Filters</h3>
              <p className="text-gray-500 text-sm mt-1">
                Choose Academic Year, Quarter, and Section to view grades
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
        <div className="px-4 sm:px-6 py-5 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Grade Entry Spreadsheet
              </h2>
              <p className="mt-1 text-sm text-gray-600">
                Enter grades — system computes average and status automatically
              </p>
            </div>
            <div className="flex items-center space-x-3">
              {hasUnsavedChanges && (
                <button
                  onClick={saveAllChanges}
                  disabled={
                    isBulkSaving || Object.keys(savingGrades).length > 0
                  }
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isBulkSaving ? (
                    <LuLoader size={16} className="mr-2 animate-spin" />
                  ) : (
                    <LuSave size={16} className="mr-2" />
                  )}
                  {isBulkSaving
                    ? `Saving ${Object.keys(unsavedChanges).length}...`
                    : `Save All (${Object.keys(unsavedChanges).length})`}
                </button>
              )}
              <div className="text-sm font-medium text-gray-700">
                Quarter: {selectedQuarter}
              </div>
            </div>
          </div>
        </div>

        {error ? (
          <div className="py-20 flex flex-col items-center space-y-3">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-red-600 font-bold text-xl">!</span>
            </div>
            <div className="text-center">
              <h3 className="text-red-900 font-medium">Error Loading Grades</h3>
              <p className="text-red-900 text-sm mt-1">{error}</p>
            </div>
          </div>
        ) : !hasRecords && !loading ? (
          <div className="py-20 flex flex-col items-center space-y-3">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
              <span className="text-gray-400 font-bold text-xl">Ø</span>
            </div>
            <div className="text-center">
              <h3 className="text-gray-900 font-medium">No Grade Records</h3>
              <p className="text-gray-500 text-sm mt-1">
                No grade records available for the selected filters.
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider sticky left-0 bg-gray-50 z-10 min-w-[200px]">
                      <div className="flex gap-2">
                        <LuUser className="w-4 h-4" />
                        Student Name
                      </div>
                    </th>
                    {subjects.map((subject) => (
                      <th
                        key={subject.id}
                        className="px-4 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[120px]"
                      >
                        {subject.name}
                      </th>
                    ))}
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[120px]">
                      <div className="flex justify-center gap-2">
                        <VscLayoutStatusbar className="w-4 h-4" />
                        Status
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loading
                    ? [...Array(5)].map((_, i) => (
                        <tr key={i}>
                          <td className="px-6 py-4 sticky left-0 bg-white z-10">
                            <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                          </td>
                          {subjects.map((subject) => (
                            <td
                              key={subject.id}
                              className="px-4 py-4 text-center"
                            >
                              <div className="h-4 w-16 bg-gray-200 rounded mx-auto animate-pulse"></div>
                            </td>
                          ))}
                          <td className="px-6 py-4 text-center">
                            <div className="h-4 w-20 bg-gray-200 rounded mx-auto animate-pulse"></div>
                          </td>
                        </tr>
                      ))
                    : records.map((student, index) => (
                        <tr
                          key={student.id}
                          className={`hover:bg-gray-50 transition-colors ${
                            index % 2 === 0 ? "bg-white" : "bg-gray-50/30"
                          }`}
                        >
                          <td className="px-6 py-4 font-semibold text-gray-900 sticky left-0 bg-inherit z-10">
                            {student.name ||
                              `${student.first_name} ${student.last_name}`.trim()}
                          </td>
                          {subjects.map((subject) => {
                            const grade = student.grades?.find(
                              (g) => g.subject_id === subject.id
                            );
                            const gradeKey = `${student.id}-${subject.id}`;
                            const hasUnsavedChange = unsavedChanges[gradeKey];
                            const isSaving = savingGrades[gradeKey];

                            return (
                              <td
                                key={subject.id}
                                className="px-4 py-4 text-center"
                              >
                                <div className="flex items-center justify-center space-x-2">
                                  <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    disabled={
                                      loading ||
                                      !grade?.can_edit ||
                                      isSaving ||
                                      isBulkSaving
                                    }
                                    value={grade?.grade ?? ""}
                                    onChange={(e) =>
                                      handleGradeChange(
                                        student.id,
                                        subject.id,
                                        e.target.value
                                      )
                                    }
                                    className={`w-16 p-2 border rounded-lg text-center focus:outline-none focus:ring-2 transition-all duration-200 text-gray-700 disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed ${
                                      hasUnsavedChange
                                        ? "border-amber-300 bg-amber-50 focus:border-amber-500"
                                        : "border-gray-300 focus:border-indigo-500"
                                    }`}
                                  />
                                  {hasUnsavedChange && !isBulkSaving && (
                                    <button
                                      onClick={() =>
                                        saveGrade(student.id, subject.id)
                                      }
                                      disabled={isSaving}
                                      className="p-1 text-indigo-600 hover:text-indigo-800 disabled:opacity-50"
                                    >
                                      {isSaving ? (
                                        <LuLoader className="w-4 h-4 animate-spin" />
                                      ) : (
                                        <LuSave className="w-4 h-4" />
                                      )}
                                    </button>
                                  )}
                                </div>
                              </td>
                            );
                          })}
                          <td className="px-6 py-5 text-center">
                            <StatusBadge status={student.status} />
                          </td>
                        </tr>
                      ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="lg:hidden divide-y divide-gray-200">
              {loading
                ? [...Array(3)].map((_, i) => (
                    <div key={i} className="p-4 sm:p-6 space-y-4 animate-pulse">
                      <div className="flex justify-between items-center">
                        <div className="h-4 w-32 bg-gray-200 rounded"></div>
                        <div className="h-4 w-16 bg-gray-200 rounded"></div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {subjects.map((subject) => (
                          <div key={subject.id} className="space-y-2">
                            <div className="h-4 w-24 bg-gray-200 rounded"></div>
                            <div className="h-10 w-full bg-gray-200 rounded"></div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                : records.map((student) => (
                    <div key={student.id} className="p-4 sm:p-6 space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900">
                            {student.name ||
                              `${student.first_name} ${student.last_name}`.trim()}
                          </h4>
                          <p className="text-sm text-gray-500 mt-1">
                            Grade Entry
                          </p>
                        </div>
                        <StatusBadge status={student.status} />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {subjects.map((subject) => {
                          const grade = student.grades?.find(
                            (g) => g.subject_id === subject.id
                          );
                          const gradeKey = `${student.id}-${subject.id}`;
                          const hasUnsavedChange = unsavedChanges[gradeKey];
                          const isSaving = savingGrades[gradeKey];

                          return (
                            <div key={subject.id} className="space-y-2">
                              <label className="block text-sm font-medium text-gray-700">
                                {subject.name}
                              </label>
                              <div className="flex items-center space-x-2">
                                <input
                                  type="number"
                                  min="0"
                                  max="100"
                                  disabled={
                                    loading ||
                                    !grade?.can_edit ||
                                    isSaving ||
                                    isBulkSaving
                                  }
                                  value={grade?.grade ?? ""}
                                  onChange={(e) =>
                                    handleGradeChange(
                                      student.id,
                                      subject.id,
                                      e.target.value
                                    )
                                  }
                                  className={`flex-1 p-3 border rounded-lg text-center focus:outline-none focus:ring-2 transition-all duration-200 text-gray-700 disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed ${
                                    hasUnsavedChange
                                      ? "border-amber-300 bg-amber-50 focus:border-amber-500 focus:ring-amber-500"
                                      : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                                  }`}
                                  placeholder="Enter grade (0-100)"
                                />
                                {hasUnsavedChange && !isBulkSaving && (
                                  <button
                                    onClick={() =>
                                      saveGrade(student.id, subject.id)
                                    }
                                    disabled={isSaving}
                                    className="p-2 text-indigo-600 hover:text-indigo-800 disabled:opacity-50 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
                                  >
                                    {isSaving ? (
                                      <LuLoader className="w-5 h-5 animate-spin" />
                                    ) : (
                                      <LuSave className="w-5 h-5" />
                                    )}
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
            </div>
          </>
        )}

        {/* Pagination */}
        {!loading && hasRecords && pages > 1 && (
          <div className="px-4 sm:px-6 py-4 border-t border-gray-200 bg-gray-50">
            <PaginationControls
              currentPage={currentPage}
              totalPages={pages}
              onPageChange={setPage}
            />
          </div>
        )}
      </div>

      {/* Unsaved Changes Warning */}
      {hasUnsavedChanges && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="w-5 h-5 text-amber-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3 flex-1">
              <h3 className="text-sm font-medium text-amber-800">
                You have unsaved changes
              </h3>
              <p className="mt-1 text-sm text-amber-700">
                {Object.keys(unsavedChanges).length} grade(s) have been modified
                but not saved. Use the individual save buttons or "Save All" to
                persist your changes.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GradesTable;
