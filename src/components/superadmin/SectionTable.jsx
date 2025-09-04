import React, { useMemo, useEffect, useState } from "react";
import { LuUsers, LuTrash, LuPen } from "react-icons/lu";
import useFormsManagementStore from "../../stores/superAdmin/formsManagementStore";
import useAcademicManagementStore from "../../stores/superAdmin/academicManagementStore";
import Pagination from "./Pagination";
import AcademicManagementModal from "./AcademicManagementModal";

const SectionTable = ({ searchTerm }) => {
  const { sections, updateSection, deleteSection } =
    useAcademicManagementStore();
  const { updateFormData } = useFormsManagementStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSectionId, setSelectedSectionId] = useState(null);

  const recordsPerPage = 10;

  // Memoize filtered records
  const filteredRecords = useMemo(
    () =>
      sections.data.filter((section) =>
        section.name.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [sections.data, searchTerm]
  );

  // Calculate paginated records
  const paginatedRecords = useMemo(() => {
    const start = (currentPage - 1) * recordsPerPage;
    const end = start + recordsPerPage;
    return filteredRecords.slice(start, end);
  }, [filteredRecords, currentPage]);

  const totalPages = Math.ceil(filteredRecords.length / recordsPerPage);

  // Reset to page 1 when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Handle edit
  const handleEdit = (section) => {
    updateFormData("section", section);
    setSelectedSectionId(section.id);
    setIsModalOpen(true);
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this section?")) {
      await deleteSection(id);
    }
  };

  const SkeletonRow = () => (
    <tr className="animate-pulse">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
          <div className="w-24 h-4 bg-gray-200 rounded"></div>
        </div>
      </td>
      <td className="px-6 py-4 text-center">
        <div className="w-16 h-4 bg-gray-200 rounded mx-auto"></div>
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
              <h2 className="text-xl font-bold text-gray-900 mb-2">Sections</h2>
              <p className="text-sm text-gray-600">Manage class sections</p>
            </div>
            {!sections.isLoading && (
              <div className="text-sm text-gray-500">
                {filteredRecords.length}{" "}
                {filteredRecords.length === 1 ? "section" : "sections"} found
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
                  <LuUsers className="w-4 h-4" />
                  Name
                </div>
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Year Level
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Capacity
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sections.isLoading ? (
              Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
            ) : sections.error ? (
              <tr>
                <td colSpan={4} className="px-6 py-16 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                      <LuUsers className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                      <p className="font-medium text-red-900">
                        Failed to load sections
                      </p>
                      <p className="text-sm text-red-600 mt-1">
                        {sections.error}
                      </p>
                    </div>
                  </div>
                </td>
              </tr>
            ) : paginatedRecords.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-16 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                      <LuUsers className="w-6 h-6 text-gray-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        No sections found
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        {searchTerm
                          ? "Try adjusting your search criteria"
                          : "No sections available"}
                      </p>
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedRecords.map((section) => (
                <tr
                  key={section.id}
                  className="hover:bg-gray-50/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <LuUsers className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {section.name}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center text-sm text-gray-900">
                    {section.year_level_id}
                  </td>
                  <td className="px-6 py-4 text-center text-sm text-gray-900">
                    {section.capacity}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                        onClick={() => handleEdit(section)}
                      >
                        <LuPen className="w-3.5 h-3.5" />
                        Edit
                      </button>
                      <button
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                        onClick={() => handleDelete(section.id)}
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
      {!sections.isLoading && !sections.error && filteredRecords.length > 0 && (
        <div className="border-t border-gray-200 bg-white px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <p className="text-sm text-gray-600">
              Showing {currentPage * recordsPerPage - recordsPerPage + 1} to{" "}
              {Math.min(currentPage * recordsPerPage, filteredRecords.length)}{" "}
              of {filteredRecords.length} results
            </p>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      )}

      {/* Edit Modal */}
      <AcademicManagementModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        formType="section"
        sectionId={selectedSectionId}
      />
    </div>
  );
};

export default SectionTable;
