import React, { useMemo } from "react";
import { User, Pen, Trash2 } from "lucide-react";
import Pagination from "./Pagination";
import useTeacherManagementStore from "../../stores/superAdmin/teacherManagementStore";

const TeacherManagementTable = ({
  title,
  data = [],
  searchTerm,
  loading,
  error,
  onAdd,
  onEdit,
  onDelete,
  onAssignSchedule,
  onAssignAdviser,
  onAssignSubjects,
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

  const safeTotal = pagination?.total || 0;
  const safeCurrentPage = pagination?.current_page || 1;
  const safePerPage = pagination?.per_page || 10;
  const safeLastPage =
    pagination?.last_page || Math.ceil(safeTotal / safePerPage);

  // 📱 Mobile Card Layout
  const TeacherCard = ({ teacher }) => (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
          <span className="text-white font-semibold text-sm">
            {teacher.first_name?.[0]}
            {teacher.last_name?.[0]}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-gray-900 truncate">
            {formatName(teacher)}
          </h3>
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
      {/* ✅ Mobile Action Buttons */}
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
        <button
          onClick={() => onAssignSubjects(teacher)}
          className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
        >
          Assign Subject
        </button>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
        <div className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-base sm:text-xl font-bold text-gray-900 mb-1">
              {title}
            </h2>
            <p className="text-xs sm:text-sm text-gray-600">
              Manage teacher profiles, schedules, and assignments
            </p>
          </div>
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

      {/* TABLE CONTENT */}
      {!loading && !error && filteredRecords.length > 0 ? (
        <>
          {/* 📱 Mobile View */}
          <div className="block lg:hidden p-4 space-y-4">
            {filteredRecords.map((teacher) => (
              <TeacherCard key={teacher.id} teacher={teacher} />
            ))}
          </div>

          {/* 💻 Desktop View */}
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
                  <tr key={teacher.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-semibold">
                          {teacher.first_name?.[0]}
                          {teacher.last_name?.[0]}
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
                    <td className="px-6 py-4 text-sm text-gray-700">
                      <div>{teacher.user?.email}</div>
                      {teacher.phone && <div>{teacher.phone}</div>}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {teacher.specialization || "-"}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
                          teacher.employment_status
                        )}`}
                      >
                        {teacher.employment_status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => onEdit(teacher)}
                          className="text-indigo-600 hover:text-indigo-800 font-medium text-xs"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => onDelete(teacher.id)}
                          className="text-red-600 hover:text-red-800 font-medium text-xs"
                        >
                          Delete
                        </button>
                        <button
                          onClick={() => onAssignSchedule(teacher)}
                          className="text-green-600 hover:text-green-800 font-medium text-xs"
                        >
                          Schedule
                        </button>
                        <button
                          onClick={() => onAssignAdviser(teacher)}
                          className="text-stone-600 hover:text-stone-800 font-medium text-xs"
                        >
                          Adviser
                        </button>
                        <button
                          onClick={() => onAssignSubjects(teacher)}
                          className="text-blue-600 hover:text-blue-800 font-medium text-xs"
                        >
                          Assign Subject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <div className="p-6 text-center text-gray-500 text-sm">
          {loading
            ? "Loading teachers..."
            : error
            ? error
            : "No teacher records found."}
        </div>
      )}

      {/* Pagination */}
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
