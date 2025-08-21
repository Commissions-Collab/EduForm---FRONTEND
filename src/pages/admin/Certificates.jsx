import React, { useEffect, useState, useMemo } from "react";
import HonorsCertificateTable from "../../components/admin/HonorCertificateTable";
import PerfectAttendanceTable from "../../components/admin/PerfectAttendanceTable";
import { useAdminStore } from "../../stores/useAdminStore";
import { LuBadgeAlert, LuFilter, LuX, LuLoader } from "react-icons/lu";

const Certificates = () => {
  const {
    fetchAdminCertificateData,
    fetchFilterOptions,
    filters,
    loading,
    error,
  } = useAdminStore();

  // State for filters
  const [sectionId, setSectionId] = useState(
    localStorage.getItem("sectionId") || ""
  );
  const [academicYearId, setAcademicYearId] = useState(
    localStorage.getItem("academicYearId") || ""
  );
  const [quarterId, setQuarterId] = useState(
    localStorage.getItem("quarterId") || ""
  );
  const [showFilters, setShowFilters] = useState(false);

  // Fetch filter options on mount
  useEffect(() => {
    fetchFilterOptions();
  }, [fetchFilterOptions]);

  // Get available sections dynamically based on academic year
  const availableSections = useMemo(() => {
    if (!academicYearId || !filters.assignments_by_year) return [];
    const yearData = filters.assignments_by_year.find(
      (y) => y.id == academicYearId
    );
    return yearData ? yearData.sections : [];
  }, [academicYearId, filters.assignments_by_year]);

  // Reset section if not valid for new year
  useEffect(() => {
    if (
      availableSections.length > 0 &&
      !availableSections.find((s) => s.id == sectionId)
    ) {
      setSectionId("");
    }
  }, [availableSections, sectionId]);

  // Fetch certificate data only when all filters are selected
  useEffect(() => {
    if (academicYearId && sectionId && quarterId) {
      localStorage.setItem("academicYearId", academicYearId);
      localStorage.setItem("sectionId", sectionId);
      localStorage.setItem("quarterId", quarterId);
      fetchAdminCertificateData(academicYearId, sectionId, quarterId);
    }
  }, [academicYearId, sectionId, quarterId, fetchAdminCertificateData]);

  const clearFilters = () => {
    setSectionId("");
    setAcademicYearId("");
    setQuarterId("");
    localStorage.removeItem("sectionId");
    localStorage.removeItem("academicYearId");
    localStorage.removeItem("quarterId");
  };

  const filtersMissing = !sectionId || !academicYearId || !quarterId;

  return (
    <main className="bg-gray-50/50 p-4 lg:p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="page-title">Certificate Creation</h1>
            <p className="text-sm text-gray-600 mt-1">
              Generate and manage student certificates
            </p>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-3">
            {/* Academic Year */}
            <select
              value={academicYearId}
              onChange={(e) => setAcademicYearId(e.target.value)}
              className="px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors min-w-[120px]"
            >
              <option value="">Select Year</option>
              {filters.academic_years?.map((year) => (
                <option key={year.id} value={year.id}>
                  {year.year}
                </option>
              ))}
            </select>

            {/* Section */}
            <select
              value={sectionId}
              onChange={(e) => setSectionId(e.target.value)}
              disabled={!academicYearId}
              className="px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors min-w-[140px] disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="">Select Section</option>
              {availableSections.map((section) => (
                <option key={section.id} value={section.id}>
                  {section.name}
                </option>
              ))}
            </select>

            {/* Quarter */}
            <select
              value={quarterId}
              onChange={(e) => setQuarterId(e.target.value)}
              className="px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors min-w-[130px]"
            >
              <option value="">Select Quarter</option>
              {filters.quarters?.map((q) => (
                <option key={q.id} value={q.id}>
                  {q.name}
                </option>
              ))}
            </select>

            {/* Clear Button */}
            {!filtersMissing && (
              <button
                onClick={clearFilters}
                className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <LuX className="w-4 h-4" />
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Missing Filters Alert */}
      {filtersMissing && (
        <div className="mb-6 rounded-xl border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <LuBadgeAlert className="w-6 h-6 text-blue-600" />
            <div>
              <h3 className="text-lg font-semibold text-blue-800 mb-2">
                Select Filters to Continue
              </h3>
              <p className="text-sm text-blue-700 leading-relaxed">
                Please select an academic year, section, and quarter to load
                certificate records.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 shadow-sm">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Loading */}
      {loading && !filtersMissing && (
        <div className="flex justify-center items-center py-40">
          <div className="flex flex-col items-center space-y-4">
            <LuLoader className="w-11 h-11 text-blue-700 animate-spin" />
            <p className="text-gray-600">Loading certificate data...</p>
          </div>
        </div>
      )}

      {/* Tables */}
      {!loading && !filtersMissing && (
        <div className="space-y-8">
          <PerfectAttendanceTable />
          <HonorsCertificateTable />
        </div>
      )}
    </main>
  );
};

export default Certificates;
