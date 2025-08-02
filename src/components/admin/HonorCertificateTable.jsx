import React, { useState } from "react";
import { LuPrinter } from "react-icons/lu";
import PaginationControls from "./Pagination";
import { useAdminStore } from "../../stores/useAdminStore";
import { ClipLoader } from "react-spinners";

const HonorsCertificateTable = () => {
  const {
    honorCertificates,
    certificateCurrentPage,
    setCertificateCurrentPage,
    loading,
    error,
  } = useAdminStore();

  const [searchName, setSearchName] = useState("");
  const [filterType, setFilterType] = useState("All");

  const filteredRecords = honorCertificates.filter((record) => {
    const matchesName = (record.student_name || "")
      .toLowerCase()
      .includes(searchName.toLowerCase());
    const matchesHonor =
      filterType === "All" || record.honor_type === filterType;
    return matchesName && matchesHonor;
  });

  const indexOfLast = certificateCurrentPage * 5;
  const indexOfFirst = indexOfLast - 5;
  const records = filteredRecords.slice(indexOfFirst, indexOfLast);
  const total = Math.ceil(filteredRecords.length / 5);

  return (
    <>
      <div className="mt-10 overflow-x-auto bg-white rounded-lg shadow-md  min-h-[400px]">
        <div className="flex items-center justify-between p-5">
          <div>
            <h1 className="text-lg font-semibold mb-1">Honor Certificates</h1>
            <p className="text-sm text-gray-500">
              Students who qualify for honors based on grades.
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

        <div className="min-w-full">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs text-gray-500 uppercase">
                  Student Name
                </th>
                <th className="px-4 py-3 text-left text-xs text-gray-500 uppercase">
                  Certificate Type
                </th>
                <th className="px-4 py-3 text-left text-xs text-gray-500 uppercase">
                  Details
                </th>
                <th className="px-4 py-3 text-left text-xs text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td
                    colSpan={4}
                    className="p-6 text-center text-sm text-gray-500"
                  >
                    <ClipLoader size={30} color="#4F46E5" />
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td
                    colSpan={4}
                    className="p-6 text-center text-sm text-red-500"
                  >
                    {error}
                  </td>
                </tr>
              ) : records.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="p-6 text-center text-sm text-gray-500"
                  >
                    No honor certificate records found.
                  </td>
                </tr>
              ) : (
                records.map((record, idx) => (
                  <tr key={idx}>
                    <td className="px-4 py-4 text-sm text-gray-900">
                      {record.student_name}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900">
                      {record.honor_type}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900">
                      Grade Average: {record.grade_average} <br />
                      Quarter: {record.quarter}
                    </td>
                    <td className="px-4 py-4 text-sm">
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
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {!loading && !error && records.length > 0 && (
        <PaginationControls
          currentPage={certificateCurrentPage}
          totalPages={total}
          onPrevious={() =>
            setCertificateCurrentPage(Math.max(certificateCurrentPage - 1, 1))
          }
          onNext={() =>
            setCertificateCurrentPage(
              Math.min(certificateCurrentPage + 1, total)
            )
          }
        />
      )}
    </>
  );
};

export default HonorsCertificateTable;
