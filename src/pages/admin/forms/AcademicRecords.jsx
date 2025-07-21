import { useEffect } from "react";
import { LuCalendar, LuDownload } from "react-icons/lu";
import { useGradesStore } from "../../../stores/useGradesStore";
import GradesTable from "../../../components/admin/GradesTable";

const Grades = () => {
  const { fetchGrades } = useGradesStore();

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

      <div className="mt-8 blue-card">
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

      <GradesTable />
    </main>
  );
};

export default Grades;
