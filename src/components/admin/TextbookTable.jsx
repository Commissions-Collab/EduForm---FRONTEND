import React from "react";
import { ClipLoader } from "react-spinners";
import Pagination from "./Pagination";
import { useAdminStore } from "../../stores/useAdminStore";

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

  return (
    <>
      <div className="mt-8 overflow-x-auto bg-white rounded-lg shadow-md min-h-[400px]">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Title
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Subject
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Total Copies
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Issued
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Overdue
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Available
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={7} className="text-center py-20">
                  <ClipLoader size={30} color="#4F46E5" />
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={7} className="text-center py-20 text-red-600">
                  Failed to load textbook records.
                </td>
              </tr>
            ) : filteredRecords.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-20 text-gray-500">
                  No textbook records found.
                </td>
              </tr>
            ) : (
              filteredRecords.map((book) => (
                <tr key={book.id} className="border-t">
                  <td className="px-4 py-4 text-sm text-gray-900">
                    {book.title}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-900">
                    {book.subject?.name || "N/A"}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-900">
                    {book.total_copies}
                  </td>
                  <td className="px-4 py-4">
                    {book.total_copies - book.available}
                  </td>
                  <td className="px-4 py-4 text-red-600">
                    {book.overdue_count || 0}
                  </td>
                  <td className="px-4 py-4 text-green-600">{book.available}</td>
                  <td className="px-4 py-4">
                    <button className="text-indigo-600 hover:underline text-sm">
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {!loading && filteredRecords.length > 0 && (
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
      )}
    </>
  );
};

export default TextbookTable;
