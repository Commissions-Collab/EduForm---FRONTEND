import React, { useState } from "react";
import { useCertificateStore } from "../../stores/useCertificate";
import { LuPrinter } from "react-icons/lu";
import PaginationControls from "./Pagination";

const HonorsCertificateTable = () => {
  const {
    honorCertificates,
    currentPage,
    setCurrentPage,
    totalPages,
    loading,
    error,
  } = useCertificateStore();

  const [searchName, setSearchName] = useState("");
  const [filterType, setFilterType] = useState("All");

  const filteredRecords = honorCertificates.filter((record) => {
    const matchesName = (record.name || "")
      .toLowerCase()
      .includes(searchName.toLowerCase());
    const matchesHonor =
      filterType === "All" || record.honorType === filterType;
    return matchesName && matchesHonor;
  });

  const indexOfLast = currentPage * 5;
  const indexOfFirst = indexOfLast - 5;
  const records = filteredRecords.slice(indexOfFirst, indexOfLast);
  const total = Math.ceil(filteredRecords.length / 5);

  return (
    <>
      <div className="mt-10 overflow-x-auto bg-white rounded-lg shadow-md">
        <div className="flex items-center justify-between p-5">
          <div>
            <h1 className="text-lg font-semibold mb-1">Honor Certificates</h1>
            <p className="text-sm text-gray-500">
              Manage and generate certificates for honor students.
            </p>
          </div>
          <div className="flex space-x-3 items-center">
            <input
              placeholder="Search student name..."
              className="border border-gray-300 text-sm px-3 py-2 rounded"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
            />
            <select
              className="text-sm border px-3 py-2 rounded"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="All">All Honors</option>
              <option value="With Honors">With Honors</option>
              <option value="With High Honors">With High Honors</option>
              <option value="With Highest Honors">With Highest Honors</option>
            </select>
            <button className="gray-button">
              <LuPrinter size={15} />
              <span className="ml-2">Print All</span>
            </button>
          </div>
        </div>

        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs text-gray-500 uppercase">
                Student Name
              </th>
              <th className="px-4 py-3 text-left text-xs text-gray-500 uppercase">
                Honor Type
              </th>
              <th className="px-4 py-3 text-left text-xs text-gray-500 uppercase">
                Grade Average
              </th>
              <th className="px-4 py-3 text-left text-xs text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {records.map((record, idx) => (
              <tr key={idx}>
                <td className="px-4 py-4 text-sm text-gray-900">
                  {record.studentName}
                </td>
                <td className="px-4 py-4 text-sm text-gray-900">
                  {record.honorType}
                </td>

                <td className="px-4 py-4 text-sm text-gray-900">
                  {record.gradeAverage}
                </td>
                <td className=" px-4 py-4 text-sm text-gray-900">
                  <div className="space-x-2">
                    <button className="text-blue-600 hover:underline">
                      Preview
                    </button>
                    <button className="text-green-600 hover:underline">
                      Print
                    </button>
                    <button className="text-indigo-600 hover:underline">
                      Download
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {!loading && !error && (
        <PaginationControls
          currentPage={currentPage}
          totalPages={total}
          onPrevious={() => setCurrentPage(Math.max(currentPage - 1, 1))}
          onNext={() => setCurrentPage(Math.min(currentPage + 1, total))}
        />
      )}
    </>
  );
};

export default HonorsCertificateTable;
