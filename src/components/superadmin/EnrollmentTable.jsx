import React, { useMemo } from "react";
import { User, Info, Eye, Menu, Trash2 } from "lucide-react";
import Pagination from "./Pagination";
import useEnrollmentStore from "../../stores/superAdmin/enrollmentStore";

const EnrollmentTable = ({
  title,
  data,
  searchTerm,
  loading,
  error,
  selectedEnrollments,
  setSelectedEnrollments,
  onAdd,
  onBulk,
  onPromote,
  onEdit,
  onDelete,
}) => {
  const { fetchEnrollments, pagination } = useEnrollmentStore();

  const filteredRecords = useMemo(() => {
    return data.filter((item) =>
      `${item.student?.first_name} ${item.student?.middle_name || ""} ${
        item.student?.last_name
      } ${item.student?.lrn} ${item.section?.name}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  }, [data, searchTerm]);

  const selectionCriteria = useMemo(() => {
    if (selectedEnrollments.length === 0) return null;
    const firstSelection = selectedEnrollments[0];
    return {
      gradeLevel: firstSelection.year_level?.id || firstSelection.grade_level,
      gradeLevelName: firstSelection.year_level?.name,
      academicYear: firstSelection.academic_year?.id,
      academicYearName: firstSelection.academic_year?.name,
    };
  }, [selectedEnrollments]);

  const canSelectEnrollment = (enrollment) => {
    if (selectedEnrollments.length === 0) return true;
    const enrollmentGradeLevel =
      enrollment.year_level?.id || enrollment.grade_level;
    const enrollmentAcademicYear = enrollment.academic_year?.id;
    return (
      enrollmentGradeLevel === selectionCriteria.gradeLevel &&
      enrollmentAcademicYear === selectionCriteria.academicYear
    );
  };

  const getUniqueStudentIds = (enrollments) => {
    const uniqueStudents = new Map();
    enrollments.forEach((enrollment) => {
      const studentId = enrollment.student_id || enrollment.student?.id;
      if (studentId && !uniqueStudents.has(studentId)) {
        uniqueStudents.set(studentId, {
          student_id: studentId,
          enrollment_id: enrollment.id,
          student: enrollment.student,
          year_level: enrollment.year_level || enrollment.yearLevel,
          academic_year: enrollment.academic_year || enrollment.academicYear,
          section: enrollment.section,
        });
      }
    });
    return Array.from(uniqueStudents.values());
  };

  const handlePageChange = (page) => {
    fetchEnrollments(page, pagination.per_page);
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      if (selectionCriteria) {
        const matchingRecords = filteredRecords.filter((record) =>
          canSelectEnrollment(record)
        );
        const currentUniqueStudents = getUniqueStudentIds(selectedEnrollments);
        const newUniqueStudents = getUniqueStudentIds(matchingRecords);
        const studentsToAdd = newUniqueStudents.filter(
          (newStudent) =>
            !currentUniqueStudents.some(
              (existing) => existing.student_id === newStudent.student_id
            )
        );
        setSelectedEnrollments([
          ...selectedEnrollments,
          ...studentsToAdd.map((student) => ({
            id: student.enrollment_id,
            student_id: student.student_id,
            student: student.student,
            year_level: student.year_level,
            academic_year: student.academic_year,
            section: student.section,
          })),
        ]);
      } else {
        const firstRecord = filteredRecords[0];
        if (firstRecord) {
          const matchingRecords = filteredRecords.filter((record) => {
            const recordGradeLevel =
              record.year_level?.id || record.grade_level;
            const recordAcademicYear = record.academic_year?.id;
            const firstGradeLevel =
              firstRecord.year_level?.id || firstRecord.grade_level;
            const firstAcademicYear = firstRecord.academic_year?.id;
            return (
              recordGradeLevel === firstGradeLevel &&
              recordAcademicYear === firstAcademicYear
            );
          });
          const uniqueStudents = getUniqueStudentIds(matchingRecords);
          setSelectedEnrollments(
            uniqueStudents.map((student) => ({
              id: student.enrollment_id,
              student_id: student.student_id,
              student: student.student,
              year_level: student.year_level,
              academic_year: student.academic_year,
              section: student.section,
            }))
          );
        }
      }
    } else {
      const currentPageStudentIds = getUniqueStudentIds(filteredRecords).map(
        (student) => student.student_id
      );
      setSelectedEnrollments((prev) =>
        prev.filter((item) => !currentPageStudentIds.includes(item.student_id))
      );
    }
  };

  const handleSelectEnrollment = (enrollment) => {
    if (!canSelectEnrollment(enrollment)) return;
    const studentId = enrollment.student_id || enrollment.student?.id;
    const isAlreadySelected = selectedEnrollments.some(
      (item) => item.student_id === studentId
    );
    if (isAlreadySelected) {
      setSelectedEnrollments((prev) =>
        prev.filter((item) => item.student_id !== studentId)
      );
    } else {
      const studentEnrollment = {
        id: enrollment.id,
        student_id: studentId,
        student: enrollment.student,
        year_level: enrollment.year_level || enrollment.yearLevel,
        academic_year: enrollment.academic_year || enrollment.academicYear,
        section: enrollment.section,
      };
      setSelectedEnrollments((prev) => [...prev, studentEnrollment]);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "enrolled":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "withdrawn":
        return "bg-red-100 text-red-800 border-red-200";
      case "transferred":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const selectableRecords = getUniqueStudentIds(
    filteredRecords.filter((record) => canSelectEnrollment(record))
  );
  const selectedOnCurrentPage = selectedEnrollments.filter((selected) =>
    selectableRecords.some(
      (selectable) => selectable.student_id === selected.student_id
    )
  );
  const uniqueSelectedStudents = getUniqueStudentIds(selectedEnrollments);

  // Mobile Card Component
  const EnrollmentCard = ({ enrollment }) => {
    const isSelectable = canSelectEnrollment(enrollment);
    const studentId = enrollment.student_id || enrollment.student?.id;
    const isSelected = selectedEnrollments.some(
      (item) => item.student_id === studentId
    );

    return (
      <div
        className={`bg-white border border-gray-200 rounded-lg p-4 ${
          isSelected ? "ring-2 ring-indigo-500" : ""
        }`}
      >
        <div className="flex items-start gap-3 mb-3">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => handleSelectEnrollment(enrollment)}
            disabled={!isSelectable && selectionCriteria}
            className="mt-1 w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-sm font-medium text-gray-900 truncate">
                {enrollment.student?.first_name}{" "}
                {enrollment.student?.middle_name}{" "}
                {enrollment.student?.last_name}
              </h3>
            </div>
            <div className="space-y-1 text-xs text-gray-600">
              <p>
                <span className="font-medium">LRN:</span>{" "}
                {enrollment.student?.lrn || "N/A"}
              </p>
              <p>
                <span className="font-medium">Year:</span>{" "}
                {enrollment.academic_year?.name || "-"}
              </p>
              <p>
                <span className="font-medium">Grade:</span>{" "}
                {enrollment.year_level?.name || "-"}
              </p>
              <p>
                <span className="font-medium">Section:</span>{" "}
                {enrollment.section?.name || "-"}
              </p>
            </div>
            <div className="mt-2">
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
                  enrollment.enrollment_status
                )}`}
              >
                {enrollment.enrollment_status}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 pt-3 border-t border-gray-200">
          <button
            onClick={() => onEdit(enrollment)}
            className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            Edit
          </button>
          <button
            onClick={() => onDelete(enrollment.id)}
            className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Delete
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
        <div className="p-4 sm:p-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
              <div>
                <h2 className="text-base sm:text-xl font-bold text-gray-900 mb-1 sm:mb-2">
                  {title}
                </h2>
                <p className="text-xs sm:text-sm text-gray-600">
                  Manage student enrollments
                </p>
              </div>
              {!loading && (
                <div className="text-xs sm:text-sm text-gray-500">
                  {pagination.total}{" "}
                  {pagination.total === 1 ? "enrollment" : "enrollments"}
                  {searchTerm && (
                    <span className="ml-1">for "{searchTerm}"</span>
                  )}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                onClick={onAdd}
                className="flex items-center justify-center gap-2 px-3 py-2 text-xs sm:text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all"
              >
                <User className="w-4 h-4" />
                <span>Add</span>
              </button>
              <button
                onClick={onBulk}
                disabled={uniqueSelectedStudents.length === 0}
                className={`flex items-center justify-center gap-2 px-3 py-2 text-xs sm:text-sm rounded-lg transition-all ${
                  uniqueSelectedStudents.length === 0
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                <User className="w-4 h-4" />
                <span>Bulk ({uniqueSelectedStudents.length})</span>
              </button>
              <button
                onClick={onPromote}
                disabled={uniqueSelectedStudents.length === 0}
                className={`flex items-center justify-center gap-2 px-3 py-2 text-xs sm:text-sm rounded-lg transition-all ${
                  uniqueSelectedStudents.length === 0
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-green-600 text-white hover:bg-green-700"
                }`}
              >
                <User className="w-4 h-4" />
                <span>Promote ({uniqueSelectedStudents.length})</span>
              </button>
            </div>

            {/* Selection Info */}
            {selectionCriteria && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-xs sm:text-sm text-blue-700">
                  <div className="flex items-start gap-2 flex-1">
                    <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>
                      <strong>{selectionCriteria.gradeLevelName}</strong> in{" "}
                      <strong>{selectionCriteria.academicYearName}</strong>
                      {uniqueSelectedStudents.length > 0 && (
                        <span className="block sm:inline sm:ml-2">
                          ({uniqueSelectedStudents.length} selected)
                        </span>
                      )}
                    </span>
                  </div>
                  <button
                    onClick={() => setSelectedEnrollments([])}
                    className="text-blue-600 hover:text-blue-800 underline text-xs whitespace-nowrap"
                  >
                    Clear
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="p-4 space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-gray-50 rounded-lg p-4 animate-pulse">
              <div className="flex gap-3">
                <div className="w-4 h-4 bg-gray-200 rounded"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                  <div className="h-3 bg-gray-200 rounded w-48"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="px-4 py-12 text-center">
          <User className="w-12 h-12 text-red-600 mx-auto mb-2" />
          <p className="font-medium text-red-900 text-sm">
            Failed to load data
          </p>
          <p className="text-xs text-red-600 mt-1">{error}</p>
        </div>
      ) : filteredRecords.length === 0 ? (
        <div className="px-4 py-12 text-center">
          <User className="w-12 h-12 text-gray-400 mx-auto mb-2" />
          <p className="font-medium text-gray-900 text-sm">
            No enrollments found
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {searchTerm
              ? "Try adjusting your search"
              : "No enrollments available"}
          </p>
        </div>
      ) : (
        <>
          {/* Mobile Card View */}
          <div className="block lg:hidden p-4 space-y-4">
            {filteredRecords.map((enrollment) => (
              <EnrollmentCard key={enrollment.id} enrollment={enrollment} />
            ))}
          </div>

          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50/50">
                <tr>
                  <th className="px-6 py-4 text-left">
                    <input
                      type="checkbox"
                      checked={
                        selectableRecords.length > 0 &&
                        selectedOnCurrentPage.length ===
                          selectableRecords.length
                      }
                      onChange={handleSelectAll}
                      className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    />
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Student
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                    LRN
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                    Academic Year
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                    Grade Level
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                    Section
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRecords.map((enrollment) => {
                  const isSelectable = canSelectEnrollment(enrollment);
                  const studentId =
                    enrollment.student_id || enrollment.student?.id;
                  const isSelected = selectedEnrollments.some(
                    (item) => item.student_id === studentId
                  );

                  return (
                    <tr
                      key={enrollment.id}
                      className={`transition-colors ${
                        isSelectable
                          ? "hover:bg-gray-50"
                          : selectionCriteria
                          ? "bg-gray-25 opacity-60"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleSelectEnrollment(enrollment)}
                          disabled={!isSelectable && selectionCriteria}
                          className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                            <User className="w-5 h-5 text-white" />
                          </div>
                          <span className="text-sm font-medium text-gray-900">
                            {enrollment.student?.first_name}{" "}
                            {enrollment.student?.middle_name}{" "}
                            {enrollment.student?.last_name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {enrollment.student?.lrn || "N/A"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {enrollment.academic_year?.name || "-"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {enrollment.year_level?.name || "-"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {enrollment.section?.name || "-"}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                            enrollment.enrollment_status
                          )}`}
                        >
                          {enrollment.enrollment_status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => onEdit(enrollment)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded-lg"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            Edit
                          </button>
                          <button
                            onClick={() => onDelete(enrollment.id)}
                            className="inline-flex items-center gap-1 px-2 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      {!loading && !error && pagination.total > 0 && (
        <div className="border-t border-gray-200 bg-white px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <p className="text-xs sm:text-sm text-gray-600">
              Showing {(pagination.current_page - 1) * pagination.per_page + 1}{" "}
              to{" "}
              {Math.min(
                pagination.current_page * pagination.per_page,
                pagination.total
              )}{" "}
              of {pagination.total}
            </p>
            <Pagination
              currentPage={pagination.current_page}
              totalPages={Math.ceil(pagination.total / pagination.per_page)}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default EnrollmentTable;
