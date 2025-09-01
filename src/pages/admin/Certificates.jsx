// src/pages/admin/Certificates.jsx
import React, { useEffect, useState } from "react";
import HonorsCertificateTable from "../../components/admin/HonorCertificateTable";
import PerfectAttendanceTable from "../../components/admin/PerfectAttendanceTable";
import { useAdminStore } from "../../stores/admin";
import { LuBadgeAlert, LuLoader } from "react-icons/lu";
import { getItem } from "../../lib/utils";

const Certificates = () => {
  const { fetchAdminCertificateData, loading, error } = useAdminStore();

  // Local state synced from store/global events
  const [academicYearId, setAcademicYearId] = useState("");
  const [quarterId, setQuarterId] = useState("");
  const [sectionId, setSectionId] = useState("");

  // Load saved filters on mount
  useEffect(() => {
    const savedAcademicYear = getItem("academicYearId", false);
    const savedQuarter = getItem("quarterId", false);
    const savedSection = getItem("sectionId", false);

    if (savedAcademicYear) setAcademicYearId(savedAcademicYear);
    if (savedQuarter) setQuarterId(savedQuarter);
    if (savedSection) setSectionId(savedSection);

    if (savedAcademicYear && savedQuarter && savedSection) {
      fetchAdminCertificateData(savedSection, savedAcademicYear, savedQuarter);
    }
  }, [fetchAdminCertificateData]);

  // Listen to global filters
  useEffect(() => {
    const handleGlobalFiltersChanged = (event) => {
      const { academicYearId, quarterId, sectionId } = event.detail;

      setAcademicYearId(academicYearId || "");
      setQuarterId(quarterId || "");
      setSectionId(sectionId || "");

      if (academicYearId && quarterId && sectionId) {
        fetchAdminCertificateData(sectionId, academicYearId, quarterId);
      }
    };

    window.addEventListener("globalFiltersChanged", handleGlobalFiltersChanged);
    return () =>
      window.removeEventListener(
        "globalFiltersChanged",
        handleGlobalFiltersChanged
      );
  }, [fetchAdminCertificateData]);

  // Ensure fresh fetch when filters change
  useEffect(() => {
    if (academicYearId && quarterId && sectionId) {
      fetchAdminCertificateData(sectionId, academicYearId, quarterId);
    }
  }, [academicYearId, quarterId, sectionId, fetchAdminCertificateData]);

  const hasAllFilters = academicYearId && quarterId && sectionId;

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
            <LuBadgeAlert className="w-6 h-6 text-blue-600" />
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

      {/* Error */}
      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 shadow-sm">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Loading */}
      {loading && hasAllFilters && (
        <div className="flex justify-center items-center py-40">
          <div className="flex flex-col items-center space-y-4">
            <LuLoader className="w-11 h-11 text-blue-700 animate-spin" />
            <p className="text-gray-600">Loading certificate data...</p>
          </div>
        </div>
      )}

      {/* Tables */}
      {!loading && hasAllFilters && (
        <div className="space-y-8">
          <PerfectAttendanceTable />
          <HonorsCertificateTable />
        </div>
      )}
    </main>
  );
};

export default Certificates;
