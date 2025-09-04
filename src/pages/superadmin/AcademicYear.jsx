import React, { useEffect, useState } from "react";
import { LuCalendar, LuSearch } from "react-icons/lu";
import useAcademicYearManagementStore from "../../stores/superAdmin/academicYearManagementStore";
import AcademicYearFormModal from "../../components/superadmin/AcademicYearFormModal";
import AcademicYearTable from "../../components/superadmin/AcademicYearTable";

const AcademicYear = () => {
  const {
    academicYears,
    currentAcademicYear,
    fetchAcademicYears,
    fetchCurrentAcademicYear,
    isLoading,
  } = useAcademicYearManagementStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("create");

  // Fetch data when component mounts
  useEffect(() => {
    fetchAcademicYears();
    fetchCurrentAcademicYear();
  }, [fetchAcademicYears, fetchCurrentAcademicYear]);

  // Open modal for creating or editing
  const handleOpenModal = (type) => {
    setModalType(type);
    setIsModalOpen(true);
  };

  return (
    <main className="bg-gray-50/50 p-4 lg:p-6">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div>
            <h1 className="page-title">Academic Year Management</h1>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full font-medium">
                SF1
              </span>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative w-full lg:w-80">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <LuSearch className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition-all duration-200"
              placeholder="Search academic years..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Summary Statistics */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200 hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600 mb-1">
                  Total Academic Years
                </p>
                <p className="text-2xl font-bold text-blue-900">
                  {isLoading ? "..." : academicYears.length}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <LuCalendar className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-6 border border-green-200 hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600 mb-1">
                  Current Academic Year
                </p>
                <p className="text-2xl font-bold text-green-900">
                  {isLoading ? "..." : currentAcademicYear?.name || "None"}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <LuCalendar className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create Button */}
      <div className="mb-4">
        <button
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          onClick={() => handleOpenModal("create")}
        >
          Create Academic Year
        </button>
      </div>

      {/* Academic Year Table */}
      <AcademicYearTable
        searchTerm={searchTerm}
        onEdit={() => handleOpenModal("edit")}
      />

      {/* Form Modal */}
      <AcademicYearFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        modalType={modalType}
      />
    </main>
  );
};

export default AcademicYear;
