import React from "react";
import { ClipLoader } from "react-spinners";
import { useWorkloadStore } from "../../stores/useWorkloadStore";
import Pagination from "./Pagination";

const WorkloadTable = ({ searchTerm }) => {
  const {
    workloads,
    paginatedRecords,
    totalPages,
    currentPage,
    setCurrentPage,
    loading,
    error,
  } = useWorkloadStore();

  const filteredRecords = paginatedRecords().filter((record) => {
    return record.section?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <>
      <div className="mt-8 overflow-x-auto bg-white rounded-lg shadow-md min-h-[200px]">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Section
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Students
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Subject
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Advisory Role
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Hours/Week
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={5} className="text-center py-20">
                  <ClipLoader size={30} color="#4F46E5" />
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={5} className="text-center py-20 text-red-600">
                  Failed to load workload records.
                </td>
              </tr>
            ) : filteredRecords.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-20 text-gray-500">
                  No workload records found.
                </td>
              </tr>
            ) : (
              filteredRecords.map((record, index) => (
                <tr key={index} className="border-t">
                  <td className="px-4 py-4 text-sm text-gray-900">
                    {record.section}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-900">
                    {record.students}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-900">
                    {record.subject}
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        record.advisory
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {record.advisory ? "Yes" : "No"}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-900">
                    {record.hoursPerWeek}
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

export default WorkloadTable;
