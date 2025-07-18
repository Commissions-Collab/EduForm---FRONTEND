// TextbookTable.jsx
import React from "react";
import PaginationControls from "./Pagination";
import { ClipLoader } from "react-spinners";
import { LuFilter, LuPrinter } from "react-icons/lu";

const TextbookTable = ({
  textbooks,
  currentPage,
  totalPages,
  onPreviousPage,
  onNextPage,
  loading,
  error,
}) => {
  const hasRecords = Array.isArray(textbooks) && textbooks.length > 0;

  return (
    <>
      <div className="mt-8 overflow-x-auto bg-white rounded-lg shadow-md">
        <div className="flex items-center justify-between p-5">
          <div>
            <h1 className="text-lg font-semibold mb-1">Textbook Inventory</h1>
            <p className="text-sm text-gray-500">
              Overview of textbook availability and usage.
            </p>
          </div>
          <div className="items-center">
            <div className="flex space-x-3">
              <button className="gray-button">
                <LuFilter size={15} />
                <span className="ml-2">Filter</span>
              </button>
              <button className="flex text-[12.5px] bg-[#E0E7FF] hover:bg-[#C7D2FE] text-[#3730A3] font-semibold py-2 px-4 rounded-lg transition-all duration-200">
                <LuPrinter size={15} />
                <span className="ml-2">Print Report</span>
              </button>
            </div>
          </div>
        </div>

        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {[
                "Title",
                "Subject",
                "Total Copies",
                "Issued",
                "Overdue",
                "Available",
                "Actions",
              ].map((header) => (
                <th
                  key={header}
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={7}>
                  <div className="flex justify-center items-center h-[60vh]">
                    <ClipLoader color="#B91C1C" size={30} />
                  </div>
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={7}>
                  <div className="flex justify-center items-center h-[60vh] text-red-600 font-medium">
                    Failed to fetch textbook data. Please try again.
                  </div>
                </td>
              </tr>
            ) : !hasRecords ? (
              <tr>
                <td colSpan={7}>
                  <div className="flex justify-center items-center h-[60vh] text-gray-600 font-medium">
                    No textbook records available.
                  </div>
                </td>
              </tr>
            ) : (
              textbooks.map((book) => (
                <tr key={book.id}>
                  <td className="px-4 py-4 text-sm font-medium text-gray-900">
                    {book.title}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-700">
                    {book.subject}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-700">
                    {book.total}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-700">
                    {book.issued}
                  </td>
                  <td className="px-4 py-4 text-sm text-red-500">
                    {book.overdue}
                  </td>
                  <td className="px-4 py-4 text-sm text-green-600">
                    {book.available}
                  </td>
                  <td className="px-4 py-4">
                    <button className="text-indigo-600 hover:underline text-sm font-medium">
                      View Details
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {!loading && hasRecords && (
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPrevious={onPreviousPage}
          onNext={onNextPage}
        />
      )}
    </>
  );
};

export default TextbookTable;
