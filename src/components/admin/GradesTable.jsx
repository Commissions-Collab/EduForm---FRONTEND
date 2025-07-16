import React from "react";

import PaginationControls from "./Pagination";
import StatusBadge from "./StatusBadge";

const GradesTable = ({
  students,
  currentPage,
  totalPages,
  onPreviousPage,
  onNextPage,
  onInputChange,
  selectedQuarter,
  onQuarterChange,
}) => {
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
            value={selectedQuarter}
            onChange={onQuarterChange}
            className="px-3 py-2 text-sm border border-gray-300 rounded"
          >
            <option value="All Quarters">All Quarters</option>
            <option value="1st Quarter">1st Quarter</option>
            <option value="2nd Quarter">2nd Quarter</option>
            <option value="3rd Quarter">3rd Quarter</option>
            <option value="4th Quarter">4th Quarter</option>
          </select>
        </div>

        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Name
              </th>
              {["Math", "Science", "English", "Filipino", "History"].map(
                (subject) => (
                  <th
                    key={subject}
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                  >
                    {subject}
                  </th>
                )
              )}
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Average
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Status
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {Array.isArray(students) &&
              students.map((student) => {
                const average = (
                  (student.math +
                    student.science +
                    student.english +
                    student.filipino +
                    student.history) /
                  5
                ).toFixed(2);

                const status = average >= 75 ? "Pass" : "Fail";

                return (
                  <tr key={student.id}>
                    <td className="px-4 py-4 text-sm text-gray-900 font-medium">
                      {student.name}
                    </td>
                    {["math", "science", "english", "filipino", "history"].map(
                      (subject) => (
                        <td key={subject} className="px-4 py-4 text-sm">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={student[subject]}
                            onChange={(e) =>
                              onInputChange(student.id, subject, e.target.value)
                            }
                            className="w-16 p-1 border border-gray-300 rounded text-center focus:outline-none focus:ring-2 focus:ring-[#3730A3] focus:border-transparent transition-all duration-200 text-gray-700"
                          />
                        </td>
                      )
                    )}
                    <td className="px-4 py-4 text-sm font-medium text-gray-900">
                      {average}
                    </td>
                    <td className="px-4 py-4">
                      <StatusBadge status={status} />
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>

      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        onPrevious={onPreviousPage}
        onNext={onNextPage}
      />
    </>
  );
};

export default GradesTable;
