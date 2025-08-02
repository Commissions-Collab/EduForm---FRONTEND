import { useEffect } from "react";
import { LuCalendar, LuDownload } from "react-icons/lu";
import GradesTable from "../../../components/admin/GradesTable";
import { useAdminStore } from "../../../stores/useAdminStore";

const Grades = () => {
  const { fetchGrades } = useAdminStore();

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

      <GradesTable />
    </main>
  );
};

export default Grades;
