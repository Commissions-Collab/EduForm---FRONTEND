import React, { useState } from "react";

import SearchFilter from "../../components/common/SearchFilter";
import RecordsTable from "../../components/superadmin/RecordsTable";
import { sampleStudentRecord } from "../../constants";

const Records = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("All Grades");
  const [selectedSection, setSelectedSection] = useState("All Sections");
  const [currentPage, setCurrentPage] = useState(1);

  const STUDENTS_PER_PAGE = 10;

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

  // Filtered students
  const filteredStudents = sampleStudentRecord
    .filter(
      (student) =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.lrn.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(
      (student) =>
        selectedGrade === "All Grades" || student.grade === selectedGrade
    )
    .filter(
      (student) =>
        selectedSection === "All Sections" ||
        student.section === selectedSection
    );

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
        <h1 className="text-2xl font-bold">Student Records</h1>
        <div className="flex space-x-3">
          <button
            onClick={() => alert("Export Records button clicked!")}
            className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
          >
            <svg
              className="h-5 w-5 mr-2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            Export Records
          </button>
          <button
            onClick={() => alert("Add Student button clicked!")}
            className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            <svg
              className="h-5 w-5 mr-2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
              />
            </svg>
            Add Student
          </button>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex items-center w-full space-x-3 mb-6">
        <div className="flex-grow">
          <SearchFilter
            placeholder="Search by name, ID, or LRN..."
            onSearch={handleSearch}
          />
        </div>
        <div className="p-5 bg-white rounded-xl shadow-md flex space-x-3">
          <select
            value={selectedGrade}
            onChange={handleGradeChange}
            className="px-4 py-2 border border-gray-300 rounded-lg"
          >
            <option value="All Grades">All Grades</option>
            <option value="Grade 9">Grade 9</option>
            <option value="Grade 10">Grade 10</option>
          </select>
          <select
            value={selectedSection}
            onChange={handleSectionChange}
            className="px-4 py-2 border border-gray-300 rounded-lg"
          >
            <option value="All Sections">All Sections</option>
            <option value="Section A">Section A</option>
            <option value="Section B">Section B</option>
            <option value="Section C">Section C</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <RecordsTable students={currentStudents} loading={false} />

      {/* Pagination */}
      {filteredStudents.length > 0 && (
        <div className="mt-4 flex justify-between items-center">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Records;
