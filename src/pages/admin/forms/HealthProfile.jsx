import React, { useEffect, useState } from "react";
import { Activity, FileSpreadsheet } from "lucide-react";
import { getItem } from "../../../lib/utils";
import BmiStudentTable from "../../../components/admin/BmiStudentTable";
import useBmiStore from "../../../stores/admin/bmiStore";
import useFilterStore from "../../../stores/admin/filterStore";

const HealthProfile = () => {
  const { bmiStudents, loading, error, fetchBmiStudents, exportSF8Excel } = useBmiStore();
  const { globalFilters } = useFilterStore();

  const [selectedAcademicYear, setSelectedAcademicYear] = useState("");
  const [selectedQuarter, setSelectedQuarter] = useState("");
  const [selectedSection, setSelectedSection] = useState("");

  useEffect(() => {
    const savedAcademicYear = getItem("academicYearId", false);
    const savedQuarter = getItem("quarterId", false);
    const savedSection = getItem("sectionId", false);

    if (savedAcademicYear) setSelectedAcademicYear(savedAcademicYear);
    if (savedQuarter) setSelectedQuarter(savedQuarter);
    if (savedSection) setSelectedSection(savedSection);

    if (savedAcademicYear && savedQuarter && savedSection) {
      fetchBmiStudents(savedSection, savedAcademicYear, savedQuarter);
    }
  }, [fetchBmiStudents]);

  useEffect(() => {
    const handleGlobalFiltersChanged = (event) => {
      const { academicYearId, quarterId, sectionId } = event.detail;

      setSelectedAcademicYear(academicYearId || "");
      setSelectedQuarter(quarterId || "");
      setSelectedSection(sectionId || "");

      if (academicYearId && quarterId && sectionId) {
        fetchBmiStudents(sectionId, academicYearId, quarterId);
      }
    };

    window.addEventListener("globalFiltersChanged", handleGlobalFiltersChanged);

    return () => {
      window.removeEventListener(
        "globalFiltersChanged",
        handleGlobalFiltersChanged
      );
    };
  }, [fetchBmiStudents]);

  useEffect(() => {
    setSelectedAcademicYear(globalFilters.academicYearId || "");
    setSelectedQuarter(globalFilters.quarterId || "");
    setSelectedSection(globalFilters.sectionId || "");

    if (
      globalFilters.academicYearId &&
      globalFilters.quarterId &&
      globalFilters.sectionId
    ) {
      fetchBmiStudents(
        globalFilters.sectionId,
        globalFilters.academicYearId,
        globalFilters.quarterId
      );
    }
  }, [globalFilters, fetchBmiStudents]);

  const hasAllFilters =
    selectedAcademicYear && selectedQuarter && selectedSection;
  const hasData = bmiStudents?.length > 0;

  const handleExportSF8Excel = async () => {
    if (!hasAllFilters) {
      alert("Please select Academic Year, Quarter, and Section from the filters");
      return;
    }

    try {
      await exportSF8Excel();
    } catch (err) {
      console.error("SF8 Export failed:", err);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <main className="p-3 sm:p-4 lg:p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 sm:gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                Health Profile (SF)
              </h1>
              <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-gray-600 mt-2">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full font-medium">
                  SF8
                </span>
                {!hasAllFilters && (
                  <span className="px-2 py-1 bg-amber-100 text-amber-800 rounded-full font-medium text-xs">
                    Please select filters from header
                  </span>
                )}
              </div>
            </div>
            {hasAllFilters && (
              <button
                onClick={handleExportSF8Excel}
                disabled={loading || !hasAllFilters}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                title="Export SF8 Health Report Excel"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Exporting...</span>
                  </>
                ) : (
                  <>
                    <FileSpreadsheet size={18} />
                    <span>Export SF8 Excel</span>
                  </>
                )}
              </button>
            )}
          </div>

          {/* No Filters Message */}
          {!hasAllFilters && (
            <div className="mt-6 bg-white rounded-lg p-6 sm:p-8 border border-gray-200 shadow-sm text-center">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Activity className="w-6 h-6 text-gray-400" />
              </div>
              <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
                Select Filters to View Health Profile
              </h3>
              <p className="text-sm sm:text-base text-gray-500">
                Please select Academic Year, Quarter, and Section from the
                filter dropdown in the header to view BMI and health records.
              </p>
            </div>
          )}
        </div>

        {/* BMI Table */}
        {hasAllFilters && (
          <BmiStudentTable
            students={bmiStudents}
            loading={loading}
            error={error}
          />
        )}
      </main>
    </div>
  );
};

export default HealthProfile;
