import React, { useMemo, useState, useEffect } from "react";
import { LuFileInput, LuPen, LuTrash } from "react-icons/lu";
import useFormsManagementStore from "../../stores/superAdmin/formsManagementStore";
import Pagination from "./Pagination";

const FormsTable = ({ searchTerm, onEdit }) => {
  const { formData, formErrors, clearForm } = useFormsManagementStore();
  const [currentPage, setCurrentPage] = useState(1);

  const recordsPerPage = 10;

  // Prepare form types data
  const formTypes = useMemo(
    () =>
      Object.keys(formData).map((type) => ({
        type,
        data: formData[type],
        error: formErrors[type] || null,
      })),
    [formData, formErrors]
  );

  // Memoize filtered form types
  const filteredFormTypes = useMemo(
    () =>
      formTypes.filter((form) =>
        form.type.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [formTypes, searchTerm]
  );

  // Calculate paginated records
  const paginatedRecords = useMemo(() => {
    const start = (currentPage - 1) * recordsPerPage;
    const end = start + recordsPerPage;
    return filteredFormTypes.slice(start, end);
  }, [filteredFormTypes, currentPage]);

  const totalPages = Math.ceil(filteredFormTypes.length / recordsPerPage);

  // Reset to page 1 when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Handle edit
  const handleEdit = (formType) => {
    onEdit(formType);
  };

  // Handle clear
  const handleClear = (formType) => {
    if (
      window.confirm(`Are you sure you want to clear the ${formType} form?`)
    ) {
      clearForm(formType);
    }
  };

  // Skeleton row for loading state (no loading state since no API calls)
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
                Forms Directory
              </h2>
              <p className="text-sm text-gray-600">
                Manage form data and errors
              </p>
            </div>
            <div className="text-sm text-gray-500">
              {filteredFormTypes.length}{" "}
              {filteredFormTypes.length === 1 ? "form type" : "form types"}{" "}
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
                  <LuFileInput className="w-4 h-4" />
                  Form Type
                </div>
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Data Preview
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Error Status
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredFormTypes.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-16 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                      <LuFileInput className="w-6 h-6 text-gray-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        No form types found
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        {searchTerm
                          ? "Try adjusting your search criteria"
                          : "No form data available"}
                      </p>
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedRecords.map((form) => (
                <tr
                  key={form.type}
                  className="hover:bg-gray-50/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <LuFileInput className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {form.type.charAt(0).toUpperCase() +
                            form.type.slice(1)}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center text-sm text-gray-900">
                    <p
                      className="truncate max-w-xs"
                      title={JSON.stringify(form.data)}
                    >
                      {Object.keys(form.data).length > 0
                        ? JSON.stringify(form.data).slice(0, 50) + "..."
                        : "No data"}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        form.error
                          ? "bg-red-100 text-red-800 border border-red-200"
                          : "bg-green-100 text-green-800 border border-green-200"
                      }`}
                    >
                      {form.error ? form.error : "No errors"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                        onClick={() => handleEdit(form.type)}
                      >
                        <LuPen className="w-3.5 h-3.5" />
                        Edit
                      </button>
                      <button
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                        onClick={() => handleClear(form.type)}
                      >
                        <LuTrash className="w-3.5 h-3.5" />
                        Clear
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
      {filteredFormTypes.length > 0 && (
        <div className="border-t border-gray-200 bg-white px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <p className="text-sm text-gray-600">
              Showing {currentPage * recordsPerPage - recordsPerPage + 1} to{" "}
              {Math.min(currentPage * recordsPerPage, filteredFormTypes.length)}{" "}
              of {filteredFormTypes.length} results
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

export default FormsTable;
