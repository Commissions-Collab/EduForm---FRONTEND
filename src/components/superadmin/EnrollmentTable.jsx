import React, { useMemo } from "react";
import { LuUsers, LuEye, LuMenu } from "react-icons/lu";
import Pagination from "./Pagination";
import useEnrollmentStore from "../../stores/superAdmin/enrollmentStore";

const EnrollmentTable = ({
  title,
  data,
  searchTerm,
  loading,
  error,
  selectedEnrollments,
  setSelectedEnrollments,
  onAdd,
  onBulk,
  onPromote,
  onEdit,
  onDelete,
}) => {
  const { fetchEnrollments, pagination } = useEnrollmentStore();

  const filteredRecords = useMemo(() => {
    return data.filter((item) =>
      `${item.student?.first_name} ${item.student?.middle_name || ""} ${
        item.student?.last_name
      } ${item.student?.lrn} ${item.section?.name}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  }, [data, searchTerm]);

  const handlePageChange = (page) => {
    fetchEnrollments(page, pagination.per_page);
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedEnrollments(filteredRecords);
    } else {
      setSelectedEnrollments([]);
    }
  };

  const handleSelectEnrollment = (enrollment) => {
    setSelectedEnrollments((prev) =>
      prev.includes(enrollment)
        ? prev.filter((item) => item.id !== enrollment.id)
        : [...prev, enrollment]
    );
  };

  const SkeletonRow = () => (
    <tr className="animate-pulse">
      <td className="px-6 py-4">
        <div className="w-4 h-4 bg-gray-200 rounded"></div>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
          <div className="w-24 h-4 bg-gray-200 rounded"></div>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="w-32 h-4 bg-gray-200 rounded"></div>
      </td>
      <td className="px-6 py-4">
        <div className="w-24 h-4 bg-gray-200 rounded"></div>
      </td>
      <td className="px-6 py-4">
        <div className="w-24 h-4 bg-gray-200 rounded"></div>
      </td>
      <td className="px-6 py-4">
        <div className="w-20 h-4 bg-gray-200 rounded"></div>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center justify-center gap-2">
          <div className="w-12 h-6 bg-gray-200 rounded"></div>
          <div className="w-8 h-6 bg-gray-200 rounded"></div>
        </div>
      </td>
    </tr>
  );

  const getStatusColor = (status) => {
    switch (status) {
      case "enrolled":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "withdrawn":
        return "bg-red-100 text-red-800 border-red-200";
      case "transferred":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
        <div className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">{title}</h2>
              <p className="text-sm text-gray-600">
                Manage student enrollments
              </p>
            </div>
            <div className="flex items-center gap-4">
              {!loading && (
                <div className="text-sm text-gray-500">
                  {pagination.total}{" "}
                  {pagination.total === 1 ? "enrollment" : "enrollments"} found
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
              <button
                onClick={onAdd}
                className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center space-x-2 transition-all duration-200 shadow-sm hover:shadow"
              >
                <LuUsers className="w-4 h-4" />
                <span>Add Enrollment</span>
              </button>
              <button
                onClick={onBulk}
                disabled={selectedEnrollments.length === 0}
                className={`px-4 py-2 text-sm rounded-lg flex items-center space-x-2 transition-all duration-200 shadow-sm hover:shadow ${
                  selectedEnrollments.length === 0
                    ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                <LuUsers className="w-4 h-4" />
                <span>Bulk Enroll ({selectedEnrollments.length})</span>
              </button>
              <button
                onClick={onPromote}
                disabled={selectedEnrollments.length === 0}
                className={`px-4 py-2 text-sm rounded-lg flex items-center space-x-2 transition-all duration-200 shadow-sm hover:shadow ${
                  selectedEnrollments.length === 0
                    ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                    : "bg-green-600 text-white hover:bg-green-700"
                }`}
              >
                <LuUsers className="w-4 h-4" />
                <span>Promote Selected ({selectedEnrollments.length})</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full divide-y divide-gray-200">
          <thead className="bg-gray-50/50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                <input
                  type="checkbox"
                  checked={
                    filteredRecords.length > 0 &&
                    selectedEnrollments.length === filteredRecords.length
                  }
                  onChange={handleSelectAll}
                  className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                <div className="flex items-center gap-2">
                  <LuUsers className="w-4 h-4" />
                  Student
                </div>
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                LRN
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Grade Level
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Section
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
            ) : error ? (
              <tr>
                <td colSpan={7} className="px-6 py-16 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                      <LuUsers className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                      <p className="font-medium text-red-900">
                        Failed to load enrollment data
                      </p>
                      <p className="text-sm text-red-600 mt-1">{error}</p>
                    </div>
                  </div>
                </td>
              </tr>
            ) : filteredRecords.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-16 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                      <LuUsers className="w-6 h-6 text-gray-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        No enrollments found
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        {searchTerm
                          ? "Try adjusting your search criteria"
                          : "No enrollments available"}
                      </p>
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              filteredRecords.map((enrollment) => (
                <tr
                  key={enrollment.id}
                  className="hover:bg-gray-50/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedEnrollments.includes(enrollment)}
                      onChange={() => handleSelectEnrollment(enrollment)}
                      className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <LuUsers className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border bg-blue-100 text-blue-800 border-blue-200">
                          {enrollment.student?.first_name}{" "}
                          {enrollment.student?.middle_name || ""}{" "}
                          {enrollment.student?.last_name}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {enrollment.student?.lrn || "N/A"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {enrollment.yearLevel?.name || "-"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {enrollment.section?.name || "-"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                        enrollment.enrollment_status
                      )}`}
                    >
                      {enrollment.enrollment_status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => onEdit(enrollment)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <LuEye className="w-3.5 h-3.5" />
                        Edit
                      </button>
                      <button
                        onClick={() => onDelete(enrollment.id)}
                        className="inline-flex items-center gap-1 px-2 py-1.5 text-xs font-medium text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <LuMenu className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {!loading && !error && pagination.total > 0 && (
        <div className="border-t border-gray-200 bg-white px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <p className="text-sm text-gray-600">
              Showing {(pagination.current_page - 1) * pagination.per_page + 1}{" "}
              to{" "}
              {Math.min(
                pagination.current_page * pagination.per_page,
                pagination.total
              )}{" "}
              of {pagination.total} results
            </p>
            <Pagination
              currentPage={pagination.current_page}
              totalPages={Math.ceil(pagination.total / pagination.per_page)}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default EnrollmentTable;
