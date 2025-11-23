import React, { useMemo } from "react";
import { Calendar, GraduationCap, Eye, Menu, Layers, CalendarDays } from "lucide-react";
import Pagination from "./Pagination";

const ClassManagementTable = ({
  title,
  data,
  type,
  searchTerm,
  loading,
  error,
  onAdd,
  onEdit,
  onDelete,
  onManageQuarters,
  onToggleActive,
  currentPage,
  onPageChange,
}) => {
  const filteredRecords = useMemo(() => {
    return (data.data || []).filter((item) => {
      const searchLower = searchTerm.toLowerCase();
      const nameMatch = item.name?.toLowerCase().includes(searchLower);
      const codeMatch = item.code?.toLowerCase().includes(searchLower);
      return nameMatch || codeMatch;
    });
  }, [data, searchTerm]);

  const totalRecords = data.total || 0;
  const totalPages = data.last_page || 1;
  const itemsPerPage = data.per_page || 20;
  const from = data.from || currentPage * itemsPerPage - itemsPerPage + 1;
  const to = data.to || Math.min(currentPage * itemsPerPage, totalRecords);

  const getItemColor = (name) => {
    const colors = [
      "bg-blue-100 text-blue-800 border-blue-200",
      "bg-purple-100 text-purple-800 border-purple-200",
      "bg-green-100 text-green-800 border-green-200",
      "bg-rose-100 text-rose-800 border-rose-200",
      "bg-amber-100 text-amber-800 border-amber-200",
      "bg-teal-100 text-teal-800 border-teal-200",
    ];
    const hash = name?.split("").reduce((a, b) => a + b.charCodeAt(0), 0) || 0;
    return colors[hash % colors.length];
  };

  return (
    <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
        <div className="p-4 sm:p-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
              <div>
                <h2 className="text-base sm:text-xl font-bold text-gray-900 mb-1 sm:mb-2">
                  {title}
                </h2>
                <p className="text-xs sm:text-sm text-gray-600">
                  Manage{" "}
                  {type === "academic year"
                    ? "academic years"
                    : type === "year level"
                    ? "year levels"
                    : type === "subject"
                    ? "subjects"
                    : "class sections"}
                </p>
              </div>
              {!loading && (
                <div className="text-xs sm:text-sm text-gray-500">
                  {totalRecords} {totalRecords === 1 ? type : `${type}s`} found
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

            {/* Add Button */}
            <div className="flex justify-start">
              <button
                onClick={onAdd}
                className="flex items-center justify-center gap-2 px-3 py-2 text-xs sm:text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all shadow-sm hover:shadow"
              >
                <span className="text-lg">+</span>
                <span>Add {type.charAt(0).toUpperCase() + type.slice(1)}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      {!loading && !error && filteredRecords.length > 0 && (
        <div className="hidden lg:block overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    {type === "academic year" ? (
                      <Calendar className="w-4 h-4" />
                    ) : (
                      <GraduationCap className="w-4 h-4" />
                    )}
                    Name
                  </div>
                </th>

                {/* Academic Year Columns */}
                {type === "academic year" && (
                  <>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Start Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      End Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <CalendarDays className="w-4 h-4" />
                        School Days
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Current
                    </th>
                  </>
                )}

                {/* Quarter Columns */}
                {type === "quarters" && (
                  <>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Academic Year
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Start Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      End Date
                    </th>
                  </>
                )}

                {/* Year Level Columns */}
                {type === "year level" && (
                  <>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Code
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Sort Order
                    </th>
                  </>
                )}

                {/* Section Columns */}
                {type === "section" && (
                  <>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Year Level
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Academic Year
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Strand
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Room
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Capacity
                    </th>
                  </>
                )}

                {/* Subject Columns */}
                {type === "subject" && (
                  <>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Code
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Units
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Status
                    </th>
                  </>
                )}

                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRecords.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-gray-50/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        {type === "academic year" ? (
                          <Calendar className="w-5 h-5 text-white" />
                        ) : (
                          <GraduationCap className="w-5 h-5 text-white" />
                        )}
                      </div>
                      <div>
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getItemColor(
                            item.name
                          )}`}
                        >
                          {item.name}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Academic Year Details */}
                  {type === "academic year" && (
                    <>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {new Date(item.start_date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {new Date(item.end_date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <span className="text-sm font-semibold text-indigo-700">
                            {item.school_days_count || 0} days
                          </span>
                          <span className="text-xs text-gray-500">
                            of {item.total_days || 0} total
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            item.is_current
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {item.is_current ? "Active" : "Inactive"}
                        </span>
                      </td>
                    </>
                  )}

                  {/* Quarter Details */}
                  {type === "quarters" && (
                    <>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {item.academic_year?.name || "N/A"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {item.start_date
                          ? new Date(item.start_date).toLocaleDateString()
                          : "N/A"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {item.end_date
                          ? new Date(item.end_date).toLocaleDateString()
                          : "N/A"}
                      </td>
                    </>
                  )}

                  {/* Year Level Details */}
                  {type === "year level" && (
                    <>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <span className="px-2 py-1 bg-gray-100 rounded-md font-mono">
                          {item.code || "N/A"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <span className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded-md font-medium">
                          {item.sort_order || 0}
                        </span>
                      </td>
                    </>
                  )}

                  {/* Section Details */}
                  {type === "section" && (
                    <>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {item.year_level?.name || "N/A"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {item.academic_year?.name || "N/A"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {item.strand || "-"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {item.room || "N/A"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-md font-medium">
                          {item.capacity || 0}
                        </span>
                      </td>
                    </>
                  )}

                  {/* Subject Details */}
                  {type === "subject" && (
                    <>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-md font-mono font-medium">
                          {item.code}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-md font-medium">
                          {item.units} {item.units === 1 ? "unit" : "units"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                        {item.description || "-"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${
                            item.is_active
                              ? "bg-green-100 text-green-800 border-green-200"
                              : "bg-gray-100 text-gray-800 border-gray-200"
                          }`}
                        >
                          {item.is_active ? "Active" : "Inactive"}
                        </span>
                      </td>
                    </>
                  )}

                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      {/* Toggle Active/Inactive - Only for Subjects */}
                      {type === "subject" && onToggleActive && (
                        <button
                          onClick={() => onToggleActive(item.id)}
                          className={`inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                            item.is_active
                              ? "text-orange-600 hover:text-orange-800 hover:bg-orange-50"
                              : "text-green-600 hover:text-green-800 hover:bg-green-50"
                          }`}
                          title={item.is_active ? "Deactivate" : "Activate"}
                        >
                          {item.is_active ? "Deactivate" : "Activate"}
                        </button>
                      )}

                      {/* Edit Button */}
                      <button
                        onClick={() => onEdit(item)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Edit
                      </button>

                      {/* Manage Quarters Button — only for Academic Years */}
                      {type === "academic year" && onManageQuarters && (
                        <button
                          onClick={() => onManageQuarters(item)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-lg transition-colors"
                        >
                          <Layers className="w-3.5 h-3.5" />
                          Manage Quarters
                        </button>
                      )}

                      {/* Delete Button */}
                      <button
                        onClick={() => onDelete(type, item.id)}
                        className="inline-flex items-center gap-1 px-2 py-1.5 text-xs font-medium text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Menu className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="flex items-center justify-center py-12">
          <div className="text-red-600 text-sm">{error}</div>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && filteredRecords.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12">
          <GraduationCap className="w-12 h-12 text-gray-400 mb-3" />
          <p className="text-gray-500 text-sm">No {type}s found</p>
        </div>
      )}

      {/* Pagination */}
      {!loading && !error && totalRecords > 0 && (
        <div className="border-t border-gray-200 bg-white px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <p className="text-xs sm:text-sm text-gray-600">
              Showing {from} to {to} of {totalRecords} results
            </p>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={onPageChange}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassManagementTable;