import React, { useMemo, useEffect } from "react";
import {
  Users,
  BookOpen,
  Clock,
  UserCheck,
  GraduationCap,
  Eye,
  Menu,
} from "lucide-react";
import Pagination from "./Pagination";
import useWorkloadsStore from "../../stores/admin/workloadStore";

const WorkloadTable = ({ searchTerm }) => {
  const {
    workloads,
    loading,
    error,
    currentPage,
    setCurrentPage,
    getPaginatedRecords,
    getTotalPages,
  } = useWorkloadsStore();

  const filteredRecords = useMemo(
    () =>
      workloads.filter((record) =>
        record.section?.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [workloads, searchTerm]
  );

  // Reset to page 1 when search term changes
  useEffect(() => {
    if (currentPage !== 1 && searchTerm) {
      setCurrentPage(1);
    }
  }, [searchTerm]);

  const totalRecords = filteredRecords.length;
  const paginatedRecords = getPaginatedRecords(filteredRecords);
  const totalPages = getTotalPages(totalRecords);

  const getWorkloadLevel = (hours) => {
    if (hours >= 20)
      return {
        level: "High",
        bg: "bg-red-50",
        text: "text-red-700",
        border: "border-red-200",
      };
    if (hours >= 15)
      return {
        level: "Medium",
        bg: "bg-amber-50",
        text: "text-amber-700",
        border: "border-amber-200",
      };
    return {
      level: "Low",
      bg: "bg-green-50",
      text: "text-green-700",
      border: "border-green-200",
    };
  };

  const getSectionColor = (section) => {
    const colors = [
      "bg-blue-100 text-blue-800 border-blue-200",
      "bg-purple-100 text-purple-800 border-purple-200",
      "bg-green-100 text-green-800 border-green-200",
      "bg-rose-100 text-rose-800 border-rose-200",
      "bg-amber-100 text-amber-800 border-amber-200",
      "bg-teal-100 text-teal-800 border-teal-200",
    ];
    const hash =
      section?.split("").reduce((a, b) => a + b.charCodeAt(0), 0) || 0;
    return colors[hash % colors.length];
  };

  const SkeletonRow = () => (
    <tr className="animate-pulse">
      <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-200 rounded-lg flex-shrink-0"></div>
          <div className="w-20 sm:w-24 h-3 sm:h-4 bg-gray-200 rounded"></div>
        </div>
      </td>
      <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-center">
        <div className="w-8 sm:w-10 h-3 sm:h-4 bg-gray-200 rounded mx-auto"></div>
      </td>
      <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
        <div className="w-24 sm:w-32 h-3 sm:h-4 bg-gray-200 rounded mb-1 sm:mb-2"></div>
        <div className="w-12 sm:w-16 h-2.5 sm:h-3 bg-gray-200 rounded"></div>
      </td>
      <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-center">
        <div className="w-16 sm:w-20 h-4 sm:h-5 bg-gray-200 rounded mx-auto"></div>
      </td>
      <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-center">
        <div className="w-8 sm:w-10 h-3 sm:h-4 bg-gray-200 rounded mx-auto mb-1 sm:mb-2"></div>
        <div className="w-12 sm:w-16 h-4 sm:h-5 bg-gray-200 rounded mx-auto"></div>
      </td>
      <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-center gap-1 sm:gap-2">
          <div className="w-10 sm:w-12 h-5 sm:h-6 bg-gray-200 rounded"></div>
          <div className="w-6 sm:w-8 h-5 sm:h-6 bg-gray-200 rounded"></div>
        </div>
      </td>
    </tr>
  );

  // Mobile Card Component
  const MobileCard = ({ record }) => {
    const workloadLevel = getWorkloadLevel(record.hours_per_week || 0);

    return (
      <div className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4 mb-3 last:mb-0 hover:shadow-sm transition-shadow">
        <div className="flex items-start gap-3 mb-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <span
              className={`inline-block px-2 py-1 rounded-full text-xs sm:text-sm font-medium border ${getSectionColor(
                record.section
              )}`}
            >
              {record.section}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="text-center py-2">
            <div className="text-lg font-bold text-gray-900">
              {record.students || 0}
            </div>
            <div className="text-xs text-gray-500">Students</div>
          </div>
          <div className="text-center py-2">
            <div className="text-lg font-bold text-gray-900">
              {record.hours_per_week || 0}
            </div>
            <div className="text-xs text-gray-500">Hours/Week</div>
          </div>
          <div className="text-center py-2">
            <span
              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${workloadLevel.bg} ${workloadLevel.text} ${workloadLevel.border}`}
            >
              <Clock className="w-3 h-3 mr-1" />
              {workloadLevel.level}
            </span>
            <div className="text-xs text-gray-500 mt-1">Workload Level</div>
          </div>
          <div className="text-center py-2">
            <span
              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                record.advisory_role === "Yes"
                  ? "bg-green-100 text-green-800 border border-green-200"
                  : "bg-gray-100 text-gray-800 border border-gray-200"
              }`}
            >
              {record.advisory_role === "Yes" ? (
                <>
                  <UserCheck className="w-3 h-3 mr-1" />
                  Advisory
                </>
              ) : (
                "Non advisory"
              )}
            </span>
            <div className="text-xs text-gray-500 mt-1">Role</div>
          </div>
        </div>

        {/* Subjects List */}
        <div className="mb-3">
          <p className="text-xs font-medium text-gray-500 mb-2">
            Subjects ({record.subjects?.length || 0})
          </p>
          <div className="space-y-1 max-h-20 overflow-y-auto">
            {record.subjects_display ? (
              <p
                className="text-xs text-gray-900 line-clamp-3"
                title={record.subjects_display}
              >
                {record.subjects_display}
              </p>
            ) : (
              <p className="text-xs text-gray-500 italic">
                No subjects assigned
              </p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
          <button className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors">
            <Eye className="w-3.5 h-3.5" />
            View
          </button>
          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
            <Menu className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  };

  // Mobile Skeleton Card
  const MobileSkeletonCard = () => (
    <div className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4 mb-3 animate-pulse">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 bg-gray-200 rounded-lg" />
        <div className="w-20 h-4 bg-gray-200 rounded" />
      </div>
      <div className="grid grid-cols-2 gap-3 mb-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="text-center py-2">
            <div className="h-4 w-6 bg-gray-200 rounded mx-auto mb-1" />
            <div className="h-2.5 w-10 bg-gray-200 rounded mx-auto" />
          </div>
        ))}
      </div>
      <div className="space-y-1 max-h-20 overflow-y-auto">
        <div className="h-3 w-full bg-gray-200 rounded" />
        <div className="h-3 w-3/4 bg-gray-200 rounded" />
      </div>
      <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
        <div className="h-6 w-10 bg-gray-200 rounded" />
        <div className="h-6 w-8 bg-gray-200 rounded" />
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
        <div className="p-3 sm:p-4 lg:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <div className="min-w-0">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 sm:mb-2">
                Teaching Workload Distribution
              </h2>
              <p className="text-xs sm:text-sm text-gray-600">
                Comprehensive view of section assignments and teaching hours
              </p>
            </div>
            {!loading && (
              <div className="text-xs sm:text-sm text-gray-500">
                {totalRecords} {totalRecords === 1 ? "section" : "sections"}{" "}
                found
                {searchTerm && (
                  <span className="ml-1">
                    for "
                    <span className="font-medium text-gray-700">
                      {searchTerm}
                    </span>
                    "
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Cards View (hidden on lg+) */}
      <div className="lg:hidden divide-y divide-gray-200">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <MobileSkeletonCard key={i} />
          ))
        ) : error ? (
          <div className="p-6 sm:p-8 text-center">
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-100 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
              </div>
              <div className="text-center">
                <p className="font-medium text-red-900 text-sm sm:text-base">
                  Failed to load workload data
                </p>
                <p className="text-xs sm:text-sm text-red-600 mt-1">{error}</p>
              </div>
            </div>
          </div>
        ) : paginatedRecords.length === 0 ? (
          <div className="p-6 sm:p-8 text-center">
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 rounded-full flex items-center justify-center">
                <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" />
              </div>
              <div className="text-center">
                <p className="font-medium text-gray-900 text-sm sm:text-base">
                  No workload records found
                </p>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                  {searchTerm
                    ? "Try adjusting your search criteria"
                    : "No workload records available"}
                </p>
              </div>
            </div>
          </div>
        ) : (
          paginatedRecords.map((record, index) => (
            <MobileCard key={`${record.section}-${index}`} record={record} />
          ))
        )}
      </div>

      {/* Desktop Table View (hidden on mobile) */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50/50">
            <tr>
              <th className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider sticky left-0 bg-gray-50 z-10">
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4" />
                  Section
                </div>
              </th>
              <th className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                <div className="flex items-center justify-center gap-2">
                  <Users className="w-4 h-4" />
                  Students
                </div>
              </th>
              <th className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  Subjects
                </div>
              </th>
              <th className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                <div className="flex items-center justify-center gap-2">
                  <UserCheck className="w-4 h-4" />
                  Advisory
                </div>
              </th>
              <th className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                <div className="flex items-center justify-center gap-2">
                  <Clock className="w-4 h-4" />
                  Hours/Week
                </div>
              </th>
              <th className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
            ) : error ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-3 sm:px-4 lg:px-6 py-12 sm:py-16 text-center"
                >
                  <div className="flex flex-col items-center gap-2 sm:gap-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-100 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
                    </div>
                    <div className="text-center">
                      <p className="font-medium text-red-900 text-sm sm:text-base">
                        Failed to load workload data
                      </p>
                      <p className="text-xs sm:text-sm text-red-600 mt-1">
                        {error}
                      </p>
                    </div>
                  </div>
                </td>
              </tr>
            ) : paginatedRecords.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-3 sm:px-4 lg:px-6 py-12 sm:py-16 text-center"
                >
                  <div className="flex flex-col items-center gap-2 sm:gap-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 rounded-full flex items-center justify-center">
                      <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" />
                    </div>
                    <div className="text-center">
                      <p className="font-medium text-gray-900 text-sm sm:text-base">
                        No workload records found
                      </p>
                      <p className="text-xs sm:text-sm text-gray-500 mt-1">
                        {searchTerm
                          ? "Try adjusting your search criteria"
                          : "No workload records available"}
                      </p>
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedRecords.map((record, index) => {
                const workloadLevel = getWorkloadLevel(
                  record.hours_per_week || 0
                );
                return (
                  <tr
                    key={`${record.section}-${index}`}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    {/* Section */}
                    <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 sticky left-0 bg-white z-10">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                          <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <span
                            className={`inline-flex items-center px-1.5 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-medium border ${getSectionColor(
                              record.section
                            )}`}
                          >
                            {record.section}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Students */}
                    <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-center">
                      <div className="flex flex-col items-center">
                        <span className="text-base sm:text-lg font-bold text-gray-900">
                          {record.students || 0}
                        </span>
                        <span className="text-xs text-gray-500 hidden sm:block">
                          students
                        </span>
                      </div>
                    </td>

                    {/* Subjects */}
                    <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
                      <div className="min-w-0">
                        {record.subjects_display ? (
                          <>
                            <p
                              className="text-xs sm:text-sm text-gray-900 font-medium truncate"
                              title={record.subjects_display}
                            >
                              {record.subjects_display}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {record.subjects?.length || 0} subject(s)
                            </p>
                          </>
                        ) : (
                          <p className="text-xs sm:text-sm text-gray-500 italic">
                            No subjects assigned
                          </p>
                        )}
                      </div>
                    </td>

                    {/* Advisory Role */}
                    <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-center">
                      <span
                        className={`inline-flex items-center px-1.5 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-medium ${
                          record.advisory_role === "Yes"
                            ? "bg-green-100 text-green-800 border border-green-200"
                            : "bg-gray-100 text-gray-800 border border-gray-200"
                        }`}
                      >
                        {record.advisory_role === "Yes" ? (
                          <>
                            <UserCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1" />
                            <span className="hidden sm:inline">Advisory</span>
                            <span className="sm:hidden">Adv.</span>
                          </>
                        ) : (
                          "Non adv."
                        )}
                      </span>
                    </td>

                    {/* Hours per Week */}
                    <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-center">
                      <div className="flex flex-col items-center gap-1 sm:gap-2">
                        <span className="text-base sm:text-lg font-bold text-gray-900">
                          {record.hours_per_week || 0}
                        </span>
                        <span
                          className={`inline-flex items-center px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-medium border ${workloadLevel.bg} ${workloadLevel.text} ${workloadLevel.border}`}
                        >
                          <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1" />
                          {workloadLevel.level}
                        </span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
                      <div className="flex items-center justify-center gap-1 sm:gap-2">
                        <button className="inline-flex items-center gap-0.5 sm:gap-1 px-2 sm:px-3 py-1 sm:py-1.5 text-xs font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors">
                          <Eye className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                          <span className="hidden sm:inline">View</span>
                        </button>
                        <button className="inline-flex items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2 py-1 sm:py-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                          <Menu className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {!loading && !error && totalRecords > 0 && (
        <div className="border-t border-gray-200 bg-white px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <p className="text-xs sm:text-sm text-gray-600 text-center sm:text-left">
              Showing {Math.min((currentPage - 1) * 10 + 1, totalRecords)} to{" "}
              {Math.min(currentPage * 10, totalRecords)} of {totalRecords}{" "}
              results
            </p>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkloadTable;
