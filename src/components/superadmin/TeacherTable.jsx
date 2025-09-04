import React, { useMemo, useState, useEffect } from "react";
import { LuUser, LuPen, LuTrash } from "react-icons/lu";
import useFormsManagementStore from "../../stores/superAdmin/formsManagementStore";
import useTeacherManagementStore from "../../stores/superAdmin/teacherManagementStore";
import Pagination from "./Pagination";

const TeacherTable = ({ searchTerm, onEdit }) => {
  const { teachers, isLoading, error, deleteTeacher } =
    useTeacherManagementStore();
  const { updateFormData } = useFormsManagementStore();
  const [currentPage, setCurrentPage] = useState(1);

  const recordsPerPage = 10;

  // Memoize filtered teachers
  const filteredTeachers = useMemo(() => {
    const result = Array.isArray(teachers)
      ? teachers.filter((teacher) => {
          const name = teacher.name || teacher.full_name || "";
          const email = teacher.email || "";
          return (
            name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            email.toLowerCase().includes(searchTerm.toLowerCase())
          );
        })
      : [];
    console.log("filteredTeachers:", result); // Debug log
    return result;
  }, [teachers, searchTerm]);

  // Calculate paginated records
  const paginatedRecords = useMemo(() => {
    const start = (currentPage - 1) * recordsPerPage;
    const end = start + recordsPerPage;
    const result = filteredTeachers.slice(start, end);
    console.log("paginatedRecords:", result); // Debug log
    return result;
  }, [filteredTeachers, currentPage]);

  const totalPages = Math.ceil(filteredTeachers.length / recordsPerPage);

  // Reset to page 1 when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Handle edit
  const handleEdit = (teacher) => {
    updateFormData("teacher", {
      id: teacher.id,
      name: teacher.name || teacher.full_name || "Unnamed",
      email: teacher.email || "-",
    });
    onEdit();
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this teacher?")) {
      await deleteTeacher(id);
    }
  };

  // Skeleton row for loading state
  const SkeletonRow = () => (
    <tr className="animate-pulse">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
          <div className="w-24 h-4 bg-gray-200 rounded"></div>
        </div>
      </td>
      <td className="px-6 py-4 text-center">
        <div className="w-32 h-4 bg-gray-200 rounded mx-auto"></div>
      </td>
      <td className="px-6 py-4 text-center">
        <div className="w-16 h-4 bg-gray-200 rounded mx-auto"></div>
      </td>
      <td className="px-6 py-4 text-center">
        <div className="flex items-center justify-center gap-2">
          <div className="w-12 h-6 bg-gray-200 rounded"></div>
          <div className="w-12 h-6 bg-gray-200 rounded"></div>
        </div>
      </td>
    </tr>
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
        <div className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Teacher Directory
              </h2>
              <p className="text-sm text-gray-600">
                Manage teacher profiles and schedules
              </p>
            </div>
            {!isLoading && (
              <div className="text-sm text-gray-500">
                {filteredTeachers.length}{" "}
                {filteredTeachers.length === 1 ? "teacher" : "teachers"} found
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

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full divide-y divide-gray-200">
          <thead className="bg-gray-50/50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                <div className="flex items-center gap-2">
                  <LuUser className="w-4 h-4" />
                  Name
                </div>
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Schedules
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
            ) : error ? (
              <tr>
                <td colSpan={4} className="px-6 py-16 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                      <LuUser className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                      <p className="font-medium text-red-900">
                        Failed to load teachers
                      </p>
                      <p className="text-sm text-red-600 mt-1">{error}</p>
                    </div>
                  </div>
                </td>
              </tr>
            ) : filteredTeachers.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-16 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                      <LuUser className="w-6 h-6 text-gray-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        No teachers found
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        {searchTerm
                          ? "Try adjusting your search criteria"
                          : "No teachers available"}
                      </p>
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedRecords.map((teacher) => (
                <tr
                  key={teacher.id}
                  className="hover:bg-gray-50/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <LuUser className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {teacher.name || teacher.full_name || "Unnamed"}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center text-sm text-gray-900">
                    {teacher.email || "-"}
                  </td>
                  <td className="px-6 py-4 text-center text-sm text-gray-900">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                      {teacher.schedules?.length || 0} schedule(s)
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                        onClick={() => handleEdit(teacher)}
                      >
                        <LuPen className="w-3.5 h-3.5" />
                        Edit
                      </button>
                      <button
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                        onClick={() => handleDelete(teacher.id)}
                      >
                        <LuTrash className="w-3.5 h-3.5" />
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

      {/* Pagination */}
      {!isLoading && !error && filteredTeachers.length > 0 && (
        <div className="border-t border-gray-200 bg-white px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <p className="text-sm text-gray-600">
              Showing {currentPage * recordsPerPage - recordsPerPage + 1} to{" "}
              {Math.min(currentPage * recordsPerPage, filteredTeachers.length)}{" "}
              of {filteredTeachers.length} results
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

export default TeacherTable;
