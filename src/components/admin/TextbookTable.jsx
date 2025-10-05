import React from "react";
import {
  Eye,
  BookOpen,
  Users,
  Clock,
  TriangleAlert,
  CircleCheck,
  Menu,
} from "lucide-react";
import Pagination from "./Pagination";
import useTextbooksStore from "../../stores/admin/textbookStore";

const TextbookTable = ({ searchTerm }) => {
  const {
    textbooks,
    paginatedRecords,
    currentPage,
    totalPages,
    setCurrentPage,
    loading,
    error,
  } = useTextbooksStore();

  const filteredRecords = paginatedRecords().filter((book) => {
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

  const indexOfLast = currentPage * 10; // Assuming 10 items per page
  const indexOfFirst = indexOfLast - 10;
  const totalRecords = filteredRecords.length;

  // Skeleton row component for table
  const SkeletonRow = () => (
    <tr className="animate-pulse">
      <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
        <div className="flex items-start gap-2 sm:gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-200 rounded-lg flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="h-2.5 sm:h-3 w-20 sm:w-32 bg-gray-200 rounded mb-1 sm:mb-2" />
            <div className="h-2 sm:h-3 w-16 sm:w-20 bg-gray-200 rounded" />
          </div>
        </div>
      </td>
      <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-center">
        <div className="h-2.5 sm:h-3 w-6 sm:w-8 bg-gray-200 rounded mx-auto mb-1 sm:mb-2" />
        <div className="h-1.5 sm:h-2 w-10 sm:w-12 bg-gray-200 rounded mx-auto" />
      </td>
      <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-center">
        <div className="h-2.5 sm:h-3 w-6 sm:w-8 bg-gray-200 rounded mx-auto mb-1 sm:mb-2" />
        <div className="h-1.5 sm:h-2 w-10 sm:w-12 bg-gray-200 rounded mx-auto" />
      </td>
      <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-center">
        <div className="h-2.5 sm:h-3 w-6 sm:w-8 bg-gray-200 rounded mx-auto mb-1 sm:mb-2" />
        <div className="h-1.5 sm:h-2 w-10 sm:w-12 bg-gray-200 rounded mx-auto" />
      </td>
      <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-center">
        <div className="h-2.5 sm:h-3 w-6 sm:w-8 bg-gray-200 rounded mx-auto mb-1 sm:mb-2" />
        <div className="h-1.5 sm:h-2 w-10 sm:w-12 bg-gray-200 rounded mx-auto" />
      </td>
      <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
        <div className="flex justify-center gap-1 sm:gap-2">
          <div className="h-5 sm:h-6 w-10 sm:w-12 bg-gray-200 rounded" />
          <div className="h-5 sm:h-6 w-5 sm:w-6 bg-gray-200 rounded" />
        </div>
      </td>
    </tr>
  );

  // Mobile Card Component - More compact layout
  const MobileCard = ({ book }) => {
    const availability = getAvailabilityStatus(book);
    const issued = (book.total_copies || 0) - (book.available || 0);
    const overdueCount = book.overdue_count || 0;

    return (
      <div className="bg-white border border-gray-200 rounded-lg p-3 mb-2 last:mb-0 hover:shadow-sm transition-shadow">
        <div className="flex items-start gap-2 mb-2">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <BookOpen className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-2">
              {book.title}
            </h3>
            <span
              className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium border ${getSubjectColor(
                book.subject?.name || book.subject
              )}`}
            >
              {book.subject?.name || book.subject || "N/A"}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-2">
          <div className="text-center py-1">
            <div className="text-base font-bold text-gray-900">
              {book.total_copies || 0}
            </div>
            <div className="text-xs text-gray-500">Total</div>
          </div>
          <div className="text-center py-1">
            <div className="text-base font-bold text-amber-600">{issued}</div>
            <div className="text-xs text-gray-500">Issued</div>
          </div>
          <div className="text-center py-1">
            <div
              className={`text-base font-bold ${
                overdueCount > 0 ? "text-red-600" : "text-green-600"
              }`}
            >
              {overdueCount}
            </div>
            <div className="text-xs text-gray-500">
              {overdueCount > 0 ? "Overdue" : "None"}
            </div>
          </div>
          <div className="text-center py-1">
            <div
              className={`text-base font-bold ${
                availability.color === "green"
                  ? "text-green-600"
                  : availability.color === "yellow"
                  ? "text-yellow-600"
                  : "text-red-600"
              }`}
            >
              {book.available || 0}
            </div>
            <div className="text-xs text-gray-500">Available</div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pt-2 border-t border-gray-100">
          <span
            className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium ${
              availability.color === "green"
                ? "bg-green-100 text-green-800"
                : availability.color === "yellow"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {availability.text}
          </span>
          <div className="flex items-center justify-end gap-1 flex-1">
            <button className="inline-flex items-center gap-0.5 px-2 py-1 text-xs font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors">
              <Eye className="w-3 h-3" />
              <span className="hidden sm:inline">View</span>
            </button>
            <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
              <Menu className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Mobile Skeleton Card - More compact
  const MobileSkeletonCard = () => (
    <div className="bg-white border border-gray-200 rounded-lg p-3 mb-2 animate-pulse">
      <div className="flex items-start gap-2 mb-2">
        <div className="w-8 h-8 bg-gray-200 rounded-lg" />
        <div className="flex-1">
          <div className="h-3.5 w-20 bg-gray-200 rounded mb-1" />
          <div className="h-2.5 w-12 bg-gray-200 rounded" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 mb-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="text-center py-1">
            <div className="h-3.5 w-5 bg-gray-200 rounded mx-auto mb-1" />
            <div className="h-2 w-8 bg-gray-200 rounded mx-auto" />
          </div>
        ))}
      </div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pt-2 border-t border-gray-100">
        <div className="h-5 w-16 bg-gray-200 rounded" />
        <div className="flex items-center justify-end gap-1 flex-1">
          <div className="h-6 w-8 bg-gray-200 rounded" />
          <div className="h-6 w-6 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
        <div className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <div className="min-w-0">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 sm:mb-2">
                Textbook Inventory
              </h2>
              <p className="text-xs sm:text-sm text-gray-600">
                Manage and track textbook distribution
              </p>
            </div>

            {!loading && (
              <div className="text-xs sm:text-sm text-gray-500">
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

      {/* Mobile Cards View (hidden on sm+) */}
      <div className="sm:hidden px-3 pb-3 space-y-2">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <MobileSkeletonCard key={i} />
          ))
        ) : error ? (
          <div className="text-center py-10">
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <TriangleAlert className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="font-medium text-red-900 text-sm">
                  Failed to load textbooks
                </p>
                <p className="text-xs text-red-600 mt-1">
                  Please try refreshing the page
                </p>
              </div>
            </div>
          </div>
        ) : filteredRecords.length === 0 ? (
          <div className="text-center py-10">
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-gray-400" />
              </div>
              <div>
                <p className="font-medium text-gray-900 text-sm">
                  No textbooks found
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {searchTerm
                    ? "Try adjusting your search criteria"
                    : "No textbook records available"}
                </p>
              </div>
            </div>
          </div>
        ) : (
          filteredRecords.map((book) => (
            <MobileCard key={book.id} book={book} />
          ))
        )}
      </div>

      {/* Desktop Table View (hidden on mobile) */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full min-w-[700px] divide-y divide-gray-200">
          <thead className="bg-gray-50/50">
            <tr>
              <th className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                  <span className="hidden sm:inline">Title & Subject</span>
                  <span className="sm:hidden">Title</span>
                </div>
              </th>
              <th className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                <div className="flex items-center justify-center gap-1.5 sm:gap-2">
                  <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                  <span className="hidden sm:inline">Inventory</span>
                  <span className="sm:hidden">Inv.</span>
                </div>
              </th>
              <th className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                <div className="flex items-center justify-center gap-1.5 sm:gap-2">
                  <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                  <span className="hidden sm:inline">Issued</span>
                  <span className="sm:hidden">Issued</span>
                </div>
              </th>
              <th className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                <div className="flex items-center justify-center gap-1.5 sm:gap-2">
                  <TriangleAlert className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                  <span className="hidden sm:inline">Overdue</span>
                  <span className="sm:hidden">Over.</span>
                </div>
              </th>
              <th className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                <div className="flex items-center justify-center gap-1.5 sm:gap-2">
                  <CircleCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                  <span className="hidden sm:inline">Available</span>
                  <span className="sm:hidden">Avail.</span>
                </div>
              </th>
              <th className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
            ) : error ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-3 sm:px-4 lg:px-6 py-12 sm:py-16 text-center"
                >
                  <div className="flex flex-col items-center gap-2 sm:gap-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-100 rounded-full flex items-center justify-center">
                      <TriangleAlert className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
                    </div>
                    <div className="text-center">
                      <p className="font-medium text-red-900 text-sm sm:text-base">
                        Failed to load textbooks
                      </p>
                      <p className="text-xs sm:text-sm text-red-600 mt-1">
                        Please try refreshing the page
                      </p>
                    </div>
                  </div>
                </td>
              </tr>
            ) : filteredRecords.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-3 sm:px-4 lg:px-6 py-12 sm:py-16 text-center"
                >
                  <div className="flex flex-col items-center gap-2 sm:gap-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 rounded-full flex items-center justify-center">
                      <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" />
                    </div>
                    <div className="text-center">
                      <p className="font-medium text-gray-900 text-sm sm:text-base">
                        No textbooks found
                      </p>
                      <p className="text-xs sm:text-sm text-gray-500 mt-1">
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
                    <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
                      <div className="flex items-start gap-2 sm:gap-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                          <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs sm:text-sm font-semibold text-gray-900 mb-1 line-clamp-2 sm:line-clamp-4">
                            {book.title}
                          </p>
                          <span
                            className={`inline-flex items-center px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-medium border ${getSubjectColor(
                              book.subject?.name || book.subject
                            )}`}
                          >
                            {book.subject?.name || book.subject || "N/A"}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Total Copies */}
                    <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-center">
                      <div className="flex flex-col items-center">
                        <span className="text-base sm:text-lg font-bold text-gray-900">
                          {book.total_copies || 0}
                        </span>
                        <span className="text-xs text-gray-500 hidden sm:block">
                          copies
                        </span>
                      </div>
                    </td>

                    {/* Issued */}
                    <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-center">
                      <div className="flex flex-col items-center">
                        <span className="text-base sm:text-lg font-bold text-amber-600">
                          {issued}
                        </span>
                        <span className="text-xs text-gray-500 hidden sm:block">
                          issued
                        </span>
                      </div>
                    </td>

                    {/* Overdue */}
                    <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-center">
                      <div className="flex flex-col items-center">
                        {overdueCount > 0 ? (
                          <>
                            <span className="text-base sm:text-lg font-bold text-red-600">
                              {overdueCount}
                            </span>
                            <span className="text-xs text-red-500 font-medium hidden sm:block">
                              overdue
                            </span>
                          </>
                        ) : (
                          <>
                            <span className="text-base sm:text-lg font-bold text-green-600">
                              0
                            </span>
                            <span className="text-xs text-green-500 hidden sm:block">
                              none
                            </span>
                          </>
                        )}
                      </div>
                    </td>

                    {/* Available */}
                    <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-center">
                      <div className="flex flex-col items-center gap-1 sm:gap-2">
                        <span
                          className={`text-base sm:text-lg font-bold ${
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
                          className={`inline-flex items-center px-1.5 sm:px-2 py-0.5 rounded-full text-xs font-medium ${
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
                    <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
                      <div className="flex items-center justify-center gap-1 sm:gap-2">
                        <button className="inline-flex items-center gap-0.5 sm:gap-1 px-2 sm:px-3 py-1 sm:py-1.5 text-xs font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors">
                          <Eye className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                          <span className="hidden sm:inline">View</span>
                        </button>
                        <button className="inline-flex items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2 py-1 sm:py-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                          <Menu className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
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
        <div className="border-t border-gray-200 bg-white px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <p className="text-xs sm:text-sm text-gray-600 text-center sm:text-left">
              Showing {indexOfFirst + 1} to{" "}
              {Math.min(indexOfLast, totalRecords)} of {totalRecords} results
            </p>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages()}
              onPrevious={() => setCurrentPage(Math.max(currentPage - 1, 1))}
              onNext={() =>
                setCurrentPage(Math.min(currentPage + 1, totalPages()))
              }
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TextbookTable;
