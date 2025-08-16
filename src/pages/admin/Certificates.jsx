import React, { useEffect, useState } from "react";
import HonorsCertificateTable from "../../components/admin/HonorCertificateTable";
import PerfectAttendanceTable from "../../components/admin/PerfectAttendanceTable";
import { useAdminStore } from "../../stores/useAdminStore";
import { LuBadgeAlert, LuFilter, LuX } from "react-icons/lu";

const Certificates = () => {
  const { fetchAdminCertificateData, error, loading } = useAdminStore();

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

  // Fetch certificates when all filters are selected
  useEffect(() => {
    if (sectionId && academicYearId && quarterId) {
      localStorage.setItem("sectionId", sectionId);
      localStorage.setItem("academicYearId", academicYearId);
      localStorage.setItem("quarterId", quarterId);
      fetchAdminCertificateData();
    }
  }, [sectionId, academicYearId, quarterId]);

  const clearFilters = () => {
    setSectionId("");
    setAcademicYearId("");
    setQuarterId("");
    localStorage.removeItem("sectionId");
    localStorage.removeItem("academicYearId");
    localStorage.removeItem("quarterId");
  };

  const hasActiveFilters = sectionId || academicYearId || quarterId;

  return (
    <main className=" bg-gray-50/50 p-4 lg:p-6">
      {/* Header Section */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="page-title">Certificate Creation</h1>
            <p className="text-sm text-gray-600 mt-1">
              Generate and manage student certificates
            </p>
          </div>

          {/* Mobile Filter Toggle */}
          <div className="sm:hidden">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
            >
              <LuFilter className="w-4 h-4" />
              <span className="text-sm font-medium">Filters</span>
              {hasActiveFilters && (
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">
                  {
                    [sectionId, academicYearId, quarterId].filter(Boolean)
                      .length
                  }
                </span>
              )}
            </button>
          </div>

          {/* Desktop Filters */}
          <div className="hidden sm:flex items-center gap-3">
            <select
              value={sectionId}
              onChange={(e) => setSectionId(e.target.value)}
              className="px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors min-w-[140px]"
            >
              <option value="">Select Section</option>
              <option value="1">Grade 10 - A</option>
              <option value="2">Grade 10 - B</option>
            </select>

            <select
              value={academicYearId}
              onChange={(e) => setAcademicYearId(e.target.value)}
              className="px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors min-w-[120px]"
            >
              <option value="">Select Year</option>
              <option value="2025">2025</option>
              <option value="2024">2024</option>
            </select>

            <select
              value={quarterId}
              onChange={(e) => setQuarterId(e.target.value)}
              className="px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors min-w-[130px]"
            >
              <option value="">Select Quarter</option>
              <option value="1">1st Quarter</option>
              <option value="2">2nd Quarter</option>
              <option value="3">3rd Quarter</option>
              <option value="4">4th Quarter</option>
            </select>

            {hasActiveFilters && (
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

        {/* Mobile Filters Dropdown */}
        {showFilters && (
          <div className="sm:hidden mt-4 p-4 bg-white border border-gray-200 rounded-lg shadow-sm space-y-3">
            <select
              value={sectionId}
              onChange={(e) => setSectionId(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select Section</option>
              <option value="1">Grade 10 - A</option>
              <option value="2">Grade 10 - B</option>
            </select>

            <select
              value={academicYearId}
              onChange={(e) => setAcademicYearId(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select Year</option>
              <option value="2025">2025</option>
              <option value="2024">2024</option>
            </select>

            <select
              value={quarterId}
              onChange={(e) => setQuarterId(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select Quarter</option>
              <option value="1">1st Quarter</option>
              <option value="2">2nd Quarter</option>
              <option value="3">3rd Quarter</option>
              <option value="4">4th Quarter</option>
            </select>

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="w-full px-3 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
              >
                <LuX className="w-4 h-4" />
                Clear Filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* Warning Message */}
      {(!sectionId || !academicYearId || !quarterId) && (
        <div className="mb-6 rounded-xl border border-amber-200 bg-gradient-to-r from-amber-50 to-yellow-50 p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <LuBadgeAlert className="w-6 h-6 text-amber-500" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-amber-800 mb-2">
                Certificate Data Not Available
              </h3>
              <p className="text-sm text-amber-700 leading-relaxed">
                Please select a valid section, academic year, and quarter to
                view or generate certificate records. All filters are required
                to load attendance and honor certificates.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 shadow-sm">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Certificate Tables */}
      {sectionId && academicYearId && quarterId && (
        <div className="space-y-8">
          <PerfectAttendanceTable />
          <HonorsCertificateTable />
        </div>
      )}
    </main>
  );
};

export default Certificates;
