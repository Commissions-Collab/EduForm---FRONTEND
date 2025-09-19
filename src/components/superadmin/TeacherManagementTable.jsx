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

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
        <div className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">{title}</h2>
              <p className="text-sm text-gray-600">
                Manage teacher profiles, schedules, and assignments
              </p>
            </div>
            <div className="flex items-center gap-4">
              {!loading && !error && (
                <div className="text-sm text-gray-500">
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
              <button
                onClick={onAdd}
                disabled={loading}
                className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center space-x-2 transition-all duration-200 shadow-sm hover:shadow disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <User className="w-4 h-4" />
                <span>Add Teacher</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full divide-y divide-gray-200">
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
            {loading ? (
              <tr>
                <td colSpan={5} className="px-6 py-16 text-center">
                  Loading...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={5} className="px-6 py-16 text-center text-red-600">
                  Failed to load teacher data: {error}
                </td>
              </tr>
            ) : filteredRecords.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-16 text-center text-gray-500"
                >
                  No teachers found
                </td>
              </tr>
            ) : (
              filteredRecords.map((teacher) => (
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
              ))
            )}
          </tbody>
        </table>
      </div>

      {!loading &&
        !error &&
        filteredRecords.length > 0 &&
        safeTotal > safePerPage && (
          <div className="border-t border-gray-200 bg-gray-50/30 px-6 py-4">
            <Pagination
              currentPage={safeCurrentPage}
              totalPages={safeLastPage}
              onPageChange={handlePageChange}
              disabled={loading}
            />
          </div>
        )}
    </div>
  );
};

export default TeacherManagementTable;
