import React, { useEffect, useState } from "react";
import { useCertificateStore } from "../../stores/useCertificate";
import HonorsCertificateTable from "../../components/admin/HonorCertificateTable";
import PerfectAttendanceTable from "../../components/admin/PerfectAttendanceTable";

const Certificates = () => {
  const { fetchCertificateData } = useCertificateStore();

  useEffect(() => {
    fetchCertificateData();
  }, []);

  return (
    <main className="p-4">
      <div className="between">
        <div className="page-title">Certificate Creation: Grade 10-A</div>
        <select className="px-3 py-2 text-sm border border-gray-300 rounded">
          <option value="All Quarters">All Quarters</option>
          <option value="1st Quarter">1st Quarter</option>
          <option value="2nd Quarter">2nd Quarter</option>
          <option value="3rd Quarter">3rd Quarter</option>
          <option value="4th Quarter">4th Quarter</option>
        </select>
      </div>

      <PerfectAttendanceTable />
      <HonorsCertificateTable />
    </main>
  );
};

export default Certificates;
