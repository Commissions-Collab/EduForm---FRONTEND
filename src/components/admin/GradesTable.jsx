import React from "react";
import { ClipLoader } from "react-spinners";
import PaginationControls from "./Pagination";
import StatusBadge from "./StatusBadge";
import { useAdminStore } from "../../stores/useAdminStore";
import { getItem } from "../../lib/utils";

const GradesTable = () => {
  const {
    students,
    subjects,
    currentPage,
    setPage,
    totalPages,
    paginatedGradeRecords,
    updateGrade,
    selectedQuarter,
    setSelectedQuarter,
    loading,
    error,
  } = useAdminStore();

  const records = paginatedGradeRecords();
  const pages = totalPages();
  const hasRecords = Array.isArray(records) && records.length > 0;

  const quarterId = getItem("quarterId", false);

  return (
    <>
      <div className="mt-8 overflow-x-auto bg-white rounded-lg shadow-md">
        <div className="flex items-center justify-between p-5">
          <div>
            <h1 className="text-lg font-semibold mb-1">
              Grade Entry Spreadsheet
            </h1>
            <p className="text-sm text-gray-500">
              Enter grades — system computes average and status.
            </p>
          </div>
          <select
            value={selectedQuarter || ""}
            onChange={(e) => setSelectedQuarter(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-300 rounded"
          >
            <option value="">Select Quarter</option>
            <option value="1">1st Quarter</option>
            <option value="2">2nd Quarter</option>
            <option value="3">3rd Quarter</option>
            <option value="4">4th Quarter</option>
          </select>
        </div>

        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Name
              </th>
              {subjects.map((subject) => (
                <th
                  key={subject.id}
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                >
                  {subject.name}
                </th>
              ))}
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Status
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={subjects.length + 2}>
                  <div className="flex justify-center items-center h-[60vh]">
                    <ClipLoader color="#3730A3" size={30} />
                  </div>
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={subjects.length + 2}>
                  <div className="flex justify-center items-center h-[60vh] text-red-600 font-medium">
                    Failed to fetch grades. Please try again.
                  </div>
                </td>
              </tr>
            ) : !hasRecords ? (
              <tr>
                <td colSpan={subjects.length + 2}>
                  <div className="flex justify-center items-center h-[60vh] text-gray-600 font-medium">
                    No grade records available.
                  </div>
                </td>
              </tr>
            ) : (
              records.map((student) => (
                <tr key={student.id}>
                  <td className="px-4 py-4 text-sm text-gray-900 font-medium">
                    {student.name}
                  </td>
                  {subjects.map((subject) => {
                    const grade = student.grades.find(
                      (g) => g.subject_id === subject.id
                    );

                    return (
                      <td key={subject.id} className="px-4 py-4 text-sm">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          disabled={!grade?.can_edit}
                          value={grade?.grade ?? ""}
                          onChange={(e) =>
                            updateGrade({
                              student_id: student.id,
                              subject_id: subject.id,
                              quarter_id: quarterId,
                              grade:
                                e.target.value === ""
                                  ? null
                                  : Number(e.target.value),
                            })
                          }
                          className="w-16 p-1 border border-gray-300 rounded text-center focus:outline-none focus:ring-2 focus:ring-[#3730A3] focus:border-transparent transition-all duration-200 text-gray-700 disabled:bg-gray-100"
                        />
                      </td>
                    );
                  })}
                  <td className="px-4 py-4">
                    <StatusBadge status={student.status} />
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
          totalPages={pages}
          onPrevious={() => setPage(Math.max(currentPage - 1, 1))}
          onNext={() => setPage(Math.min(currentPage + 1, pages))}
        />
      )}
    </>
  );
};

export default GradesTable;
