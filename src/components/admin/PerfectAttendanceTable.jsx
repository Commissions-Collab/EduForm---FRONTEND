import React, { useMemo } from "react";
import {
  LuPrinter,
  LuEye,
  LuDownload,
  LuSearch,
  LuCalendarCheck,
  LuPrinterCheck,
  LuCalendarDays,
  LuUser,
  LuAward,
  LuCalendar,
  LuLock,
  LuBadgeAlert,
} from "react-icons/lu";
import PaginationControls from "./Pagination";
import useCertificatesStore from "../../stores/admin/certificateStore";
import useFilterStore from "../../stores/admin/filterStore";

const PerfectAttendanceTable = ({ searchName, setSearchName }) => {
  const {
    attendanceCertificates,
    quarterComplete,
    currentPage,
    setCurrentPage,
    loading,
    error,
    paginatedRecords,
    totalPages,
    previewCertificate,
    downloadCertificate,
    printAllCertificates,
  } = useCertificatesStore();

  const { globalFilters } = useFilterStore();

  // Filter logic (memoized for performance)
  const filteredRecords = useMemo(() => {
    return attendanceCertificates.filter((record) =>
      (record.student_name || "")
        .toLowerCase()
        .includes(searchName.toLowerCase())
    );
  }, [attendanceCertificates, searchName]);

  const records = paginatedRecords("attendance");
  const total = totalPages("attendance");

  const handlePreview = (studentId) => {
    previewCertificate('perfect_attendance', studentId, globalFilters.quarterId);
  };

  const handleDownload = (studentId) => {
    downloadCertificate('perfect_attendance', studentId, globalFilters.quarterId);
  };

  const handlePrintAll = () => {
    printAllCertificates('perfect_attendance');
  };

  // Check if any certificates can be generated
  const hasGeneratableCertificates = attendanceCertificates.some(record => record.can_generate);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="border-b border-gray-200">
        <div className="p-6">
          {/* Quarter Status Alert */}
          {!quarterComplete && (
            <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 p-4">
              <div className="flex items-start gap-3">
                <LuBadgeAlert className="w-5 h-5 text-amber-600 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-amber-800">
                    Quarter In Progress
                  </h4>
                  <p className="text-sm text-amber-700 mt-1">
                    Certificates cannot be generated until the selected quarter ends. 
                    Preview and download options will be available once the quarter is complete.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Perfect Attendance Certificates
              </h2>
              <p className="text-sm text-gray-600">
                Students who had perfect attendance in selected quarters
              </p>
            </div>

            {/* Controls */}
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search */}
              <div className="relative">
                <LuSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  placeholder="Search student name..."
                  className="pl-10 pr-4 py-2.5 text-sm bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors w-full sm:w-64"
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                />
              </div>

              {/* Print All Button */}
              <button 
                className={`flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg transition-colors shadow-sm ${
                  quarterComplete && hasGeneratableCertificates
                    ? 'bg-green-600 text-white hover:bg-green-700' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
                onClick={handlePrintAll}
                disabled={!quarterComplete || !hasGeneratableCertificates}
              >
                {quarterComplete ? (
                  <LuPrinter className="w-4 h-4" />
                ) : (
                  <LuLock className="w-4 h-4" />
                )}
                <span>Print All</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full divide-y divide-gray-200">
          <thead className="bg-gray-50/50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                <div className="flex gap-2">
                  <LuUser className="w-4 h-4" />
                  Student Name
                </div>
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                <div className="flex gap-2">
                  <LuAward className="w-4 h-4" />
                  Certificate Type
                </div>
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                <div className="flex gap-2">
                  <LuCalendar className="w-4 h-4" />
                  Details
                </div>
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              // Skeleton Rows
              [...Array(5)].map((_, idx) => (
                <tr key={idx} className="animate-pulse">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full" />
                      <div className="h-4 bg-gray-200 rounded w-32" />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-4 bg-gray-200 rounded w-28" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-3 bg-gray-200 rounded w-36" />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center gap-2">
                      <div className="h-8 w-16 bg-gray-200 rounded" />
                      <div className="h-8 w-16 bg-gray-200 rounded" />
                      <div className="h-8 w-16 bg-gray-200 rounded" />
                    </div>
                  </td>
                </tr>
              ))
            ) : error ? (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center">
                  <div className="text-red-500">
                    <p className="font-medium">Error loading data</p>
                    <p className="text-sm mt-1">{error}</p>
                  </div>
                </td>
              </tr>
            ) : records.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                      <LuCalendarDays className="w-6 h-6 text-gray-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        No records found
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        {searchName
                          ? "Try adjusting your search criteria"
                          : "No attendance certificate records available"}
                      </p>
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              records.map((record, idx) => (
                <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-semibold text-sm mr-3">
                        {record.student_name?.charAt(0)?.toUpperCase() || "?"}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {record.student_name}
                        </p>
                        {!record.can_generate && (
                          <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                            <LuLock className="w-3 h-3" />
                            Cannot generate yet
                          </p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                      <LuCalendarCheck className="w-3 h-3" />
                      Perfect Attendance
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <p>
                      <span className="font-medium">Quarters:</span>{" "}
                      {record.quarters}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button 
                        className={`inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                          record.can_generate 
                            ? 'text-blue-600 hover:text-blue-800 hover:bg-blue-50' 
                            : 'text-gray-400 cursor-not-allowed'
                        }`}
                        onClick={() => record.can_generate && handlePreview(record.id)}
                        disabled={!record.can_generate}
                      >
                        {record.can_generate ? (
                          <LuEye className="w-3.5 h-3.5" />
                        ) : (
                          <LuLock className="w-3.5 h-3.5" />
                        )}
                        Preview
                      </button>
                      <button 
                        className={`inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                          record.can_generate 
                            ? 'text-green-600 hover:text-green-800 hover:bg-green-50' 
                            : 'text-gray-400 cursor-not-allowed'
                        }`}
                        onClick={() => record.can_generate && handlePreview(record.id)}
                        disabled={!record.can_generate}
                      >
                        {record.can_generate ? (
                          <LuPrinterCheck className="w-3.5 h-3.5" />
                        ) : (
                          <LuLock className="w-3.5 h-3.5" />
                        )}
                        Print
                      </button>
                      <button 
                        className={`inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                          record.can_generate 
                            ? 'text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50' 
                            : 'text-gray-400 cursor-not-allowed'
                        }`}
                        onClick={() => record.can_generate && handleDownload(record.id)}
                        disabled={!record.can_generate}
                      >
                        {record.can_generate ? (
                          <LuDownload className="w-3.5 h-3.5" />
                        ) : (
                          <LuLock className="w-3.5 h-3.5" />
                        )}
                        Download
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {!loading && !error && records.length > 0 && (
        <div className="border-t border-gray-200 bg-white px-6 py-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing {currentPage * 10 - 9} to{" "}
              {Math.min(currentPage * 10, filteredRecords.length)} of{" "}
              {filteredRecords.length} results
            </p>
            <PaginationControls
              currentPage={currentPage}
              totalPages={total}
              onPrevious={() => setCurrentPage(Math.max(currentPage - 1, 1))}
              onNext={() => setCurrentPage(Math.min(currentPage + 1, total))}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PerfectAttendanceTable;