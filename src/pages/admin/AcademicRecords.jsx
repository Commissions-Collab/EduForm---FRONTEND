import React, { useState } from "react";
import { LuCalendar, LuDownload } from "react-icons/lu";
import GradesTable from "../../components/admin/GradesTable";
import { studentList } from "../../constants";

const Records = () => {
  const [selectedQuarter, setSelectedQuarter] = useState("All Quarters");
  const [students, setStudents] = useState(studentList);

  const handleQuarterChange = (e) => setSelectedQuarter(e.target.value);

  const [currentPage, setCurrentPage] = useState(1);
  const STUDENTS_PER_PAGE = 10;

  const indexOfLast = currentPage * STUDENTS_PER_PAGE;
  const indexOfFirst = indexOfLast - STUDENTS_PER_PAGE;
  const currentStudents = students.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(students.length / STUDENTS_PER_PAGE);

  const handleInputChange = (id, field, value) => {
    const updatedStudents = students.map((student) =>
      student.id === id
        ? {
            ...student,
            [field]:
              field === "name" ? value : value === "" ? "" : Number(value),
          }
        : student
    );
    setStudents(updatedStudents);
  };

  return (
    <main className="p-4">
      <div className="between">
        <div className="page-title">
          Quarterly Grade Encoding (SF9): Grade 10-A
        </div>
        <div className="inline-flex items-center px-2 py-1 text-sm rounded-lg bg-yellow-50 text-yellow-600">
          <LuDownload size={14} />
          <span className="ml-2">Locks in : 5 days</span>
        </div>
      </div>

      <div className="mt-10  blue-card">
        <div className="flex items-center gap-5">
          <LuCalendar className=" blue-card-icon" />
          <div className="flex flex-col">
            <span className="text-md text-[#3730A3] font-semibold">
              Honor Roll Eligibility
            </span>
            <span className="text-sm text-[#3730A3]/80">
              3 students qualify for "With High Honors"
            </span>
          </div>
        </div>
      </div>

      <GradesTable
        students={currentStudents}
        currentPage={currentPage}
        totalPages={totalPages}
        onPreviousPage={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        onNextPage={() =>
          setCurrentPage((prev) => Math.min(prev + 1, totalPages))
        }
        onInputChange={handleInputChange}
        selectedQuarter={selectedQuarter}
        onQuarterChange={handleQuarterChange}
      />
    </main>
  );
};

export default Records;
