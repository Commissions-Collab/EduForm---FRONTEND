import React, { useEffect, useState } from "react";
import { LuSearch, LuCalendar, LuGraduationCap } from "react-icons/lu";
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
  const [isAcademicYearModalOpen, setIsAcademicYearModalOpen] = useState(false);
  const [isYearLevelModalOpen, setIsYearLevelModalOpen] = useState(false);
  const [isSectionModalOpen, setIsSectionModalOpen] = useState(false);
  const [selectedAcademicYear, setSelectedAcademicYear] = useState(null);
  const [selectedYearLevel, setSelectedYearLevel] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);

  useEffect(() => {
    fetchAcademicYears();
    fetchYearLevels();
    fetchSections();
  }, [fetchAcademicYears, fetchYearLevels, fetchSections]);

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

  const summary = {
    totalAcademicYears: academicYears.length,
    totalYearLevels: yearLevels.length,
    totalSections: sections.length,
  };

  return (
    <main className="bg-gray-50/50 p-4 lg:p-6">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Class Management
            </h1>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full font-medium">
                Admin Panel
              </span>
            </div>
          </div>
          <div className="relative w-full lg:w-80">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <LuSearch className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition-all duration-200"
              placeholder="Search academic years, year levels, sections..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Summary Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200 hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600 mb-1">
                  Total Academic Years
                </p>
                <p className="text-2xl font-bold text-blue-900">
                  {loading ? "..." : summary.totalAcademicYears}
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
                  Total Year Levels
                </p>
                <p className="text-2xl font-bold text-green-900">
                  {loading ? "..." : summary.totalYearLevels}
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
                  Total Sections
                </p>
                <p className="text-2xl font-bold text-purple-900">
                  {loading ? "..." : summary.totalSections}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <LuGraduationCap className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Academic Years Section */}
      <section className="mb-8">
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
        />
      </section>

      {/* Year Levels Section */}
      <section className="mb-8">
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
        />
      </section>

      {/* Sections Section */}
      <section className="mb-8">
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
        />
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
        yearLevels={yearLevels}
        academicYears={academicYears}
      />
    </main>
  );
};

export default ClassManagement;
