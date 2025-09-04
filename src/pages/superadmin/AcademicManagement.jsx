import React, { useEffect, useState } from "react";
import { LuUsers, LuGraduationCap, LuBookOpen, LuSearch } from "react-icons/lu";
import StudentTable from "../../components/superadmin/StudentTable";
import EnrollmentTable from "../../components/superadmin/EnrollmentTable";
import YearLevelTable from "../../components/superadmin/YearLevelTable";
import SectionTable from "../../components/superadmin/SectionTable";
import AcademicManagementModal from "../../components/superadmin/AcademicManagementModal";
import useAcademicManagementStore from "../../stores/superAdmin/academicManagementStore";
import useFormsManagementStore from "../../stores/superAdmin/formsManagementStore";

const AcademicManagement = () => {
  const {
    students,
    enrollments,
    yearLevels,
    sections,
    fetchStudents,
    fetchEnrollments,
    createYearLevel,
    createSection,
  } = useAcademicManagementStore();
  const { formData, clearForm } = useFormsManagementStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("students");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);

  // Fetch data when component mounts
  useEffect(() => {
    fetchStudents();
    fetchEnrollments();
    // Note: Fetch year levels and sections if endpoints are added
  }, [fetchStudents, fetchEnrollments]);

  // Open modal for creating a new record
  const handleCreate = (type) => {
    clearForm(type);
    setModalType(type);
    setIsModalOpen(true);
  };

  // Render tab content based on active tab
  const renderTable = () => {
    switch (activeTab) {
      case "students":
        return <StudentTable searchTerm={searchTerm} />;
      case "enrollments":
        return <EnrollmentTable searchTerm={searchTerm} />;
      case "yearLevels":
        return <YearLevelTable searchTerm={searchTerm} />;
      case "sections":
        return <SectionTable searchTerm={searchTerm} />;
      default:
        return null;
    }
  };

  return (
    <main className="bg-gray-50/50 p-4 lg:p-6">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div>
            <h1 className="page-title">Academic Management</h1>
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
              placeholder={`Search ${activeTab}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          {["students", "enrollments", "yearLevels", "sections"].map((tab) => (
            <button
              key={tab}
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === tab
                  ? "border-b-2 border-indigo-500 text-indigo-600"
                  : "text-gray-600 hover:text-indigo-600"
              }`}
              onClick={() => {
                setActiveTab(tab);
                setSearchTerm("");
              }}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Summary Statistics */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200 hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600 mb-1">
                  Total Students
                </p>
                <p className="text-2xl font-bold text-blue-900">
                  {students.isLoading ? "..." : students.data.length}
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
                  Total Enrollments
                </p>
                <p className="text-2xl font-bold text-green-900">
                  {enrollments.isLoading ? "..." : enrollments.data.length}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <LuGraduationCap className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200 hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600 mb-1">
                  Year Levels
                </p>
                <p className="text-2xl font-bold text-purple-900">
                  {yearLevels.isLoading ? "..." : yearLevels.data.length}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <LuBookOpen className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-amber-50 to-amber-100 rounded-xl p-6 border border-amber-200 hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-amber-600 mb-1">
                  Sections
                </p>
                <p className="text-2xl font-bold text-amber-900">
                  {sections.isLoading ? "..." : sections.data.length}
                </p>
              </div>
              <div className="p-3 bg-amber-100 rounded-lg">
                <LuUsers className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create Button */}
      <div className="mb-4">
        <button
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          onClick={() => handleCreate(activeTab)}
        >
          Create {activeTab.charAt(0).toUpperCase() + activeTab.slice(1, -1)}
        </button>
      </div>

      {/* Table Content */}
      {renderTable()}

      {/* Form Modal */}
      <AcademicManagementModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        formType={modalType}
      />
    </main>
  );
};

export default AcademicManagement;
