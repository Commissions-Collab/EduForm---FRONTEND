import React, { useState, useEffect } from "react";
import { useSuperAdminStore } from "../../stores/superAdmin";
import SearchFilter from "../../components/common/SearchFilter";
import RecordsTable from "../../components/superadmin/RecordsTable";

import { LuUserPlus, LuDownload } from "react-icons/lu";
import StudentModal from "../../components/superadmin/StudentModal";

const Records = () => {
  const {
    studentRecords,
    isLoading,
    fetchStudentRecords,
    deleteStudentRecord,
    updateStudentRecord,
  } = useSuperAdminStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("All Grades");
  const [selectedSection, setSelectedSection] = useState("All Sections");
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const STUDENTS_PER_PAGE = 10;

  // Fetch student records on component mount
  useEffect(() => {
    fetchStudentRecords();
  }, [fetchStudentRecords]);

  const handleSearch = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleGradeChange = (e) => {
    setSelectedGrade(e.target.value);
    setCurrentPage(1);
  };

  const handleSectionChange = (e) => {
    setSelectedSection(e.target.value);
    setCurrentPage(1);
  };

  const handleStatusChange = (e) => {
    setSelectedStatus(e.target.value);
    setCurrentPage(1);
  };

  const handleEdit = (student) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  const handleDelete = async (studentId) => {
    if (
      window.confirm("Are you sure you want to delete this student record?")
    ) {
      await deleteStudentRecord(studentId);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedStudent(null);
  };

  const handleModalSave = async (studentData) => {
    if (selectedStudent) {
      await updateStudentRecord(selectedStudent.id, studentData);
    }
    handleModalClose();
  };

  const handleExport = () => {
    // Create CSV content from filtered students
    const csvContent = [
      [
        "Name",
        "Student ID",
        "LRN",
        "Grade",
        "Section",
        "Status",
        "GWA",
        "Attendance",
      ].join(","),
      ...filteredStudents.map((student) =>
        [
          student.name || student.first_name + " " + student.last_name,
          student.student_id || student.id,
          student.lrn,
          student.grade || student.year_level,
          student.section,
          student.status || student.enrollment_status,
          student.gwa || "N/A",
          student.attendance || "N/A",
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("hidden", "");
    a.setAttribute("href", url);
    a.setAttribute("download", "student_records.csv");
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Get unique values for filter options
  const uniqueGrades = [
    ...new Set(
      studentRecords.map(
        (student) => student.grade || student.year_level || "Unknown"
      )
    ),
  ].filter(Boolean);

  const uniqueSections = [
    ...new Set(studentRecords.map((student) => student.section || "Unknown")),
  ].filter(Boolean);

  const uniqueStatuses = [
    ...new Set(
      studentRecords.map(
        (student) => student.status || student.enrollment_status || "Unknown"
      )
    ),
  ].filter(Boolean);

  // Filter students based on search and filter criteria
  const filteredStudents = studentRecords.filter((student) => {
    const name =
      student.name ||
      `${student.first_name || ""} ${student.last_name || ""}`.trim();
    const studentId = student.student_id || student.id || "";
    const lrn = student.lrn || "";
    const grade = student.grade || student.year_level || "";
    const section = student.section || "";
    const status = student.status || student.enrollment_status || "";

    // Search filter
    const matchesSearch =
      searchTerm === "" ||
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      studentId.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
      lrn.toString().toLowerCase().includes(searchTerm.toLowerCase());

    // Grade filter
    const matchesGrade =
      selectedGrade === "All Grades" || grade.toString() === selectedGrade;

    // Section filter
    const matchesSection =
      selectedSection === "All Sections" || section === selectedSection;

    // Status filter
    const matchesStatus =
      selectedStatus === "All Status" || status === selectedStatus;

    return matchesSearch && matchesGrade && matchesSection && matchesStatus;
  });

  // Pagination
  const indexOfLastStudent = currentPage * STUDENTS_PER_PAGE;
  const indexOfFirstStudent = indexOfLastStudent - STUDENTS_PER_PAGE;
  const currentStudents = filteredStudents.slice(
    indexOfFirstStudent,
    indexOfLastStudent
  );
  const totalPages = Math.max(
    1,
    Math.ceil(filteredStudents.length / STUDENTS_PER_PAGE)
  );

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Student Records</h1>
          <p className="text-gray-600 mt-1">
            Manage and view all student records ({filteredStudents.length}{" "}
            students)
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleExport}
            disabled={filteredStudents.length === 0}
            className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <LuDownload className="h-5 w-5 mr-2" />
            Export Records
          </button>
          <button
            onClick={() => {
              setSelectedStudent(null);
              setIsModalOpen(true);
            }}
            className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <LuUserPlus className="h-5 w-5 mr-2" />
            Add Student
          </button>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        <div className="flex-grow">
          <SearchFilter
            placeholder="Search by name, Student ID, or LRN..."
            onSearch={handleSearch}
          />
        </div>
        <div className="p-5 bg-white rounded-xl shadow-md">
          <div className="flex flex-wrap gap-3">
            <select
              value={selectedGrade}
              onChange={handleGradeChange}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="All Grades">All Grades</option>
              {uniqueGrades.map((grade) => (
                <option key={grade} value={grade}>
                  {grade}
                </option>
              ))}
            </select>
            <select
              value={selectedSection}
              onChange={handleSectionChange}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="All Sections">All Sections</option>
              {uniqueSections.map((section) => (
                <option key={section} value={section}>
                  {section}
                </option>
              ))}
            </select>
            <select
              value={selectedStatus}
              onChange={handleStatusChange}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="All Status">All Status</option>
              {uniqueStatuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results Summary */}
      {searchTerm && (
        <div className="mb-4 text-sm text-gray-600">
          Showing {filteredStudents.length} results for "{searchTerm}"
        </div>
      )}

      {/* Table */}
      <RecordsTable
        students={currentStudents}
        loading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Pagination */}
      {filteredStudents.length > 0 && (
        <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-sm text-gray-700">
            Showing {indexOfFirstStudent + 1} to{" "}
            {Math.min(indexOfLastStudent, filteredStudents.length)} of{" "}
            {filteredStudents.length} results
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <span className="px-3 py-2 text-sm text-gray-700">
              {currentPage} of {totalPages}
            </span>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="px-3 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Student Modal */}
      {isModalOpen && (
        <StudentModal
          student={selectedStudent}
          isOpen={isModalOpen}
          onClose={handleModalClose}
          onSave={handleModalSave}
        />
      )}
    </div>
  );
};

export default Records;
