import React from "react";
import PerfectAttendanceTable from "../../components/admin/PerfectAttendanceTable";
import HonorsCertificateTable from "../../components/admin/HonorCertificateTable";
import { useCertificateStore } from "../../stores/useCertificate";
import PaginationControls from "../../components/admin/Pagination";

const Certificates = () => {
  const {
    attendanceCertificates,
    honorCertificates,
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedRecords,
    fetchCertificateData,
  } = useCertificateStore();

  const attendanceRecords = paginatedRecords("attendance");
  const honorsRecords = paginatedRecords("honor");

  const totalAttendancePages = totalPages("attendance");
  const totalHonorPages = totalPages("honor");

  React.useEffect(() => {
    fetchCertificateData();
  }, []);

  return (
    <main className="p-4">
      <div className="between">
        <div className="page-title">Certificate Creation: Grade 10-A</div>
        <div className="items-center">
          <select className="px-3 py-2 text-sm border border-gray-300 rounded">
            <option value="All Quarters">All Quarters</option>
            <option value="1st Quarter">1st Quarter</option>
            <option value="2nd Quarter">2nd Quarter</option>
            <option value="3rd Quarter">3rd Quarter</option>
            <option value="4th Quarter">4th Quarter</option>
          </select>
        </div>
      </div>
      <PerfectAttendanceTable records={attendanceRecords} />
      <PaginationControls
        currentPage={currentPage}
        totalPages={totalAttendancePages}
        onPrevious={() => setCurrentPage(Math.max(currentPage - 1, 1))}
        onNext={() =>
          setCurrentPage(Math.min(currentPage + 1, totalAttendancePages))
        }
      />

      <HonorsCertificateTable records={honorsRecords} />
      <PaginationControls
        currentPage={currentPage}
        totalPages={totalHonorPages}
        onPrevious={() => setCurrentPage(Math.max(currentPage - 1, 1))}
        onNext={() =>
          setCurrentPage(Math.min(currentPage + 1, totalHonorPages))
        }
      />
    </main>
  );
};

export default Certificates;
