import React, { useEffect, useState } from "react";
import HonorsCertificateTable from "../../components/admin/HonorCertificateTable";
import PerfectAttendanceTable from "../../components/admin/PerfectAttendanceTable";
import { BadgeAlert } from "lucide-react";
import useCertificatesStore from "../../stores/admin/certificateStore";
import useFilterStore from "../../stores/admin/filterStore";

const Certificates = () => {
  const { fetchCertificateData, loading, error } =
    useCertificatesStore();
  const { globalFilters, initializeGlobalFilters, fetchGlobalFilterOptions } =
    useFilterStore();
  const [searchName, setSearchName] = useState("");
  const [filterType, setFilterType] = useState("All");

  useEffect(() => {
    initializeGlobalFilters();
    fetchGlobalFilterOptions();
  }, [initializeGlobalFilters, fetchGlobalFilterOptions]);

  useEffect(() => {
    if (
      globalFilters.academicYearId &&
      globalFilters.sectionId &&
      globalFilters.quarterId
    ) {
      fetchCertificateData();
    }
  }, [globalFilters, fetchCertificateData]);

  const hasAllFilters =
    globalFilters.academicYearId &&
    globalFilters.sectionId &&
    globalFilters.quarterId;

  return (
    <main className="p-3 sm:p-4 lg:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              Certificate Creation
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">
              Generate and manage student certificates
            </p>
          </div>
        </div>
      </div>

      {/* Missing Filters Alert */}
      {!hasAllFilters && (
        <div className="mb-4 sm:mb-6 rounded-lg sm:rounded-xl border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 sm:p-6 shadow-sm">
          <div className="flex items-start gap-3 sm:gap-4">
            <BadgeAlert className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 flex-shrink-0" />
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-blue-800 mb-1 sm:mb-2">
                Select Filters to Continue
              </h3>
              <p className="text-xs sm:text-sm text-blue-700 leading-relaxed">
                Please select an academic year, section, and quarter from the
                header to load certificate records.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* DEMO MODE: Quarter Status Alert removed */}

      {/* Error */}
      {error && (
        <div className="mb-4 sm:mb-6 rounded-lg sm:rounded-xl border border-red-200 bg-red-50 p-3 sm:p-4 shadow-sm">
          <p className="text-xs sm:text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Skeleton Loading */}
      {loading && hasAllFilters && (
        <div className="space-y-6 sm:space-y-8">
          {[1, 2].map((section) => (
            <div
              key={section}
              className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 overflow-hidden animate-pulse"
            >
              <div className="p-4 sm:p-6 border-b border-gray-200">
                <div className="h-5 sm:h-6 w-32 sm:w-48 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 sm:h-4 w-48 sm:w-72 bg-gray-200 rounded"></div>
              </div>
              <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between border-b border-gray-100 pb-3 sm:pb-4"
                  >
                    <div className="flex items-center gap-2 sm:gap-3 flex-1">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-200 rounded-full"></div>
                      <div className="space-y-2 flex-1">
                        <div className="h-3 sm:h-4 w-24 sm:w-32 bg-gray-200 rounded"></div>
                        <div className="h-2 sm:h-3 w-16 sm:w-24 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                    <div className="h-6 sm:h-8 w-16 sm:w-24 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tables */}
      {!loading && hasAllFilters && (
        <div className="space-y-6 sm:space-y-8">
          <PerfectAttendanceTable
            searchName={searchName}
            setSearchName={setSearchName}
          />
          <HonorsCertificateTable
            searchName={searchName}
            setSearchName={setSearchName}
            filterType={filterType}
            setFilterType={setFilterType}
          />
        </div>
      )}
    </main>
  );
};

export default Certificates;