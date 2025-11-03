import React, { useEffect, useState } from "react";
import { Search, Calendar, GraduationCap } from "lucide-react";
import useClassManagementStore from "../../stores/superAdmin/classManagementStore";
import AcademicYearModal from "../../components/superadmin/AcademicYearModal";
import QuarterModal from "../../components/superadmin/QuarterModal";
import YearLevelModal from "../../components/superadmin/YearLevelModal";
import SectionModal from "../../components/superadmin/SectionModal";
import ClassManagementTable from "../../components/superadmin/ClassManagementTable";
import toast from "react-hot-toast";
import SubjectModal from "../../components/superadmin/SubjectModal";

const ClassManagement = () => {
  const {
    academicYears,
    quarters,
    yearLevels,
    sections,
    subjects,
    loading,
    error,
    fetchAcademicYears,
    fetchQuarters,
    fetchYearLevels,
    fetchSections,
    fetchSubjects,
    deleteAcademicYear,
    deleteQuarter,
    deleteYearLevel,
    deleteSection,
    deleteSubject,
    clearError,
  } = useClassManagementStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("academicYears");

  // Modals
  const [isAcademicYearModalOpen, setIsAcademicYearModalOpen] = useState(false);
  const [isQuarterModalOpen, setIsQuarterModalOpen] = useState(false);
  const [isYearLevelModalOpen, setIsYearLevelModalOpen] = useState(false);
  const [isSectionModalOpen, setIsSectionModalOpen] = useState(false);
  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);

  // Selected Items
  const [selectedAcademicYear, setSelectedAcademicYear] = useState(null);
  const [selectedQuarter, setSelectedQuarter] = useState(null);
  const [selectedYearLevel, setSelectedYearLevel] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);

  // Quarter Modal mode ("add" or "edit")
  const [modalMode, setModalMode] = useState("add");

  // Pagination
  const [currentPage, setCurrentPage] = useState({
    academicYears: 1,
    quarters: 1,
    yearLevels: 1,
    sections: 1,
    subjects: 1,
  });

  // Fetch initial data
  useEffect(() => {
    fetchAcademicYears(1);
    fetchQuarters(1);
    fetchYearLevels(1);
    fetchSections(1);
    fetchSubjects(1);
  }, []);

  // Refetch on pagination
  useEffect(() => {
    fetchAcademicYears(currentPage.academicYears);
    fetchQuarters(currentPage.quarters);
    fetchYearLevels(currentPage.yearLevels);
    fetchSections(currentPage.sections);
    fetchSubjects(currentPage.subjects);
  }, [currentPage]);

  // Handle errors
  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [error]);

  const handleDelete = async (type, id) => {
    if (window.confirm(`Are you sure you want to delete this ${type}?`)) {
      try {
        switch (type) {
          case "academic year":
            await deleteAcademicYear(id);
            break;
          case "quarter":
            await deleteQuarter(id);
            break;
          case "year level":
            await deleteYearLevel(id);
            break;
          case "section":
            await deleteSection(id);
            break;
          case "subject":
            await deleteSubject(id);
            break;
          default:
            break;
        }
      } catch {}
    }
  };

  const handlePageChange = (tab, page) => {
    setCurrentPage((prev) => ({ ...prev, [tab]: page }));
  };

  const summary = {
    totalAcademicYears: academicYears.total || 0,
    totalQuarters: quarters.total || 0,
    totalYearLevels: yearLevels.total || 0,
    totalSections: sections.total || 0,
    totalSubjects: subjects.total || 0,
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

          {/* Search Bar */}
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

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          <SummaryCard
            title="Total Academic Years"
            value={summary.totalAcademicYears}
            icon={Calendar}
            color="blue"
          />
          <SummaryCard
            title="Total Quarters"
            value={summary.totalQuarters}
            icon={Calendar}
            color="cyan"
          />
          <SummaryCard
            title="Total Year Levels"
            value={summary.totalYearLevels}
            icon={GraduationCap}
            color="green"
          />
          <SummaryCard
            title="Total Sections"
            value={summary.totalSections}
            icon={GraduationCap}
            color="purple"
          />
          <SummaryCard
            title="Total Subjects"
            value={summary.totalSubjects}
            icon={GraduationCap}
            color="purple"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {[
            "academicYears",
            "quarters",
            "yearLevels",
            "sections",
            "subjects",
          ].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {tab === "academicYears"
                ? "Academic Years"
                : tab === "quarters"
                ? "Quarters"
                : tab === "yearLevels"
                ? "Year Levels"
                : tab === "sections"
                ? "Sections"
                : "Subjects"}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <section className="mb-6 sm:mb-8">
        {/* Academic Years */}
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

        {/* Quarters */}
        {activeTab === "quarters" && (
          <ClassManagementTable
            title="Quarters"
            data={quarters}
            type="quarter"
            searchTerm={searchTerm}
            loading={loading}
            error={error}
            onAdd={() => {
              setSelectedAcademicYear(null);
              setSelectedQuarter(null);
              setModalMode("add");
              setIsQuarterModalOpen(true);
            }}
            onEdit={(item) => {
              // For editing individual quarter dates
              setSelectedQuarter(item);
              setSelectedAcademicYear(item.academicYear || null);
              setModalMode("edit");
              setIsQuarterModalOpen(true);
            }}
            onDelete={handleDelete}
            currentPage={currentPage.quarters}
            onPageChange={(page) => handlePageChange("quarters", page)}
          />
        )}

        {/* Year Levels */}
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

        {/* Sections */}
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

        {activeTab === "subjects" && (
          <ClassManagementTable
            title="Subjects"
            data={subjects}
            type="subject"
            searchTerm={searchTerm}
            loading={loading}
            error={error}
            onAdd={() => {
              setIsSubjectModalOpen(true);
            }}
            onEdit={(item) => {
              setSelectedSubject(item);
              setIsSubjectModalOpen(true);
            }}
            onDelete={handleDelete}
            currentPage={currentPage.subjects}
            onPageChange={(page) => handlePageChange("subjects", page)}
          />
        )}
      </section>

      {/* Modals */}
      <AcademicYearModal
        isOpen={isAcademicYearModalOpen}
        onClose={() => setIsAcademicYearModalOpen(false)}
        selectedAcademicYear={selectedAcademicYear}
      />

      <QuarterModal
        isOpen={isQuarterModalOpen}
        onClose={() => setIsQuarterModalOpen(false)}
        selectedQuarter={selectedQuarter}
        selectedAcademicYear={selectedAcademicYear}
        mode={modalMode}
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

      <SubjectModal
        isOpen={isSubjectModalOpen}
        onClose={() => setIsSubjectModalOpen(false)}
        selectedSubject={selectedSubject}
      />
    </main>
  );
};

const SummaryCard = ({ title, value, icon: Icon, color }) => (
  <div
    className={`bg-gradient-to-r from-${color}-50 to-${color}-100 rounded-lg sm:rounded-xl p-4 sm:p-6 border border-${color}-200 hover:shadow-md transition-all duration-200`}
  >
    <div className="flex items-center justify-between">
      <div>
        <p className={`text-xs sm:text-sm font-medium text-${color}-600 mb-1`}>
          {title}
        </p>
        <p className={`text-xl sm:text-2xl font-bold text-${color}-900`}>
          {value}
        </p>
      </div>
      <div className={`p-2 sm:p-3 bg-${color}-100 rounded-lg`}>
        <Icon className={`w-5 h-5 sm:w-6 sm:h-6 text-${color}-600`} />
      </div>
    </div>
  </div>
);

export default ClassManagement;
