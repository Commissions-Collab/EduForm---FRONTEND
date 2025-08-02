import React, { useEffect, useState } from "react";
import HonorsCertificateTable from "../../components/admin/HonorCertificateTable";
import PerfectAttendanceTable from "../../components/admin/PerfectAttendanceTable";
import { useAdminStore } from "../../stores/useAdminStore";
import { LuBadgeAlert } from "react-icons/lu";

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

  // Fetch certificates when all filters are selected
  useEffect(() => {
    if (sectionId && academicYearId && quarterId) {
      localStorage.setItem("sectionId", sectionId);
      localStorage.setItem("academicYearId", academicYearId);
      localStorage.setItem("quarterId", quarterId);
      fetchAdminCertificateData();
    }
  }, [sectionId, academicYearId, quarterId]);

  return (
    <main className="p-4">
      <div className="between mb-4">
        <div className="page-title">Certificate Creation</div>
        <div className="flex space-x-3">
          {/* Section Select */}
          <select
            value={sectionId}
            onChange={(e) => setSectionId(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-300 rounded"
          >
            <option value="">Select Section</option>
            <option value="1">Grade 10 - A</option>
            <option value="2">Grade 10 - B</option>
            {/* Add more if needed */}
          </select>

          {/* Academic Year Select */}
          <select
            value={academicYearId}
            onChange={(e) => setAcademicYearId(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-300 rounded"
          >
            <option value="">Select Year</option>
            <option value="2025">2025</option>
            <option value="2024">2024</option>
          </select>

          {/* Quarter Select */}
          <select
            value={quarterId}
            onChange={(e) => setQuarterId(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-300 rounded"
          >
            <option value="">Select Quarter</option>
            <option value="1">1st Quarter</option>
            <option value="2">2nd Quarter</option>
            <option value="3">3rd Quarter</option>
            <option value="4">4th Quarter</option>
          </select>
        </div>
      </div>

      {(!sectionId || !academicYearId || !quarterId) && (
        <div className="mt-10 rounded-md border border-yellow-400 bg-yellow-50 px-6 py-4 flex items-start gap-3 shadow-sm">
          <LuBadgeAlert className="w-6 h-6 text-yellow-500 mt-1" />
          <div>
            <h2 className="text-lg font-semibold text-yellow-800">
              Certificate Data Not Available
            </h2>
            <p className="text-sm text-yellow-700 mt-1">
              Please select a valid section, academic year, and quarter to view
              or generate certificate records. All filters are required to load
              attendance and honor certificates.
            </p>
          </div>
        </div>
      )}

      {error && <div className="text-sm text-red-600 mb-4">{error}</div>}

      {sectionId && academicYearId && quarterId && (
        <>
          <PerfectAttendanceTable />
          <HonorsCertificateTable />
        </>
      )}
    </main>
  );
};

export default Certificates;
