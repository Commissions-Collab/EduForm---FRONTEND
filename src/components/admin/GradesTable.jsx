import React from "react";
import { ClipLoader } from "react-spinners";
import PaginationControls from "./Pagination";
import StatusBadge from "./StatusBadge";
import { useAdminStore } from "../../stores/useAdminStore";
import { getItem } from "../../lib/utils";
import { LuLoader, LuUser } from "react-icons/lu";
import { VscLayoutStatusbar } from "react-icons/vsc";

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

  const quarterId = selectedQuarter;

  return (
    <div className="space-y-6">
      {/* Main Table Card */}
      <div className="bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
        {/* Header Section */}
        <div className="px-4 sm:px-6 py-5 border-b border-gray-200 ">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Grade Entry Spreadsheet
              </h2>
              <p className="mt-1 text-sm text-gray-600">
                Enter grades — system computes average and status automatically
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <label className="text-sm font-medium text-gray-700 hidden sm:block">
                Quarter:
              </label>
              <select
                disabled={loading}
                value={selectedQuarter || ""}
                onChange={(e) => setSelectedQuarter(e.target.value)}
                className="px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed min-w-[140px]"
              >
                <option value="">Select Quarter</option>
                <option value="1">1st Quarter</option>
                <option value="2">2nd Quarter</option>
                <option value="3">3rd Quarter</option>
                <option value="4">4th Quarter</option>
              </select>
            </div>
          </div>
        </div>

        {error ? (
          /* Error State */
          <div className="py-20">
            <div className="flex flex-col items-center space-y-3">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-red-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <div className="text-center">
                <h3 className="text-red-900 font-medium">
                  Error Loading Grades
                </h3>
                <p className="text-red-900 text-sm mt-1">
                  Failed to fetch grades. Please try again.
                </p>
              </div>
            </div>
          </div>
        ) : !hasRecords && !loading ? (
          /* Empty State */
          <div className="py-20">
            <div className="flex flex-col items-center space-y-3">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <div className="text-center">
                <h3 className="text-gray-900 font-medium">No Grade Records</h3>
                <p className="text-gray-500 text-sm mt-1">
                  No grade records available for the selected quarter.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider sticky left-0 bg-gray-50 z-10 min-w-[200px]">
                      <div className="flex gap-2">
                        <LuUser className="w-4 h-4" />
                        Student Name
                      </div>
                    </th>
                    {subjects.map((subject) => (
                      <th
                        key={subject.id}
                        className="px-4 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[100px]"
                      >
                        {subject.name}
                      </th>
                    ))}
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[120px]">
                      <div className="flex justify-center gap-2">
                        <VscLayoutStatusbar className="w-4 h-4" />
                        Status
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td
                        colSpan={subjects.length + 2}
                        className="py-10 text-center"
                      >
                        <div className="flex flex-col items-center space-y-3">
                          <LuLoader className="w-6 h-6 text-blue-700 animate-spin" />
                          <p className="text-gray-500 text-sm">
                            Loading grade records...
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    records.map((student, index) => (
                      <tr
                        key={student.id}
                        className={`hover:bg-gray-50 transition-colors ${
                          index % 2 === 0 ? "bg-white" : "bg-gray-50/30"
                        }`}
                      >
                        <td className="px-6 py-4 text-sm font-semibold text-gray-900 sticky left-0 bg-inherit z-10">
                          {student.name}
                        </td>
                        {subjects.map((subject) => {
                          const grade = student.grades.find(
                            (g) => g.subject_id === subject.id
                          );
                          return (
                            <td
                              key={subject.id}
                              className="px-4 py-4 text-center"
                            >
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
                                className="w-16 p-2 border border-gray-300 rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-gray-700 disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
                              />
                            </td>
                          );
                        })}
                        <td className="px-6 py-4 text-center">
                          <StatusBadge status={student.status} />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="lg:hidden divide-y divide-gray-200">
              {loading ? (
                <div className="py-10 flex flex-col items-center space-y-3">
                  <ClipLoader color="#4F46E5" size={35} />
                  <p className="text-gray-500 text-sm">
                    Loading grade records...
                  </p>
                </div>
              ) : (
                records.map((student) => (
                  <div key={student.id} className="p-4 sm:p-6 space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900">
                          {student.name}
                        </h4>
                        <p className="text-sm text-gray-500 mt-1">
                          Grade Entry
                        </p>
                      </div>
                      <StatusBadge status={student.status} />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {subjects.map((subject) => {
                        const grade = student.grades.find(
                          (g) => g.subject_id === subject.id
                        );
                        return (
                          <div key={subject.id} className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                              {subject.name}
                            </label>
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
                              className="w-full p-3 border border-gray-300 rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-gray-700 disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
                              placeholder="Enter grade (0-100)"
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}

        {/* Pagination */}
        {!loading && hasRecords && (
          <div className="px-4 sm:px-6 py-4 border-t border-gray-200 bg-gray-50">
            <PaginationControls
              currentPage={currentPage}
              totalPages={pages}
              onPrevious={() => setPage(Math.max(currentPage - 1, 1))}
              onNext={() => setPage(Math.min(currentPage + 1, pages))}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default GradesTable;
