import React, { useState, useEffect, useMemo } from "react";
import {
  LuCalendar,
  LuPlus,
  LuTrash,
  LuRefreshCw,
  LuBadgeAlert,
  LuStar,
  LuPen,
} from "react-icons/lu";
import useAcademicYearManagementStore from "../../stores/superAdmin/academicYearManagementStore";
import useFormsManagementStore from "../../stores/superAdmin/formsManagementStore";
import Pagination from "../../components/superadmin/Pagination";
import AcademicYearFormModal from "../../components/superadmin/AcademicYearFormModal";

const AcademicYear = () => {
  const {
    academicYears,
    currentAcademicYear,
    isLoading,
    error,
    fetchAcademicYears,
    fetchCurrentAcademicYear,
    createAcademicYear,
    updateAcademicYear,
    deleteAcademicYear,
  } = useAcademicYearManagementStore();
  const { updateFormData, setFormErrors, clearForm } =
    useFormsManagementStore();

  const AcademicYearSkeleton = () => (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-80 bg-gray-200 rounded animate-pulse mt-2" />
            </div>
            <div className="flex items-center space-x-3">
              <div className="h-10 w-32 bg-gray-200 rounded-lg animate-pulse" />
              <div className="h-10 w-24 bg-gray-200 rounded-lg animate-pulse" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="h-5 w-32 bg-gray-200 rounded animate-pulse mb-4" />
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="h-4 w-48 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-64 bg-gray-200 rounded animate-pulse" />
              </div>
              <div className="h-6 w-16 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="h-5 w-32 bg-gray-200 rounded animate-pulse mb-4" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                    <div className="h-4 w-48 bg-gray-200 rounded animate-pulse" />
                  </div>
                  <div className="flex space-x-2">
                    <div className="h-6 w-6 bg-gray-200 rounded animate-pulse" />
                    <div className="h-6 w-6 bg-gray-200 rounded animate-pulse" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingYearId, setEditingYearId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const yearsPerPage = 6;

  useEffect(() => {
    fetchAcademicYears();
    fetchCurrentAcademicYear();
  }, [fetchAcademicYears, fetchCurrentAcademicYear]);

  const paginatedYears = useMemo(() => {
    const start = (currentPage - 1) * yearsPerPage;
    const end = start + yearsPerPage;
    return academicYears.slice(start, end);
  }, [academicYears, currentPage]);

  const totalPages = Math.ceil(academicYears.length / yearsPerPage);

  const handleCreate = () => {
    clearForm("academicYear");
    setEditingYearId(null);
    setIsModalOpen(true);
  };

  const handleEdit = (year) => {
    updateFormData("academicYear", year);
    setEditingYearId(year.id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this academic year?")) {
      const result = await deleteAcademicYear(id);
      if (result.success) {
        const totalPagesAfterDelete = Math.ceil(
          (academicYears.length - 1) / yearsPerPage
        );
        if (currentPage > totalPagesAfterDelete && totalPagesAfterDelete > 0) {
          setCurrentPage(totalPagesAfterDelete);
        }
      }
    }
  };

  const handleSubmit = async (formData) => {
    let result;
    if (editingYearId) {
      result = await updateAcademicYear(editingYearId, formData);
    } else {
      result = await createAcademicYear(formData);
    }
    if (result.success) {
      setIsModalOpen(false);
      setEditingYearId(null);
      clearForm("academicYear");
      fetchCurrentAcademicYear();
    }
  };

  if (isLoading && !academicYears.length) {
    return <AcademicYearSkeleton />;
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <header className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Academic Year Management
              </h1>
              <p className="text-gray-600 text-sm mt-1">
                Manage academic years and set the current year
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleCreate}
                className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center space-x-2"
              >
                <LuPlus className="w-4 h-4" />
                <span>Add Academic Year</span>
              </button>
              <button
                onClick={() => {
                  fetchAcademicYears();
                  fetchCurrentAcademicYear();
                }}
                disabled={isLoading}
                className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <LuRefreshCw
                  className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
                />
                <span>Refresh</span>
              </button>
            </div>
          </div>

          {currentAcademicYear && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <LuStar className="w-5 h-5 text-yellow-500" />
                <span>Current Academic Year</span>
              </h2>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {currentAcademicYear.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    {new Date(
                      currentAcademicYear.start_date
                    ).toLocaleDateString()}{" "}
                    -{" "}
                    {new Date(
                      currentAcademicYear.end_date
                    ).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => handleEdit(currentAcademicYear)}
                  className="px-3 py-1.5 text-xs font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <LuPen className="w-3.5 h-3.5 inline mr-1" />
                  Edit
                </button>
              </div>
            </div>
          )}

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start space-x-3">
              <LuBadgeAlert className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-red-800 mb-1">
                  Error loading academic years
                </p>
                <p className="text-sm text-red-700">{error}</p>
                <button
                  onClick={() => {
                    fetchAcademicYears();
                    fetchCurrentAcademicYear();
                  }}
                  className="text-sm text-red-600 hover:text-red-800 underline mt-2"
                >
                  Try again
                </button>
              </div>
            </div>
          )}
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <section className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <LuCalendar className="w-5 h-5 text-indigo-600" />
                <span>All Academic Years</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {paginatedYears.map((year) => (
                  <div
                    key={year.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {year.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          {new Date(year.start_date).toLocaleDateString()} -{" "}
                          {new Date(year.end_date).toLocaleDateString()}
                        </p>
                        {year.id === currentAcademicYear?.id && (
                          <span className="inline-flex items-center px-2 py-1 mt-2 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                            Current
                          </span>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(year)}
                          className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg"
                        >
                          <LuPen className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(year.id)}
                          className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg"
                        >
                          <LuTrash className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {paginatedYears.length === 0 && (
                  <div className="col-span-full text-center py-8">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                        <LuCalendar className="w-6 h-6 text-gray-400" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          No academic years found
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          Add a new academic year to get started
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              {totalPages > 1 && (
                <div className="mt-6 flex justify-between items-center">
                  <p className="text-sm text-gray-600">
                    Showing {currentPage * yearsPerPage - yearsPerPage + 1} to{" "}
                    {Math.min(currentPage * yearsPerPage, academicYears.length)}{" "}
                    of {academicYears.length} academic years
                  </p>
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </div>
              )}
            </div>
          </section>
        </main>

        <AcademicYearFormModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingYearId(null);
            clearForm("academicYear");
          }}
          yearId={editingYearId}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};

export default AcademicYear;
