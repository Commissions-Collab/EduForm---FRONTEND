import React, { useEffect, useState } from "react";
import HonorsCertificateTable from "../../components/admin/HonorCertificateTable";
import PerfectAttendanceTable from "../../components/admin/PerfectAttendanceTable";
import { BadgeAlert, CalendarX } from "lucide-react";

import useCertificatesStore from "../../stores/admin/certificateStore";
import useFilterStore from "../../stores/admin/filterStore";

const Certificates = () => {
  const { fetchCertificateData, loading, error, quarterComplete } =
    useCertificatesStore();
  const { globalFilters, initializeGlobalFilters, fetchGlobalFilterOptions } =
    useFilterStore();
  const [searchName, setSearchName] = useState("");
  const [filterType, setFilterType] = useState("All");

  // Initialize filters on mount
  useEffect(() => {
    initializeGlobalFilters();
    fetchGlobalFilterOptions();
  }, [initializeGlobalFilters, fetchGlobalFilterOptions]);

  // Fetch certificate data when filters change
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
        </div>
      </div>

      {/* Missing Filters Alert */}
      {!hasAllFilters && (
        <div className="mb-6 rounded-xl border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <BadgeAlert className="w-6 h-6 text-blue-600" />
            <div>
              <h3 className="text-lg font-semibold text-blue-800 mb-2">
                Select Filters to Continue
              </h3>
              <p className="text-sm text-blue-700 leading-relaxed">
                Please select an academic year, section, and quarter from the
                header to load certificate records.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Quarter Status Alert */}
      {hasAllFilters && !loading && !quarterComplete && (
        <div className="mb-6 rounded-xl border border-amber-200 bg-gradient-to-r from-amber-50 to-yellow-50 p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <CalendarX className="w-6 h-6 text-amber-600" />
            <div>
              <h3 className="text-lg font-semibold text-amber-800 mb-2">
                Quarter In Progress
              </h3>
              <p className="text-sm text-amber-700 leading-relaxed">
                The selected quarter has not ended yet. Certificate generation
                will be enabled once the quarter end date has passed and all
                required data is complete.
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

      {/* Skeleton Loading */}
      {loading && hasAllFilters && (
        <div className="space-y-8">
          {/* Skeleton block for PerfectAttendanceTable */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden animate-pulse">
            <div className="p-6 border-b border-gray-200">
              <div className="h-6 w-48 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 w-72 bg-gray-200 rounded"></div>
            </div>
            <div className="p-6 space-y-4">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between border-b border-gray-100 pb-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                    <div className="space-y-2">
                      <div className="h-4 w-32 bg-gray-200 rounded"></div>
                      <div className="h-3 w-24 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                  <div className="h-8 w-24 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Skeleton block for HonorsCertificateTable */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden animate-pulse">
            <div className="p-6 border-b border-gray-200">
              <div className="h-6 w-56 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 w-64 bg-gray-200 rounded"></div>
            </div>
            <div className="p-6 space-y-4">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between border-b border-gray-100 pb-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                    <div className="space-y-2">
                      <div className="h-4 w-28 bg-gray-200 rounded"></div>
                      <div className="h-3 w-20 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                  <div className="h-8 w-20 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tables */}
      {!loading && hasAllFilters && (
        <div className="space-y-8">
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
