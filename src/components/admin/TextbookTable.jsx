import React from "react";
import {
  LuEye,
  LuBookOpen,
  LuUsers,
  LuClock,
  LuTriangleAlert,
  LuCircleCheck,
  LuMenu,
} from "react-icons/lu";
import Pagination from "./Pagination";
import { useAdminStore } from "../../stores/admin";

const TextbookTable = ({ searchTerm }) => {
  const {
    textbooks,
    paginatedTextbookRecords,
    textbookCurrentPage,
    totalTextbookPages,
    setTextbookCurrentPage,
    loading,
    error,
  } = useAdminStore();

  const filteredRecords = paginatedTextbookRecords().filter((book) => {
    return book.title?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const getAvailabilityStatus = (book) => {
    const available = book.available || 0;
    const total = book.total_copies || 0;
    const percentage = total > 0 ? (available / total) * 100 : 0;

    if (percentage >= 75)
      return { status: "high", color: "green", text: "High" };
    if (percentage >= 25)
      return { status: "medium", color: "yellow", text: "Medium" };
    return { status: "low", color: "red", text: "Low" };
  };

  const getSubjectColor = (subject) => {
    const colors = {
      Mathematics: "bg-blue-100 text-blue-800 border-blue-200",
      Science: "bg-green-100 text-green-800 border-green-200",
      English: "bg-purple-100 text-purple-800 border-purple-200",
      History: "bg-amber-100 text-amber-800 border-amber-200",
      Filipino: "bg-red-100 text-red-800 border-red-200",
      default: "bg-gray-100 text-gray-800 border-gray-200",
    };
    return colors[subject] || colors.default;
  };

  const indexOfLast = textbookCurrentPage * 10; // Assuming 10 items per page
  const indexOfFirst = indexOfLast - 10;
  const totalRecords = filteredRecords.length;

  // Skeleton row component
  const SkeletonRow = () => (
    <tr className="animate-pulse">
      <td className="px-6 py-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-gray-200 rounded-lg" />
          <div className="flex-1">
            <div className="h-3 w-32 bg-gray-200 rounded mb-2" />
            <div className="h-3 w-20 bg-gray-200 rounded" />
          </div>
        </div>
      </td>
      <td className="px-6 py-4 text-center">
        <div className="h-3 w-8 bg-gray-200 rounded mx-auto mb-2" />
        <div className="h-2 w-12 bg-gray-200 rounded mx-auto" />
      </td>
      <td className="px-6 py-4 text-center">
        <div className="h-3 w-8 bg-gray-200 rounded mx-auto mb-2" />
        <div className="h-2 w-12 bg-gray-200 rounded mx-auto" />
      </td>
      <td className="px-6 py-4 text-center">
        <div className="h-3 w-8 bg-gray-200 rounded mx-auto mb-2" />
        <div className="h-2 w-12 bg-gray-200 rounded mx-auto" />
      </td>
      <td className="px-6 py-4 text-center">
        <div className="h-3 w-8 bg-gray-200 rounded mx-auto mb-2" />
        <div className="h-2 w-12 bg-gray-200 rounded mx-auto" />
      </td>
      <td className="px-6 py-4">
        <div className="flex justify-center gap-2">
          <div className="h-6 w-12 bg-gray-200 rounded" />
          <div className="h-6 w-6 bg-gray-200 rounded" />
        </div>
      </td>
    </tr>
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
        <div className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Textbook Inventory
              </h2>
              <p className="text-sm text-gray-600">
                Manage and track textbook distribution
              </p>
            </div>

            {!loading && (
              <div className="text-sm text-gray-500">
                {totalRecords} {totalRecords === 1 ? "record" : "records"} found
                {searchTerm && (
                  <span className="ml-1">
                    for "
                    <span className="font-medium text-gray-700">
                      {searchTerm}
                    </span>
                    "
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full divide-y divide-gray-200">
          <thead className="bg-gray-50/50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                <div className="flex items-center gap-2">
                  <LuBookOpen className="w-4 h-4" />
                  Title & Subject
                </div>
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                <div className="flex items-center justify-center gap-2">
                  <LuUsers className="w-4 h-4" />
                  Inventory
                </div>
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                <div className="flex items-center justify-center gap-2">
                  <LuClock className="w-4 h-4" />
                  Issued
                </div>
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                <div className="flex items-center justify-center gap-2">
                  <LuTriangleAlert className="w-4 h-4" />
                  Overdue
                </div>
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                <div className="flex items-center justify-center gap-2">
                  <LuCircleCheck className="w-4 h-4" />
                  Available
                </div>
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              // Show 5 skeleton rows
              Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
            ) : error ? (
              <tr>
                <td colSpan={6} className="px-6 py-16 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                      <LuTriangleAlert className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                      <p className="font-medium text-red-900">
                        Failed to load textbooks
                      </p>
                      <p className="text-sm text-red-600 mt-1">
                        Please try refreshing the page
                      </p>
                    </div>
                  </div>
                </td>
              </tr>
            ) : filteredRecords.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-16 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                      <LuBookOpen className="w-6 h-6 text-gray-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        No textbooks found
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        {searchTerm
                          ? "Try adjusting your search criteria"
                          : "No textbook records available"}
                      </p>
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              filteredRecords.map((book) => {
                const availability = getAvailabilityStatus(book);
                const issued = (book.total_copies || 0) - (book.available || 0);
                const overdueCount = book.overdue_count || 0;

                return (
                  <tr
                    key={book.id}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    {/* Title & Subject */}
                    <td className="px-6 py-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                          <LuBookOpen className="w-5 h-5 text-white" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-gray-900 mb-1 line-clamp-4">
                            {book.title}
                          </p>
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getSubjectColor(
                              book.subject?.name
                            )}`}
                          >
                            {book.subject?.name || "N/A"}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Total Copies */}
                    <td className="px-6 py-4 text-center">
                      <div className="flex flex-col items-center">
                        <span className="text-lg font-bold text-gray-900">
                          {book.total_copies || 0}
                        </span>
                        <span className="text-xs text-gray-500">copies</span>
                      </div>
                    </td>

                    {/* Issued */}
                    <td className="px-6 py-4 text-center">
                      <div className="flex flex-col items-center">
                        <span className="text-lg font-bold text-amber-600">
                          {issued}
                        </span>
                        <span className="text-xs text-gray-500">issued</span>
                      </div>
                    </td>

                    {/* Overdue */}
                    <td className="px-6 py-4 text-center">
                      <div className="flex flex-col items-center">
                        {overdueCount > 0 ? (
                          <>
                            <span className="text-lg font-bold text-red-600">
                              {overdueCount}
                            </span>
                            <span className="text-xs text-red-500 font-medium">
                              overdue
                            </span>
                          </>
                        ) : (
                          <>
                            <span className="text-lg font-bold text-green-600">
                              0
                            </span>
                            <span className="text-xs text-green-500">none</span>
                          </>
                        )}
                      </div>
                    </td>

                    {/* Available */}
                    <td className="px-6 py-4 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <span
                          className={`text-lg font-bold ${
                            availability.color === "green"
                              ? "text-green-600"
                              : availability.color === "yellow"
                              ? "text-yellow-600"
                              : "text-red-600"
                          }`}
                        >
                          {book.available || 0}
                        </span>
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            availability.color === "green"
                              ? "bg-green-100 text-green-800"
                              : availability.color === "yellow"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {availability.text}
                        </span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors">
                          <LuEye className="w-3.5 h-3.5" />
                          View
                        </button>
                        <button className="inline-flex items-center gap-1 px-2 py-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                          <LuMenu className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {!loading && !error && filteredRecords.length > 0 && (
        <div className="border-t border-gray-200 bg-white px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <p className="text-sm text-gray-600">
              Showing {indexOfFirst + 1} to{" "}
              {Math.min(indexOfLast, totalRecords)} of {totalRecords} results
            </p>
            <Pagination
              currentPage={textbookCurrentPage}
              totalPages={totalTextbookPages()}
              onPrevious={() =>
                setTextbookCurrentPage(Math.max(textbookCurrentPage - 1, 1))
              }
              onNext={() =>
                setTextbookCurrentPage(
                  Math.min(textbookCurrentPage + 1, totalTextbookPages())
                )
              }
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TextbookTable;
