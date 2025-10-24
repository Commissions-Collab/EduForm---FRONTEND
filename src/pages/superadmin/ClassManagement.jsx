import React, { useEffect, useState } from "react";
import { Search, Calendar, GraduationCap } from "lucide-react";
import useClassManagementStore from "../../stores/superAdmin/classManagementStore";
import AcademicYearModal from "../../components/superadmin/AcademicYearModal";
import YearLevelModal from "../../components/superadmin/YearLevelModal";
import SectionModal from "../../components/superadmin/SectionModal";
import ClassManagementTable from "../../components/superadmin/ClassManagementTable";
import toast from "react-hot-toast";

const ClassManagement = () => {
  const {
    academicYears,
    yearLevels,
    sections,
    loading,
    error,
    fetchAcademicYears,
    fetchYearLevels,
    fetchSections,
    deleteAcademicYear,
    deleteYearLevel,
    deleteSection,
    clearError,
  } = useClassManagementStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("academicYears");
  const [isAcademicYearModalOpen, setIsAcademicYearModalOpen] = useState(false);
  const [isYearLevelModalOpen, setIsYearLevelModalOpen] = useState(false);
  const [isSectionModalOpen, setIsSectionModalOpen] = useState(false);
  const [selectedAcademicYear, setSelectedAcademicYear] = useState(null);
  const [selectedYearLevel, setSelectedYearLevel] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);
  const [currentPage, setCurrentPage] = useState({
    academicYears: 1,
    yearLevels: 1,
    sections: 1,
  });

  // Initial load effect - fetch data on component mount
  useEffect(() => {
    fetchAcademicYears(1);
    fetchYearLevels(1);
    fetchSections(1);
  }, []); // Empty dependency array - runs once on mount

  // Page change effect - refetch when currentPage changes
  useEffect(() => {
    fetchAcademicYears(currentPage.academicYears);
    fetchYearLevels(currentPage.yearLevels);
    fetchSections(currentPage.sections);
  }, [currentPage, fetchAcademicYears, fetchYearLevels, fetchSections]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [error, clearError]);

  const handleDelete = async (type, id) => {
    if (window.confirm(`Are you sure you want to delete this ${type}?`)) {
      try {
        switch (type) {
          case "academic year":
            await deleteAcademicYear(id);
            break;
          case "year level":
            await deleteYearLevel(id);
            break;
          case "section":
            await deleteSection(id);
            break;
          default:
            break;
        }
      } catch (err) {
        // Error handled by store
      }
    }
  };

  const handlePageChange = (tab, page) => {
    setCurrentPage((prev) => ({ ...prev, [tab]: page }));
  };

  const summary = {
    totalAcademicYears: academicYears.total || 0,
    totalYearLevels: yearLevels.total || 0,
    totalSections: sections.total || 0,
  };

  return (
    <main className="bg-gray-50/50 p-3 sm:p-4 lg:p-6 max-w-[1920px] mx-auto">
      {/* Header Section */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              Class Management
            </h1>
            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 mt-1">
              <span className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full font-medium">
                Admin Panel
              </span>
            </div>
          </div>
          <div className="relative w-full lg:w-80">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-3 bg-white border border-gray-200 rounded-lg sm:rounded-xl text-sm sm:text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition-all duration-200"
              placeholder="Search academic years, year levels, sections..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Summary Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg sm:rounded-xl p-4 sm:p-6 border border-blue-200 hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-blue-600 mb-1">
                  Total Academic Years
                </p>
                <p className="text-xl sm:text-2xl font-bold text-blue-900">
                  {loading ? "..." : summary.totalAcademicYears}
                </p>
              </div>
              <div className="p-2 sm:p-3 bg-blue-100 rounded-lg">
                <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg sm:rounded-xl p-4 sm:p-6 border border-green-200 hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-green-600 mb-1">
                  Total Year Levels
                </p>
                <p className="text-xl sm:text-2xl font-bold text-green-900">
                  {loading ? "..." : summary.totalYearLevels}
                </p>
              </div>
              <div className="p-2 sm:p-3 bg-green-100 rounded-lg">
                <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg sm:rounded-xl p-4 sm:p-6 border border-purple-200 hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-purple-600 mb-1">
                  Total Sections
                </p>
                <p className="text-xl sm:text-2xl font-bold text-purple-900">
                  {loading ? "..." : summary.totalSections}
                </p>
              </div>
              <div className="p-2 sm:p-3 bg-purple-100 rounded-lg">
                <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            <button
              onClick={() => setActiveTab("academicYears")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "academicYears"
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Academic Years
            </button>
            <button
              onClick={() => setActiveTab("yearLevels")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "yearLevels"
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Year Levels
            </button>
            <button
              onClick={() => setActiveTab("sections")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "sections"
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Sections
            </button>
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <section className="mb-6 sm:mb-8">
        {activeTab === "academicYears" && (
          <ClassManagementTable
            title="Academic Years"
            data={academicYears}
            type="academic year"
            searchTerm={searchTerm}
            loading={loading}
            error={error}
            onAdd={() => {
              setSelectedAcademicYear(null);
              setIsAcademicYearModalOpen(true);
            }}
            onEdit={(item) => {
              setSelectedAcademicYear(item);
              setIsAcademicYearModalOpen(true);
            }}
            onDelete={handleDelete}
            currentPage={currentPage.academicYears}
            onPageChange={(page) => handlePageChange("academicYears", page)}
          />
        )}
        {activeTab === "yearLevels" && (
          <ClassManagementTable
            title="Year Levels"
            data={yearLevels}
            type="year level"
            searchTerm={searchTerm}
            loading={loading}
            error={error}
            onAdd={() => {
              setSelectedYearLevel(null);
              setIsYearLevelModalOpen(true);
            }}
            onEdit={(item) => {
              setSelectedYearLevel(item);
              setIsYearLevelModalOpen(true);
            }}
            onDelete={handleDelete}
            currentPage={currentPage.yearLevels}
            onPageChange={(page) => handlePageChange("yearLevels", page)}
          />
        )}
        {activeTab === "sections" && (
          <ClassManagementTable
            title="Sections"
            data={sections}
            type="section"
            searchTerm={searchTerm}
            loading={loading}
            error={error}
            onAdd={() => {
              setSelectedSection(null);
              setIsSectionModalOpen(true);
            }}
            onEdit={(item) => {
              setSelectedSection(item);
              setIsSectionModalOpen(true);
            }}
            onDelete={handleDelete}
            currentPage={currentPage.sections}
            onPageChange={(page) => handlePageChange("sections", page)}
          />
        )}
      </section>

      {/* Modals */}
      <AcademicYearModal
        isOpen={isAcademicYearModalOpen}
        onClose={() => setIsAcademicYearModalOpen(false)}
        selectedAcademicYear={selectedAcademicYear}
      />
      <YearLevelModal
        isOpen={isYearLevelModalOpen}
        onClose={() => setIsYearLevelModalOpen(false)}
        selectedYearLevel={selectedYearLevel}
      />
      <SectionModal
        isOpen={isSectionModalOpen}
        onClose={() => setIsSectionModalOpen(false)}
        selectedSection={selectedSection}
        yearLevels={yearLevels.data || []}
        academicYears={academicYears.data || []}
      />
    </main>
  );
};

export default ClassManagement;
