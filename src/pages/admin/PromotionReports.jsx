import React, { useState } from "react";
import PromotionCards from "../../components/admin/PromotionCards";
import { LuCircleCheckBig } from "react-icons/lu";
import { studentsData } from "../../constants";
import PromotionTable from "../../components/admin/PromotionTable";

const PromotionReports = () => {
  const localStudents = localStorage.getItem("students");

  const [students] = useState(
    localStudents ? JSON.parse(localStudents) : studentsData
  );

  const [currentPage, setCurrentPage] = useState(1);
  const STUDENTS_PER_PAGE = 10;
  const totalPages = Math.ceil(students.length / STUDENTS_PER_PAGE);

  const indexOfLast = currentPage * STUDENTS_PER_PAGE;
  const indexOfFirst = indexOfLast - STUDENTS_PER_PAGE;
  const currentStudents = students.slice(indexOfFirst, indexOfLast);

  return (
    <main className="p-4">
      <div className="between">
        <div className="page-title">Promotion Reports (SF5): Grade 10-A</div>
        <div className="items-center">
          <select className="px-3 py-2 text-sm border border-gray-300 rounded">
            <option value="All Quarters">End of School Year</option>
            <option value="1st Quarter">1st Quarter</option>
            <option value="2nd Quarter">2nd Quarter</option>
            <option value="3rd Quarter">3rd Quarter</option>
            <option value="4th Quarter">4th Quarter</option>
          </select>
        </div>
      </div>

      <PromotionCards />

      <div className="mt-3 blue-card">
        <div className="flex items-center gap-5">
          <LuCircleCheckBig className="blue-card-icon" />
          <div className="flex flex-col">
            <span className="text-md text-[#3730A3] font-semibold">
              Data Completeness Check
            </span>
            <span className="text-sm text-[#3730A3]/80">
              SF4 attendance records and SF9 grade data are complete. You may
              now proceed with generating the SF5 reports.
            </span>
          </div>
        </div>
      </div>

      <PromotionTable
        students={currentStudents}
        currentPage={currentPage}
        totalPages={totalPages}
        onPreviousPage={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        onNextPage={() =>
          setCurrentPage((prev) => Math.min(prev + 1, totalPages))
        }
      />
    </main>
  );
};

export default PromotionReports;
