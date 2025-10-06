import React, { useMemo } from "react";

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
  currentPage,
  onPageChange,
}) => {
  // Memoize filtered records
  const filteredRecords = useMemo(() => {
    return (data.data || []).filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [data, searchTerm]);

  const totalRecords = data.total || 0;
  const totalPages = data.last_page || 1;
  const itemsPerPage = data.per_page || 20;
  const from = data.from || currentPage * itemsPerPage - itemsPerPage + 1;
  const to = data.to || Math.min(currentPage * itemsPerPage, totalRecords);

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

  // Mobile Card Component
  const ItemCard = ({ item }) => {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
        <div className="flex items-start gap-3 mb-3">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
            {type === "academic year" ? (
              <Calendar className="w-4 h-4 text-white" />
            ) : (
              <GraduationCap className="w-4 h-4 text-white" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-sm font-medium text-gray-900 truncate">
                {item.name}
              </h3>
            </div>
            <div className="space-y-1 text-xs text-gray-600">
              {type === "academic year" && (
                <>
                  <p>
                    <span className="font-medium">Start:</span>{" "}
                    {new Date(item.start_date).toLocaleDateString()}
                  </p>
                  <p>
                    <span className="font-medium">End:</span>{" "}
                    {new Date(item.end_date).toLocaleDateString()}
                  </p>
                  <p>
                    <span className="font-medium">Status:</span>{" "}
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        item.is_current
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {item.is_current ? "Active" : "Inactive"}
                    </span>
                  </p>
                </>
              )}
              {type === "year level" && (
                <>
                  <p>
                    <span className="font-medium">Code:</span> {item.code}
                  </p>
                  <p>
                    <span className="font-medium">Order:</span>{" "}
                    {item.sort_order}
                  </p>
                </>
              )}
              {type === "section" && (
                <>
                  <p>
                    <span className="font-medium">Year Level:</span>{" "}
                    {item.yearLevel?.name || "Unknown"}
                  </p>
                  <p>
                    <span className="font-medium">Academic Year:</span>{" "}
                    {item.academicYear?.name || "Unknown"}
                  </p>
                  <p>
                    <span className="font-medium">Strand:</span>{" "}
                    {item.strand || "-"}
                  </p>
                  <p>
                    <span className="font-medium">Room:</span> {item.room}
                  </p>
                  <p>
                    <span className="font-medium">Capacity:</span>{" "}
                    {item.capacity}
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 pt-3 border-t border-gray-200">
          <button
            onClick={() => onEdit(item)}
            className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            Edit
          </button>
          <button
            onClick={() => onDelete(type, item.id)}
            className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
          >
            <Menu className="w-3.5 h-3.5" />
            Delete
          </button>
        </div>
      </div>
    );
  };

  // Mobile Skeleton Card
  const SkeletonCard = () => (
    <div className="bg-white border border-gray-200 rounded-lg p-4 animate-pulse">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-32"></div>
          <div className="space-y-1">
            <div className="h-3 bg-gray-200 rounded w-48"></div>
            <div className="h-3 bg-gray-200 rounded w-40"></div>
            <div className="h-3 bg-gray-200 rounded w-24"></div>
          </div>
        </div>
      </div>
      <div className="flex gap-2 pt-3 border-t border-gray-200">
        <div className="flex-1 h-6 bg-gray-200 rounded"></div>
        <div className="flex-1 h-6 bg-gray-200 rounded"></div>
      </div>
    </div>
  );

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

            {/* Action Button */}
            <div className="flex justify-start">
              <button
                onClick={onAdd}
                className="flex items-center justify-center gap-2 px-3 py-2 text-xs sm:text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all shadow-sm hover:shadow"
              >
                <Plus className="w-4 h-4" />
                <span>Add {type.charAt(0).toUpperCase() + type.slice(1)}</span>
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
          <div className="w-12 h-12 mx-auto mb-2">
            {type === "academic year" ? (
              <Calendar className="w-12 h-12 text-red-600" />
            ) : (
              <GraduationCap className="w-12 h-12 text-red-600" />
            )}
          </div>
          <p className="font-medium text-red-900 text-sm">
            Failed to load {type} data
          </p>
          <p className="text-xs text-red-600 mt-1">{error}</p>
        </div>
      ) : filteredRecords.length === 0 ? (
        <div className="px-4 py-12 text-center">
          <div className="w-12 h-12 mx-auto mb-2">
            {type === "academic year" ? (
              <Calendar className="w-12 h-12 text-gray-400" />
            ) : (
              <GraduationCap className="w-12 h-12 text-gray-400" />
            )}
          </div>
          <p className="font-medium text-gray-900 text-sm">No {type}s found</p>
          <p className="text-xs text-gray-500 mt-1">
            {searchTerm
              ? "Try adjusting your search criteria"
              : `No ${type}s available`}
          </p>
        </div>
      ) : (
        <>
          {/* Mobile Card View */}
          <div className="block lg:hidden p-4 space-y-4">
            {filteredRecords.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>

          {/* Desktop Table View */}
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
                  {type === "academic year" && (
                    <>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Start Date
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        End Date
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Current
                      </th>
                    </>
                  )}
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
                    {type === "academic year" && (
                      <>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {new Date(item.start_date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {new Date(item.end_date).toLocaleDateString()}
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
                ))}
              </tbody>
            </table>
          </div>
        </>
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
