import { useEffect, useState } from "react";
import PromotionCards from "../../../components/admin/PromotionCards";
import PromotionTable from "../../../components/admin/PromotionTable";
import { LuBadgeAlert, LuFilter, LuLoader } from "react-icons/lu";
import { useAdminStore } from "../../../stores/useAdminStore";
import { getItem } from "../../../lib/utils";

const PromotionReport = () => {
  const {
    fetchPromotionData,
    isPromotionAccessible,
    promotionMessage,
    overallPromotionStats,
    loading,
  } = useAdminStore();

  const [academicYearId, setAcademicYearId] = useState("");
  const [quarterId, setQuarterId] = useState("");
  const [sectionId, setSectionId] = useState("");

  // Get saved filters on mount
  useEffect(() => {
    const savedAcademicYear = getItem("academicYearId", false);
    const savedQuarter = getItem("quarterId", false);
    const savedSection = getItem("sectionId", false);

    if (savedAcademicYear) setAcademicYearId(savedAcademicYear);
    if (savedQuarter) setQuarterId(savedQuarter);
    if (savedSection) setSectionId(savedSection);

    if (savedAcademicYear && savedQuarter && savedSection) {
      fetchPromotionData(savedAcademicYear, savedQuarter, savedSection);
    }
  }, [fetchPromotionData]);

  // Listen for global filter changes
  useEffect(() => {
    const handleGlobalFiltersChanged = (event) => {
      const { academicYearId, quarterId, sectionId } = event.detail;

      setAcademicYearId(academicYearId || "");
      setQuarterId(quarterId || "");
      setSectionId(sectionId || "");

      if (academicYearId && quarterId && sectionId) {
        fetchPromotionData(academicYearId, quarterId, sectionId);
      }
    };

    window.addEventListener("globalFiltersChanged", handleGlobalFiltersChanged);
    return () =>
      window.removeEventListener(
        "globalFiltersChanged",
        handleGlobalFiltersChanged
      );
  }, [fetchPromotionData]);

  const hasAllFilters = academicYearId && quarterId && sectionId;

  return (
    <div className="bg-gray-50">
      <main className="p-4">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start space-y-4 sm:space-y-0">
            <div>
              <h1 className="page-title">Promotion Reports</h1>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full font-medium">
                  SF5
                </span>
                {!hasAllFilters && (
                  <span className="px-2 py-1 bg-amber-100 text-amber-800 rounded-full font-medium text-xs">
                    Please select filters from header
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Missing Filters */}
        {!hasAllFilters && (
          <div className="mt-6 bg-white rounded-lg p-8 border border-gray-200 shadow-sm text-center">
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <LuFilter className="w-6 h-6 text-gray-400" />
            </div>
            <h3 className="text-gray-700 font-medium">
              Please select Academic Year, Quarter, and Section to view
              Promotion Reports
            </h3>
          </div>
        )}

        {/* API Error */}
        {promotionMessage && hasAllFilters && (
          <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl border-2 border-amber-200 p-6 shadow-lg mb-8">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                  <LuBadgeAlert className="w-6 h-6 text-amber-600" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-amber-800 mb-2">
                  Data Not Available
                </h3>
                <h4>{promotionMessage.title}</h4>
                <p>{promotionMessage.content}</p>
              </div>
            </div>
          </div>
        )}

        {/* Success State */}
        {hasAllFilters && isPromotionAccessible && (
          <div className="space-y-8">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Promotion Summary
              </h2>
              <PromotionCards stats={overallPromotionStats} />
            </div>
            <div>
              <PromotionTable />
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && hasAllFilters && (
          <div
            className="flex justify-center items-center"
            style={{ height: "70vh" }}
          >
            <div className="flex flex-col items-center space-y-4">
              <LuLoader className="w-11 h-11 text-blue-700 animate-spin" />
              <p className="text-gray-600">Loading promotion data...</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default PromotionReport;
