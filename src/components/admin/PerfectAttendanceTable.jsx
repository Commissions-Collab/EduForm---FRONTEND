import React, { useMemo } from "react";
import {
  Download,
  Eye,
  Search,
  CalendarCheck,
  CalendarDays,
  User,
  Award,
  Calendar,
} from "lucide-react";
import PaginationControls from "./Pagination";
import useCertificatesStore from "../../stores/admin/certificateStore";
import useFilterStore from "../../stores/admin/filterStore";

const PerfectAttendanceTable = ({ searchName, setSearchName }) => {
  const {
    attendanceCertificates,
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
    previewCertificate(
      "perfect_attendance",
      studentId,
      globalFilters.quarterId
    );
  };

  const handleDownload = (studentId) => {
    downloadCertificate(
      "perfect_attendance",
      studentId,
      globalFilters.quarterId
    );
  };

  const handlePrintAll = () => {
    printAllCertificates("perfect_attendance");
  };

  // Mobile Card Component
  const MobileCertificateCard = ({ record }) => {
    // DEMO MODE: Always enabled
    const isReady = true;

    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
        {/* Header */}
        <div className="flex items-start gap-3 mb-3">
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
            {record.student_name?.charAt(0)?.toUpperCase() || "?"}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium text-gray-900 truncate">
              {record.student_name}
            </h3>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200 mt-1">
              <CalendarCheck className="w-3 h-3" />
              Perfect Attendance
            </span>
          </div>
        </div>

        {/* Details */}
        <div className="mb-3 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2 text-sm text-gray-900">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span className="font-medium">Quarters:</span>
            <span>{record.quarters}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg transition-colors text-blue-600 bg-blue-50 hover:bg-blue-100"
            onClick={() => handlePreview(record.id)}
            title="Preview certificate"
          >
            <Eye className="w-4 h-4" />
            Preview
          </button>
          <button
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg transition-colors text-indigo-600 bg-indigo-50 hover:bg-indigo-100"
            onClick={() => handleDownload(record.id)}
            title="Download certificate"
          >
            <Download className="w-4 h-4" />
            Download
          </button>
        </div>
      </div>
    );
  };

  const SkeletonCard = () => (
    <div className="bg-white border border-gray-200 rounded-lg p-4 animate-pulse">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-12 h-12 rounded-full bg-gray-200"></div>
        <div className="flex-1">
          <div className="w-32 h-4 bg-gray-200 rounded mb-2"></div>
          <div className="w-24 h-3 bg-gray-100 rounded"></div>
        </div>
      </div>
      <div className="h-12 bg-gray-100 rounded mb-3"></div>
      <div className="flex gap-2">
        <div className="flex-1 h-9 bg-gray-200 rounded-lg"></div>
        <div className="flex-1 h-9 bg-gray-200 rounded-lg"></div>
      </div>
    </div>
  );

  // DEMO MODE: Always enable download all
  const downloadAllDisabled = attendanceCertificates.length === 0;
  const downloadAllTitle = attendanceCertificates.length === 0
    ? "No qualified students found to download"
    : "Download all qualified certificates";

  return (
    <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="border-b border-gray-200">
        <div className="p-4 sm:p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 sm:gap-4">
            <div>
              <h2 className="text-base sm:text-xl font-bold text-gray-900 mb-1 sm:mb-2">
                Perfect Attendance Certificates
              </h2>
              <p className="text-xs sm:text-sm text-gray-600">
                Students who had perfect attendance in selected quarters
              </p>
            </div>

            {/* Controls */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  placeholder="Search student name..."
                  className="pl-10 pr-4 py-2 sm:py-2.5 text-xs sm:text-sm bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors w-full sm:w-64"
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                />
              </div>

              {/* Download All Button */}
              <button
                className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-medium rounded-lg transition-colors shadow-sm whitespace-nowrap bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handlePrintAll}
                disabled={downloadAllDisabled}
                title={downloadAllTitle}
              >
                <Download className="w-4 h-4" />
                <span>Download All</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <>
          {/* Mobile Loading */}
          <div className="block lg:hidden p-4 space-y-4">
            {[...Array(3)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
          {/* Desktop Loading */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full divide-y divide-gray-200">
              <thead className="bg-gray-50/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    <div className="flex gap-2">
                      <User className="w-4 h-4" />
                      Student Name
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    <div className="flex gap-2">
                      <Award className="w-4 h-4" />
                      Certificate Type
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    <div className="flex gap-2">
                      <Calendar className="w-4 h-4" />
                      Details
                    </div>
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {[...Array(5)].map((_, idx) => (
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
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : error ? (
        <div className="px-4 sm:px-6 py-12 text-center">
          <div className="text-red-500">
            <p className="font-medium text-sm sm:text-base">
              Error loading data
            </p>
            <p className="text-xs sm:text-sm mt-1">{error}</p>
          </div>
        </div>
      ) : records.length === 0 ? (
        <div className="px-4 sm:px-6 py-12 text-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
              <CalendarDays className="w-6 h-6 text-gray-400" />
            </div>
            <div>
              <p className="font-medium text-gray-900 text-sm sm:text-base">
                No records found
              </p>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                {searchName
                  ? "Try adjusting your search criteria"
                  : "No attendance certificate records available"}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Mobile Card View */}
          <div className="block lg:hidden p-4 space-y-4">
            {records.map((record, idx) => (
              <MobileCertificateCard key={idx} record={record} />
            ))}
          </div>

          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full divide-y divide-gray-200">
              <thead className="bg-gray-50/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    <div className="flex gap-2">
                      <User className="w-4 h-4" />
                      Student Name
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    <div className="flex gap-2">
                      <Award className="w-4 h-4" />
                      Certificate Type
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    <div className="flex gap-2">
                      <Calendar className="w-4 h-4" />
                      Details
                    </div>
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {records.map((record, idx) => {
                  // DEMO MODE: Always enabled
                  const isReady = true;

                  return (
                    <tr
                      key={idx}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-semibold text-sm mr-3">
                            {record.student_name?.charAt(0)?.toUpperCase() ||
                              "?"}
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-gray-900">
                              {record.student_name}
                            </h3>
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200 mt-1">
                              <CalendarCheck className="w-3 h-3" />
                              Perfect Attendance
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                          <CalendarCheck className="w-3 h-3" />
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
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                            onClick={() => handlePreview(record.id)}
                            title="Preview certificate"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            Preview
                          </button>
                          <button
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50"
                            onClick={() => handleDownload(record.id)}
                            title="Download certificate"
                          >
                            <Download className="w-3.5 h-3.5" />
                            Download
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Pagination */}
      {!loading && !error && records.length > 0 && (
        <div className="border-t border-gray-200 bg-white px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <p className="text-xs sm:text-sm text-gray-600">
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