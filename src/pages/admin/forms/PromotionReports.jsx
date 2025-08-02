import { useEffect, useState } from "react";
import PromotionCards from "../../../components/admin/PromotionCards";
import PromotionTable from "../../../components/admin/PromotionTable";
import { LuBadgeAlert, LuCircleCheckBig } from "react-icons/lu";
import { useAdminStore } from "../../../stores/useAdminStore";

const PromotionReport = () => {
  const {
    fetchPromotionData,
    isPromotionAccessible,
    promotionMessage,
    overallPromotionStats,
    loading,
  } = useAdminStore();

  const [sectionId, setSectionId] = useState(
    localStorage.getItem("sectionId") || ""
  );
  const [academicYearId, setAcademicYearId] = useState(
    localStorage.getItem("academicYearId") || ""
  );
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    if (sectionId && academicYearId) {
      localStorage.setItem("sectionId", sectionId);
      localStorage.setItem("academicYearId", academicYearId);
      fetchPromotionData().finally(() => setHasFetched(true));
    }
  }, [sectionId, academicYearId]);

  const filtersMissing = !sectionId || !academicYearId;

  return (
    <main className="p-4">
      <div className="between mb-4">
        <div>
          <div className="page-title">Promotion Reports (SF5)</div>
          <div className="text-sm text-gray-500">
            Based on final grades & attendance
          </div>
        </div>

        <div className="flex space-x-3">
          <select
            value={sectionId}
            onChange={(e) => setSectionId(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-300 rounded"
          >
            <option value="">Select Section</option>
            <option value="1">Grade 10 - A</option>
            <option value="2">Grade 10 - B</option>
          </select>

          <select
            value={academicYearId}
            onChange={(e) => setAcademicYearId(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-300 rounded"
          >
            <option value="">Select Year</option>
            <option value="1">2024</option>
            <option value="2">2025</option>
          </select>
        </div>
      </div>

      {/* Missing Filters */}
      {filtersMissing && (
        <div className="mt-10 rounded-md border border-yellow-400 bg-yellow-50 px-6 py-4 flex items-start gap-3 shadow-sm">
          <LuBadgeAlert className="w-6 h-6 text-yellow-500 mt-1" />
          <div>
            <h2 className="text-lg font-semibold text-yellow-800">
              Filters Missing
            </h2>
            <p className="text-sm text-yellow-700 mt-1">
              Please select both section and academic year to load promotion
              report data.
            </p>
          </div>
        </div>
      )}

      {/* API Error Message */}
      {promotionMessage && (
        <div className="mt-10 rounded-md border border-yellow-400 bg-yellow-50 px-6 py-4 flex items-start gap-3 shadow-sm">
          <LuBadgeAlert className="w-6 h-6 text-yellow-500 mt-1" />
          <div>
            <h2 className="text-lg font-semibold text-yellow-800">
              Filters Missing
            </h2>
            <p className="text-sm text-yellow-700 mt-1">
              Please select both section and academic year to load promotion
              report data.
            </p>
          </div>
        </div>
      )}

      {/* Promotion Table + Cards */}
      {!filtersMissing && isPromotionAccessible && (
        <>
          <div className="mt-3">
            <PromotionCards stats={overallPromotionStats} />
          </div>
          <PromotionTable />
        </>
      )}
    </main>
  );
};

export default PromotionReport;
