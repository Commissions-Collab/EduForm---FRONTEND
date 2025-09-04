import React, { useEffect, useState } from "react";
import { LuSearch, LuUsers, LuCalendar, LuUserPlus } from "react-icons/lu";
import useTeacherManagementStore from "../../stores/superAdmin/teacherManagementStore";
import useFormsManagementStore from "../../stores/superAdmin/formsManagementStore";
import TeacherFormModal from "../../components/superadmin/TeacherFormModal";
import TeacherTable from "../../components/superadmin/TeacherTable";

const TeacherManagement = () => {
  const {
    fetchTeachers,
    fetchSchedules,
    teachers,
    schedules,
    isLoading,
    error,
  } = useTeacherManagementStore();
  const { clearForm } = useFormsManagementStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("create");

  // Fetch teachers and schedules on mount
  useEffect(() => {
    console.log("Fetching teachers and schedules..."); // Debug log
    fetchTeachers();
    fetchSchedules(); // Added to fetch schedules
  }, [fetchTeachers, fetchSchedules]);

  // Open modal for creating or editing
  const handleOpenModal = (type) => {
    setModalType(type);
    setIsModalOpen(true);
    if (type === "create") {
      clearForm("teacher");
    }
  };

  // Calculate summary stats
  const totalTeachers = Array.isArray(teachers) ? teachers.length : 0;
  const totalSchedules = Array.isArray(schedules) ? schedules.length : 0;

  console.log("Teachers:", teachers); // Debug log
  console.log("Schedules:", schedules); // Debug log

  return (
    <main className="bg-gray-50/50 p-4 lg:p-6">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div>
            <h1 className="page-title">Teacher Management</h1>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full font-medium">
                Admin
              </span>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            <div className="relative w-full lg:w-80">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LuSearch className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition-all duration-200"
                placeholder="Search teachers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Summary Statistics */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200 hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600 mb-1">
                  Total Teachers
                </p>
                <p className="text-2xl font-bold text-blue-900">
                  {isLoading ? "..." : totalTeachers}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <LuUsers className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-6 border border-green-200 hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600 mb-1">
                  Total Schedules
                </p>
                <p className="text-2xl font-bold text-green-900">
                  {isLoading ? "..." : totalSchedules}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <LuCalendar className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-4 text-sm text-red-600 bg-red-50 p-4 rounded-lg">
            {error}
          </div>
        )}
      </div>

      {/* Create Button */}
      <div className="mb-4">
        <button
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          onClick={() => handleOpenModal("create")}
        >
          <LuUserPlus className="inline-block mr-2 w-5 h-5" />
          Create Teacher
        </button>
      </div>

      {/* Teacher Table */}
      <TeacherTable
        searchTerm={searchTerm}
        onEdit={() => handleOpenModal("edit")}
      />

      {/* Form Modal */}
      <TeacherFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        modalType={modalType}
      />
    </main>
  );
};

export default TeacherManagement;
