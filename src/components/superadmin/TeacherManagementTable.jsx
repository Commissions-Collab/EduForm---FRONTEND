import React, { useMemo, useState } from "react";
import { User, Pen, Trash2 } from "lucide-react";
import Pagination from "./Pagination";
import useTeacherManagementStore from "../../stores/superAdmin/teacherManagementStore";

const TeacherManagementTable = ({
  title,
  data = [], // Add default value for data
  searchTerm,
  loading,
  error,
  onAdd,
  onEdit,
  onDelete,
  onAssignSchedule,
  onAssignAdviser,
}) => {
  const { fetchTeachers, pagination } = useTeacherManagementStore();

  const filteredRecords = useMemo(() => {
    if (!Array.isArray(data)) return [];
    if (!searchTerm) return data;

    return data.filter((item) => {
      const fullName = `${item.first_name} ${item.middle_name || ""} ${
        item.last_name
      }`.toLowerCase();
      const email = item.user?.email?.toLowerCase() || "";
      const employeeId = item.employee_id?.toLowerCase() || "";
      const specialization = item.specialization?.toLowerCase() || "";
      const search = searchTerm.toLowerCase();

      return (
        fullName.includes(search) ||
        email.includes(search) ||
        employeeId.includes(search) ||
        specialization.includes(search)
      );
    });
  }, [data, searchTerm]);

  const handlePageChange = (page) => {
    fetchTeachers(page, pagination.per_page);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "inactive":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "terminated":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatName = (teacher) => {
    const fullName = `${teacher.first_name} ${
      teacher.middle_name ? teacher.middle_name + " " : ""
    }${teacher.last_name}`;
    return fullName.trim();
  };

  // Safe access to pagination properties
  const safeTotal = pagination?.total || 0;
  const safeCurrentPage = pagination?.current_page || 1;
  const safePerPage = pagination?.per_page || 10;
  const safeLastPage =
    pagination?.last_page || Math.ceil(safeTotal / safePerPage);

  // Mobile Card Component
  const TeacherCard = ({ teacher }) => {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
        <div className="flex items-start gap-3 mb-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-white font-semibold text-sm">
              {teacher.first_name?.[0]}
              {teacher.last_name?.[0]}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-sm font-medium text-gray-900 truncate">
                {formatName(teacher)}
              </h3>
            </div>
            <div className="space-y-1 text-xs text-gray-600">
              <p>
                <span className="font-medium">ID:</span>{" "}
                {teacher.employee_id || "N/A"}
              </p>
              <p>
                <span className="font-medium">Email:</span>{" "}
                {teacher.user?.email || "N/A"}
              </p>
              {teacher.phone && (
                <p>
                  <span className="font-medium">Phone:</span> {teacher.phone}
                </p>
              )}
              <p>
                <span className="font-medium">Specialization:</span>{" "}
                {teacher.specialization || "-"}
              </p>
              <div className="pt-2">
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
                    teacher.employment_status
                  )}`}
                >
                  {teacher.employment_status?.charAt(0).toUpperCase() +
                    teacher.employment_status?.slice(1)}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 pt-3 border-t border-gray-200">
          <button
            onClick={() => onEdit(teacher)}
            className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-1.5 text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
          >
            <Pen className="w-3.5 h-3.5" />
            Edit
          </button>
          <button
            onClick={() => onDelete(teacher.id)}
            className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Delete
          </button>
          <button
            onClick={() => onAssignSchedule(teacher)}
            className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-1.5 text-xs font-medium text-green-600 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
          >
            Schedule
          </button>
          <button
            onClick={() => onAssignAdviser(teacher)}
            className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-1.5 text-xs font-medium text-stone-600 bg-stone-50 hover:bg-stone-100 rounded-lg transition-colors"
          >
            Adviser
          </button>
        </div>
      </div>
    );
  };

  // Mobile Skeleton Card
  const SkeletonCard = () => (
    <div className="bg-white border border-gray-200 rounded-lg p-4 animate-pulse">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-32"></div>
          <div className="space-y-1">
            <div className="h-3 bg-gray-200 rounded w-48"></div>
            <div className="h-3 bg-gray-200 rounded w-40"></div>
            <div className="h-3 bg-gray-200 rounded w-32"></div>
            <div className="h-3 bg-gray-200 rounded w-24"></div>
          </div>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-2 pt-3 border-t border-gray-200">
        <div className="flex-1 h-6 bg-gray-200 rounded"></div>
        <div className="flex-1 h-6 bg-gray-200 rounded"></div>
        <div className="flex-1 h-6 bg-gray-200 rounded"></div>
        <div className="flex-1 h-6 bg-gray-200 rounded"></div>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
        <div className="p-4 sm:p-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
              <div>
                <h2 className="text-base sm:text-xl font-bold text-gray-900 mb-1 sm:mb-2">
                  {title}
                </h2>
                <p className="text-xs sm:text-sm text-gray-600">
                  Manage teacher profiles, schedules, and assignments
                </p>
              </div>
              {!loading && !error && (
                <div className="text-xs sm:text-sm text-gray-500">
                  {searchTerm ? (
                    <>
                      {filteredRecords.length} of {safeTotal} teachers
                      <span className="ml-1">
                        matching "
                        <span className="font-medium text-gray-700">
                          {searchTerm}
                        </span>
                        "
                      </span>
                    </>
                  ) : (
                    <>
                      {safeTotal} {safeTotal === 1 ? "teacher" : "teachers"}{" "}
                      found
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Action Button */}
            <div className="flex justify-start">
              <button
                onClick={onAdd}
                disabled={loading}
                className="flex items-center justify-center gap-2 px-3 py-2 text-xs sm:text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all shadow-sm hover:shadow disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <User className="w-4 h-4" />
                <span>Add Teacher</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="p-4 space-y-4">
          {[...Array(3)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : error ? (
        <div className="px-4 py-12 text-center">
          <User className="w-12 h-12 text-red-600 mx-auto mb-2" />
          <p className="font-medium text-red-900 text-sm">
            Failed to load data
          </p>
          <p className="text-xs text-red-600 mt-1">{error}</p>
        </div>
      ) : filteredRecords.length === 0 ? (
        <div className="px-4 py-12 text-center">
          <User className="w-12 h-12 text-gray-400 mx-auto mb-2" />
          <p className="font-medium text-gray-900 text-sm">No teachers found</p>
          <p className="text-xs text-gray-500 mt-1">
            {searchTerm ? "Try adjusting your search" : "No teachers available"}
          </p>
        </div>
      ) : (
        <>
          {/* Mobile Card View */}
          <div className="block lg:hidden p-4 space-y-4">
            {filteredRecords.map((teacher) => (
              <TeacherCard key={teacher.id} teacher={teacher} />
            ))}
          </div>

          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50/80">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Teacher
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Contact Information
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Specialization
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
                {filteredRecords.map((teacher) => (
                  <tr
                    key={teacher.id}
                    className="hover:bg-gray-50/50 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-semibold text-sm">
                            {teacher.first_name?.[0]}
                            {teacher.last_name?.[0]}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            {formatName(teacher)}
                          </div>
                          <div className="text-sm text-gray-500">
                            ID: {teacher.employee_id || "N/A"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <div className="text-gray-900">
                          {teacher.user?.email || "N/A"}
                        </div>
                        {teacher.phone && (
                          <div className="text-gray-500">{teacher.phone}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {teacher.specialization ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {teacher.specialization}
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
                          teacher.employment_status
                        )}`}
                      >
                        {teacher.employment_status?.charAt(0).toUpperCase() +
                          teacher.employment_status?.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2 opacity-75 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => onEdit(teacher)}
                          className="px-3 py-1.5 text-xs font-medium text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-lg flex items-center gap-1"
                        >
                          <Pen className="w-3.5 h-3.5" />
                          Edit
                        </button>
                        <button
                          onClick={() => onDelete(teacher.id)}
                          className="px-3 py-1.5 text-xs font-medium text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Delete
                        </button>
                        <button
                          onClick={() => onAssignSchedule(teacher)}
                          className="px-3 py-1.5 text-xs font-medium text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg"
                        >
                          Schedule
                        </button>
                        <button
                          onClick={() => onAssignAdviser(teacher)}
                          className="px-3 py-1.5 text-xs font-medium text-stone-600 hover:text-stone-800 hover:bg-stone-50 rounded-lg"
                        >
                          Adviser
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {!loading &&
        !error &&
        filteredRecords.length > 0 &&
        safeTotal > safePerPage && (
          <div className="border-t border-gray-200 bg-white px-4 sm:px-6 py-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <p className="text-xs sm:text-sm text-gray-600">
                Showing {(safeCurrentPage - 1) * safePerPage + 1} to{" "}
                {Math.min(safeCurrentPage * safePerPage, safeTotal)} of{" "}
                {safeTotal} results
              </p>
              <Pagination
                currentPage={safeCurrentPage}
                totalPages={safeLastPage}
                onPageChange={handlePageChange}
                disabled={loading}
              />
            </div>
          </div>
        )}
    </div>
  );
};

export default TeacherManagementTable;
