import React, { useEffect } from "react";
import { ClipLoader } from "react-spinners";

import Pagination from "./Pagination";
import { useAdminStore } from "../../stores/useAdminStore";

const WorkloadTable = ({ searchTerm }) => {
  const {
    fetchWorkloads,
    workloads,
    loading,
    error,
    paginatedWorkloadRecords,
    workloadCurrentPage,
    setWorkloadCurrentPage,
    totalWorkloadPages,
  } = useAdminStore();

  const filteredRecords = paginatedWorkloadRecords().filter((record) =>
    record.section?.toLowerCase()?.includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="mt-8 overflow-x-auto bg-white rounded-lg shadow-md min-h-[400px]">
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
                  {error}
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
                    {record.subjects_display}
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        record.advisory_role === "Yes"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {record.advisory_role}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-900">
                    {record.hours_per_week}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {!loading && filteredRecords.length > 0 && (
        <Pagination
          currentPage={workloadCurrentPage}
          totalPages={totalWorkloadPages()}
          onPrevious={() =>
            setWorkloadCurrentPage(Math.max(workloadCurrentPage - 1, 1))
          }
          onNext={() =>
            setWorkloadCurrentPage(
              Math.min(workloadCurrentPage + 1, totalWorkloadPages())
            )
          }
        />
      )}
    </>
  );
};

export default WorkloadTable;
