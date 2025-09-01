import React from "react";
import {
  LuPrinter,
  LuEye,
  LuDownload,
  LuSearch,
  LuFilter,
  LuPrinterCheck,
  LuLoader,
  LuAward,
  LuUser,
  LuCalendar,
} from "react-icons/lu";
import PaginationControls from "./Pagination";
import { useAdminStore } from "../../stores/admin";
const HonorsCertificateTable = ({
  searchName,
  filterType,
  setSearchName,
  setFilterType,
}) => {
  const {
    honorCertificates,
    certificateCurrentPage,
    setCertificateCurrentPage,
    loading,
    error,
  } = useAdminStore();

  // --- Filtering ---
  const filteredRecords = honorCertificates.filter((record) => {
    const matchesName = (record.student_name || "")
      .toLowerCase()
      .includes(searchName.toLowerCase());
    const matchesHonor =
      filterType === "All" || record.honor_type === filterType;
    return matchesName && matchesHonor;
  });

  // --- Pagination ---
  const pageSize = 5;
  const indexOfLast = certificateCurrentPage * pageSize;
  const indexOfFirst = indexOfLast - pageSize;
  const records = filteredRecords.slice(indexOfFirst, indexOfLast);
  const total = Math.ceil(filteredRecords.length / pageSize);

  const honorTypeColors = {
    "With Honors": "bg-blue-100 text-blue-800 border-blue-200",
    "With High Honors": "bg-purple-100 text-purple-800 border-purple-200",
    "With Highest Honors": "bg-amber-100 text-amber-800 border-amber-200",
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
        <div className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Honor Certificates
              </h2>
              <p className="text-sm text-gray-600">
                Students who qualify for honors based on grades
              </p>
            </div>

            {/* Controls */}
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search */}
              <div className="relative">
                <LuSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  placeholder="Search student name..."
                  className="pl-10 pr-4 py-2.5 text-sm bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors w-full sm:w-64"
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                />
              </div>

              {/* Filter */}
              <div className="relative">
                <LuFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <select
                  className="pl-10 pr-4 py-2.5 text-sm bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors w-full sm:w-48"
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                >
                  <option value="All">All Honors</option>
                  <option value="With Honors">With Honors</option>
                  <option value="With High Honors">With High Honors</option>
                  <option value="With Highest Honors">
                    With Highest Honors
                  </option>
                </select>
              </div>

              {/* Print All Button */}
              <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors shadow-sm">
                <LuPrinter className="w-4 h-4" />
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
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <LuLoader className="w-6 h-6 text-blue-700 animate-spin" />
                    <p className="text-sm text-gray-500">
                      Loading certificates...
                    </p>
                  </div>
                </td>
              </tr>
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
                      <LuAward className="w-6 h-6 text-gray-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        No records found
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        {searchName || filterType !== "All"
                          ? "Try adjusting your search or filter criteria"
                          : "No honor certificate records available"}
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
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm mr-3">
                        {record.student_name?.charAt(0)?.toUpperCase() || "?"}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {record.student_name}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${
                        honorTypeColors[record.honor_type] ||
                        "bg-gray-100 text-gray-800 border-gray-200"
                      }`}
                    >
                      {record.honor_type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <div className="space-y-1">
                      <p>
                        <span className="font-medium">Grade Average:</span>{" "}
                        {record.grade_average}
                      </p>
                      <p>
                        <span className="font-medium">Quarter:</span>{" "}
                        {record.quarter}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors">
                        <LuEye className="w-3.5 h-3.5" />
                        Preview
                      </button>
                      <button className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-colors">
                        <LuPrinterCheck className="w-3.5 h-3.5" />
                        Print
                      </button>
                      <button className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-lg transition-colors">
                        <LuDownload className="w-3.5 h-3.5" />
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
              Showing {indexOfFirst + 1} to{" "}
              {Math.min(indexOfLast, filteredRecords.length)} of{" "}
              {filteredRecords.length} results
            </p>
            <PaginationControls
              currentPage={certificateCurrentPage}
              totalPages={total}
              onPrevious={() =>
                setCertificateCurrentPage(
                  Math.max(certificateCurrentPage - 1, 1)
                )
              }
              onNext={() =>
                setCertificateCurrentPage(
                  Math.min(certificateCurrentPage + 1, total)
                )
              }
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default HonorsCertificateTable;
