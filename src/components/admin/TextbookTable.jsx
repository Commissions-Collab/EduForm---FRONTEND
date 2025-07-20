import React, { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";
import { useTextbookStore } from "../../stores/useTextbookStore";
import Pagination from "./Pagination";

const TextbookTable = () => {
  const {
    textbooks,
    fetchTextbooks,
    paginatedRecords,
    totalPages,
    currentPage,
    setCurrentPage,
    loading,
    error,
  } = useTextbookStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");

  useEffect(() => {
    fetchTextbooks();
  }, []);

  // Get all unique subjects for filter dropdown
  const uniqueSubjects = [
    ...new Set(textbooks.map((book) => book.subject).filter(Boolean)),
  ];

  const filteredRecords = paginatedRecords().filter((book) => {
    const matchesSearch = book.title
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesSubject =
      selectedSubject === "" || book.subject === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  return (
    <>
      <div className="mt-8 overflow-x-auto bg-white rounded-lg shadow-md min-h-[200px]">
        <div className="flex justify-between p-5">
          <input
            type="text"
            placeholder="Search by title..."
            className="w-full md:w-1/2 px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="w-full md:w-1/4 px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring focus:ring-blue-500"
          >
            <option value="">All Subjects</option>
            {uniqueSubjects.map((subject) => (
              <option key={subject} value={subject}>
                {subject}
              </option>
            ))}
          </select>
        </div>

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
                    {book.subject}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-900">
                    {book.total}
                  </td>
                  <td className="px-4 py-3">{book.issued}</td>
                  <td className="px-4 py-3 text-red-600">{book.overdue}</td>
                  <td className="px-4 py-3 text-green-600">{book.available}</td>
                  <td className="px-4 py-3">
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
          currentPage={currentPage}
          totalPages={totalPages()}
          onPrevious={() => setCurrentPage(Math.max(currentPage - 1, 1))}
          onNext={() => setCurrentPage(Math.min(currentPage + 1, totalPages()))}
        />
      )}
    </>
  );
};

export default TextbookTable;
