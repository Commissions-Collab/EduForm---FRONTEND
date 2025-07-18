import GradesTable from "../../../components/admin/GradesTable";
import { LuCalendar, LuDownload } from "react-icons/lu";
import { useGradesStore } from "../../../stores/useGradesStore";
import { useEffect } from "react";

const Grades = () => {
  const {
    updateGrade,
    selectedQuarter,
    setSelectedQuarter,
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedRecords,
    loading,
    error,
    fetchGrades,
  } = useGradesStore();

  const currentRecords = paginatedRecords();
  const totalPagesValue = totalPages();
  useEffect(() => {
    fetchGrades();
  }, []);

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

      <div className="mt-10 blue-card">
        <div className="flex items-center gap-5">
          <LuCalendar className="blue-card-icon" />
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
        students={currentRecords}
        currentPage={currentPage}
        totalPages={totalPagesValue}
        onPreviousPage={() => setCurrentPage(Math.max(currentPage - 1, 1))}
        onNextPage={() =>
          setCurrentPage(Math.min(currentPage + 1, totalPagesValue))
        }
        onInputChange={updateGrade}
        selectedQuarter={selectedQuarter}
        onQuarterChange={(e) => setSelectedQuarter(e.target.value)}
        loading={loading}
        error={error}
      />
    </main>
  );
};

export default Grades;
