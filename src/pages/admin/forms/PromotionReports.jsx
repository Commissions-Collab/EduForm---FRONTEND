import { useEffect, useState } from "react";
import PromotionCards from "../../../components/admin/PromotionCards";
import PromotionTable from "../../../components/admin/PromotionTable";
import {
  LuBadgeAlert,
  LuCircleCheckBig,
  LuFilter,
  LuCalendar,
  LuLoader,
} from "react-icons/lu";
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
    <div className=" bg-gray-50">
      <main className="p-4">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center space-y-4 lg:space-y-0">
            <div>
              <h1 className="page-title">Promotion Reports</h1>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full font-medium">
                  SF5
                </span>
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
              <div className="relative">
                <label className="block text-xs font-medium text-gray-700 mb-1 sm:hidden">
                  Section
                </label>
                <select
                  value={sectionId}
                  onChange={(e) => setSectionId(e.target.value)}
                  className="w-full sm:w-40 px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                >
                  <option value="">Select Section</option>
                  <option value="1">Grade 10 - A</option>
                  <option value="2">Grade 10 - B</option>
                </select>
              </div>

              <div className="relative">
                <label className="block text-xs font-medium text-gray-700 mb-1 sm:hidden">
                  Academic Year
                </label>
                <select
                  value={academicYearId}
                  onChange={(e) => setAcademicYearId(e.target.value)}
                  className="w-full sm:w-40 px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                >
                  <option value="">Select Year</option>
                  <option value="1">2024</option>
                  <option value="2">2025</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Missing Filters Alert */}
        {filtersMissing && (
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200 p-6 shadow-lg mb-8">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <LuFilter className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-blue-800 mb-2">
                  Select Filters to Continue
                </h3>
                <p className="text-blue-700 mb-4">
                  Please select both section and academic year to load promotion
                  report data.
                </p>
                <div className="bg-white/60 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm text-blue-700">
                      Choose the section you want to view
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 mt-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm text-blue-700">
                      Select the academic year for the report
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* API Error Message */}
        {promotionMessage && !filtersMissing && (
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

        {/* Success State - Show Cards and Table */}
        {!filtersMissing && isPromotionAccessible && (
          <div className="space-y-8">
            {/* Promotion Summary Cards */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Promotion Summary
              </h2>
              <PromotionCards stats={overallPromotionStats} />
            </div>

            {/* Promotion Table */}
            <div>
              <PromotionTable />
            </div>
          </div>
        )}

        {/* Loading State for Initial Load */}
        {loading && !filtersMissing && (
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
