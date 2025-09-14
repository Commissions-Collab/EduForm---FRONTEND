import React, { useMemo } from "react";
import { LuUsers, LuEye, LuMenu, LuInfo } from "react-icons/lu";
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

  // Get the grade level and academic year of the first selected enrollment
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

  // Check if an enrollment can be selected based on existing selections
  const canSelectEnrollment = (enrollment) => {
    if (selectedEnrollments.length === 0) return true;
    
    const enrollmentGradeLevel = enrollment.year_level?.id || enrollment.grade_level;
    const enrollmentAcademicYear = enrollment.academic_year?.id;
    
    return enrollmentGradeLevel === selectionCriteria.gradeLevel &&
           enrollmentAcademicYear === selectionCriteria.academicYear;
  };

  // Get unique student IDs from selected enrollments
  const getUniqueStudentIds = (enrollments) => {
    const uniqueStudents = new Map();
    
    enrollments.forEach(enrollment => {
      const studentId = enrollment.student_id || enrollment.student?.id;
      if (studentId && !uniqueStudents.has(studentId)) {
        uniqueStudents.set(studentId, {
          student_id: studentId,
          enrollment_id: enrollment.id,
          student: enrollment.student,
          year_level: enrollment.year_level || enrollment.yearLevel,
          academic_year: enrollment.academic_year || enrollment.academicYear,
          section: enrollment.section
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
      // Only select enrollments that match the criteria
      if (selectionCriteria) {
        const matchingRecords = filteredRecords.filter(record => 
          canSelectEnrollment(record)
        );
        
        // Get unique students from current selections and new matches
        const currentUniqueStudents = getUniqueStudentIds(selectedEnrollments);
        const newUniqueStudents = getUniqueStudentIds(matchingRecords);
        
        // Add new unique students that aren't already selected
        const studentsToAdd = newUniqueStudents.filter(newStudent => 
          !currentUniqueStudents.some(existing => existing.student_id === newStudent.student_id)
        );
        
        setSelectedEnrollments([...selectedEnrollments, ...studentsToAdd.map(student => ({
          id: student.enrollment_id,
          student_id: student.student_id,
          student: student.student,
          year_level: student.year_level,
          academic_year: student.academic_year,
          section: student.section
        }))]);
      } else {
        // If no selection criteria, pick the first record's criteria and select unique students
        const firstRecord = filteredRecords[0];
        if (firstRecord) {
          const matchingRecords = filteredRecords.filter(record => {
            const recordGradeLevel = record.year_level?.id || record.grade_level;
            const recordAcademicYear = record.academic_year?.id;
            const firstGradeLevel = firstRecord.year_level?.id || firstRecord.grade_level;
            const firstAcademicYear = firstRecord.academic_year?.id;
            
            return recordGradeLevel === firstGradeLevel && recordAcademicYear === firstAcademicYear;
          });
          
          const uniqueStudents = getUniqueStudentIds(matchingRecords);
          setSelectedEnrollments(uniqueStudents.map(student => ({
            id: student.enrollment_id,
            student_id: student.student_id,
            student: student.student,
            year_level: student.year_level,
            academic_year: student.academic_year,
            section: student.section
          })));
        }
      }
    } else {
      // Only unselect from current page
      const currentPageStudentIds = getUniqueStudentIds(filteredRecords).map(student => student.student_id);
      setSelectedEnrollments(prev => 
        prev.filter(item => !currentPageStudentIds.includes(item.student_id))
      );
    }
  };

  const handleSelectEnrollment = (enrollment) => {
    if (!canSelectEnrollment(enrollment)) {
      return; // Prevent selection if criteria don't match
    }

    const studentId = enrollment.student_id || enrollment.student?.id;
    const isAlreadySelected = selectedEnrollments.some(item => item.student_id === studentId);

    if (isAlreadySelected) {
      // Remove student from selection
      setSelectedEnrollments(prev => prev.filter(item => item.student_id !== studentId));
    } else {
      // Add student to selection
      const studentEnrollment = {
        id: enrollment.id,
        student_id: studentId,
        student: enrollment.student,
        year_level: enrollment.year_level || enrollment.yearLevel,
        academic_year: enrollment.academic_year || enrollment.academicYear,
        section: enrollment.section
      };
      setSelectedEnrollments(prev => [...prev, studentEnrollment]);
    }
  };

  const SkeletonRow = () => (
    <tr className="animate-pulse">
      <td className="px-6 py-4">
        <div className="w-4 h-4 bg-gray-200 rounded"></div>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
          <div className="w-24 h-4 bg-gray-200 rounded"></div>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="w-32 h-4 bg-gray-200 rounded"></div>
      </td>
      <td className="px-6 py-4">
        <div className="w-24 h-4 bg-gray-200 rounded"></div>
      </td>
      <td className="px-6 py-4">
        <div className="w-24 h-4 bg-gray-200 rounded"></div>
      </td>
      <td className="px-6 py-4">
        <div className="w-20 h-4 bg-gray-200 rounded"></div>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center justify-center gap-2">
          <div className="w-12 h-6 bg-gray-200 rounded"></div>
          <div className="w-8 h-6 bg-gray-200 rounded"></div>
        </div>
      </td>
    </tr>
  );

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

  // Count how many records on current page can be selected (unique students)
  const selectableRecords = getUniqueStudentIds(filteredRecords.filter(record => canSelectEnrollment(record)));
  const selectedOnCurrentPage = selectedEnrollments.filter(selected => 
    selectableRecords.some(selectable => selectable.student_id === selected.student_id)
  );

  // Get unique students count for display
  const uniqueSelectedStudents = getUniqueStudentIds(selectedEnrollments);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
        <div className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">{title}</h2>
              <p className="text-sm text-gray-600">
                Manage student enrollments
              </p>
            </div>
            <div className="flex items-center gap-4">
              {!loading && (
                <div className="text-sm text-gray-500">
                  {pagination.total}{" "}
                  {pagination.total === 1 ? "enrollment" : "enrollments"} found
                  {searchTerm && (
                    <span className="ml-1">
                      for "
                      <span className="font-medium text-gray-700">
                        {searchTerm}
                      </span>
                      "
                    </span>
                  )}
                </div>
              )}
              <button
                onClick={onAdd}
                className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center space-x-2 transition-all duration-200 shadow-sm hover:shadow"
              >
                <LuUsers className="w-4 h-4" />
                <span>Add Enrollment</span>
              </button>
              <button
                onClick={onBulk}
                disabled={uniqueSelectedStudents.length === 0}
                className={`px-4 py-2 text-sm rounded-lg flex items-center space-x-2 transition-all duration-200 shadow-sm hover:shadow ${
                  uniqueSelectedStudents.length === 0
                    ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                <LuUsers className="w-4 h-4" />
                <span>Bulk Enroll ({uniqueSelectedStudents.length})</span>
              </button>
              <button
                onClick={onPromote}
                disabled={uniqueSelectedStudents.length === 0}
                className={`px-4 py-2 text-sm rounded-lg flex items-center space-x-2 transition-all duration-200 shadow-sm hover:shadow ${
                  uniqueSelectedStudents.length === 0
                    ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                    : "bg-green-600 text-white hover:bg-green-700"
                }`}
              >
                <LuUsers className="w-4 h-4" />
                <span>Promote Selected ({uniqueSelectedStudents.length})</span>
              </button>
            </div>
          </div>
          
          {/* Selection criteria info */}
          {selectionCriteria && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2 text-sm text-blue-700">
                <LuInfo className="w-4 h-4" />
                <span>
                  Selection limited to: <strong>{selectionCriteria.gradeLevelName}</strong> in <strong>{selectionCriteria.academicYearName}</strong>
                  {uniqueSelectedStudents.length > 0 && (
                    <span className="ml-2">
                      ({uniqueSelectedStudents.length} unique student{uniqueSelectedStudents.length !== 1 ? 's' : ''} selected)
                    </span>
                  )}
                </span>
                <button
                  onClick={() => setSelectedEnrollments([])}
                  className="ml-auto text-blue-600 hover:text-blue-800 underline"
                >
                  Clear selection
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full divide-y divide-gray-200">
          <thead className="bg-gray-50/50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                <input
                  type="checkbox"
                  checked={
                    selectableRecords.length > 0 &&
                    selectedOnCurrentPage.length === selectableRecords.length
                  }
                  onChange={handleSelectAll}
                  className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                <div className="flex items-center gap-2">
                  <LuUsers className="w-4 h-4" />
                  Student
                </div>
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                LRN
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Academic Year
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Grade Level
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Section
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
            ) : error ? (
              <tr>
                <td colSpan={8} className="px-6 py-16 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                      <LuUsers className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                      <p className="font-medium text-red-900">
                        Failed to load enrollment data
                      </p>
                      <p className="text-sm text-red-600 mt-1">{error}</p>
                    </div>
                  </div>
                </td>
              </tr>
            ) : filteredRecords.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-16 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                      <LuUsers className="w-6 h-6 text-gray-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        No enrollments found
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        {searchTerm
                          ? "Try adjusting your search criteria"
                          : "No enrollments available"}
                      </p>
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              filteredRecords.map((enrollment) => {
                const isSelectable = canSelectEnrollment(enrollment);
                const studentId = enrollment.student_id || enrollment.student?.id;
                const isSelected = selectedEnrollments.some(item => item.student_id === studentId);
                
                return (
                  <tr
                    key={enrollment.id}
                    className={`transition-colors ${
                      isSelectable 
                        ? "hover:bg-gray-50/50" 
                        : selectionCriteria 
                          ? "bg-gray-25 opacity-60" 
                          : "hover:bg-gray-50/50"
                    }`}
                  >
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleSelectEnrollment(enrollment)}
                        disabled={!isSelectable && selectionCriteria}
                        className={`w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 ${
                          !isSelectable && selectionCriteria ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                          <LuUsers className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border bg-blue-100 text-blue-800 border-blue-200">
                            {enrollment.student?.first_name}{" "}
                            {enrollment.student?.middle_name && enrollment.student.middle_name + " "}{" "}
                            {enrollment.student?.last_name}
                          </span>
                        </div>
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
                    <td className="px-6 py-4 text-sm text-gray-900">
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
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <LuEye className="w-3.5 h-3.5" />
                          Edit
                        </button>
                        <button
                          onClick={() => onDelete(enrollment.id)}
                          className="inline-flex items-center gap-1 px-2 py-1.5 text-xs font-medium text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <LuMenu className="w-4 h-4" />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {!loading && !error && pagination.total > 0 && (
        <div className="border-t border-gray-200 bg-white px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <p className="text-sm text-gray-600">
              Showing {(pagination.current_page - 1) * pagination.per_page + 1}{" "}
              to{" "}
              {Math.min(
                pagination.current_page * pagination.per_page,
                pagination.total
              )}{" "}
              of {pagination.total} results
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