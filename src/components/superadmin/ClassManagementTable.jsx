import React, { useMemo, useEffect } from "react";

import { Calendar, GraduationCap, Eye, Menu, Plus } from "lucide-react";
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
}) => {
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 10;

  // Memoize filtered records
  const filteredRecords = useMemo(() => {
    return data.filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [data, searchTerm]);

  // Reset to page 1 when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const totalRecords = filteredRecords.length;
  const totalPages = Math.ceil(totalRecords / itemsPerPage);

  // Paginated records
  const paginatedRecords = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredRecords.slice(start, end);
  }, [filteredRecords, currentPage]);

  // Skeleton row
  const SkeletonRow = () => (
    <tr className="animate-pulse">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
          <div className="w-24 h-4 bg-gray-200 rounded"></div>
        </div>
      </td>
      {type === "year level" && (
        <>
          <td className="px-6 py-4">
            <div className="w-16 h-4 bg-gray-200 rounded"></div>
          </td>
          <td className="px-6 py-4">
            <div className="w-16 h-4 bg-gray-200 rounded"></div>
          </td>
        </>
      )}
      {type === "section" && (
        <>
          <td className="px-6 py-4">
            <div className="w-24 h-4 bg-gray-200 rounded"></div>
          </td>
          <td className="px-6 py-4">
            <div className="w-24 h-4 bg-gray-200 rounded"></div>
          </td>
          <td className="px-6 py-4">
            <div className="w-16 h-4 bg-gray-200 rounded"></div>
          </td>
          <td className="px-6 py-4">
            <div className="w-16 h-4 bg-gray-200 rounded"></div>
          </td>
        </>
      )}
      <td className="px-6 py-4">
        <div className="flex items-center justify-center gap-2">
          <div className="w-12 h-6 bg-gray-200 rounded"></div>
          <div className="w-8 h-6 bg-gray-200 rounded"></div>
        </div>
      </td>
    </tr>
  );

  // Color for section/year level badges
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
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
        <div className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">{title}</h2>
              <p className="text-sm text-gray-600">
                Manage{" "}
                {type === "academic year"
                  ? "academic years"
                  : type === "year level"
                  ? "year levels"
                  : "class sections"}
              </p>
            </div>
            <div className="flex items-center gap-4">
              {!loading && (
                <div className="text-sm text-gray-500">
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
              <button
                onClick={onAdd}
                className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center space-x-2 transition-all duration-200 shadow-sm hover:shadow"
              >
                <Plus className="w-4 h-4" />
                <span>Add {type.charAt(0).toUpperCase() + type.slice(1)}</span>
              </button>
            </div>
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
                  {type === "academic year" ? (
                    <Calendar className="w-4 h-4" />
                  ) : (
                    <GraduationCap className="w-4 h-4" />
                  )}
                  Name
                </div>
              </th>
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
                <td
                  colSpan={
                    type === "academic year" ? 2 : type === "year level" ? 4 : 7
                  }
                  className="px-6 py-16 text-center"
                >
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                      {type === "academic year" ? (
                        <Calendar className="w-6 h-6 text-red-600" />
                      ) : (
                        <GraduationCap className="w-6 h-6 text-red-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-red-900">
                        Failed to load {type} data
                      </p>
                      <p className="text-sm text-red-600 mt-1">{error}</p>
                    </div>
                  </div>
                </td>
              </tr>
            ) : paginatedRecords.length === 0 ? (
              <tr>
                <td
                  colSpan={
                    type === "academic year" ? 2 : type === "year level" ? 4 : 7
                  }
                  className="px-6 py-16 text-center"
                >
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                      {type === "academic year" ? (
                        <Calendar className="w-6 h-6 text-gray-400" />
                      ) : (
                        <GraduationCap className="w-6 h-6 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        No {type}s found
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        {searchTerm
                          ? "Try adjusting your search criteria"
                          : `No ${type}s available`}
                      </p>
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedRecords.map((item) => (
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
                  {type === "year level" && (
                    <>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {item.code}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {item.sort_order}
                      </td>
                    </>
                  )}
                  {type === "section" && (
                    <>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {item.yearLevel?.name || "Unknown"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {item.academicYear?.name || "Unknown"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {item.strand || "-"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {item.room}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {item.capacity}
                      </td>
                    </>
                  )}
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => onEdit(item)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Edit
                      </button>
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
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {!loading && !error && totalRecords > 0 && (
        <div className="border-t border-gray-200 bg-white px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <p className="text-sm text-gray-600">
              Showing {currentPage * itemsPerPage - itemsPerPage + 1} to{" "}
              {Math.min(currentPage * itemsPerPage, totalRecords)} of{" "}
              {totalRecords} results
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

export default ClassManagementTable;
