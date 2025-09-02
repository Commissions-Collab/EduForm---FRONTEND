import { useEffect, useState } from "react";
import { LuDownload } from "react-icons/lu";
import GradesTable from "../../../components/admin/GradesTable";
import { getItem } from "../../../lib/utils";
import { useAdminStore } from "../../../stores/admin";

const Grades = () => {
  const {
    fetchGrades,
    students,
    subjects,
    loading,
    initializeGlobalFilters,
    fetchGlobalFilterOptions,
  } = useAdminStore();

  const [selectedAcademicYear, setSelectedAcademicYear] = useState("");
  const [selectedQuarter, setSelectedQuarter] = useState("");
  const [selectedSection, setSelectedSection] = useState("");

  // Get stats from current data
  const totalStudents = students?.length || 0;
  const completedStudents =
    students?.filter((student) =>
      student.grades?.every(
        (grade) => grade.grade !== null && grade.grade !== undefined
      )
    ).length || 0;
  const pendingStudents = totalStudents - completedStudents;

  useEffect(() => {
    initializeGlobalFilters();
    fetchGlobalFilterOptions();
  }, []);

  useEffect(() => {
    // Get saved filter values from localStorage on component mount
    const savedAcademicYear = getItem("academicYearId", false);
    const savedQuarter = getItem("quarterId", false);
    const savedSection = getItem("sectionId", false);

    if (savedAcademicYear) setSelectedAcademicYear(savedAcademicYear);
    if (savedQuarter) setSelectedQuarter(savedQuarter);
    if (savedSection) setSelectedSection(savedSection);

    // Fetch grades if we have all required filters
    if (savedAcademicYear && savedQuarter && savedSection) {
      fetchGrades(savedAcademicYear, savedQuarter, savedSection);
    }
  }, [fetchGrades]);

  useEffect(() => {
    // Listen for global filter changes
    const handleGlobalFiltersChanged = (event) => {
      const { academicYearId, quarterId, sectionId } = event.detail;

      setSelectedAcademicYear(academicYearId || "");
      setSelectedQuarter(quarterId || "");
      setSelectedSection(sectionId || "");

      // Fetch grades if all filters are set
      if (academicYearId && quarterId && sectionId) {
        fetchGrades(academicYearId, quarterId, sectionId);
      }
    };

    window.addEventListener("globalFiltersChanged", handleGlobalFiltersChanged);

    return () => {
      window.removeEventListener(
        "globalFiltersChanged",
        handleGlobalFiltersChanged
      );
    };
  }, [fetchGrades]);

  const hasAllFilters =
    selectedAcademicYear && selectedQuarter && selectedSection;
  const hasData = students?.length > 0;

  return (
    <div className="bg-gray-50">
      <main className="p-4">
        {/* Header Section */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start space-y-4 sm:space-y-0">
            <div>
              <h1 className="page-title">Grades</h1>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full font-medium">
                  SF9
                </span>
                {!hasAllFilters && (
                  <span className="px-2 py-1 bg-amber-100 text-amber-800 rounded-full font-medium text-xs">
                    Please select filters from header
                  </span>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-3">
              <button
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50"
                disabled={!hasAllFilters || !hasData}
              >
                <LuDownload size={16} className="mr-2" />
                Export Grades
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          {hasAllFilters && (
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-500">
                      Total Students
                    </p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {totalStudents}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-500">
                      Completed
                    </p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {completedStudents}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-amber-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-500">Pending</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {pendingStudents}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* No Filters Message */}
          {!hasAllFilters && (
            <div className="mt-6 bg-white rounded-lg p-8 border border-gray-200 shadow-sm text-center">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-6 h-6 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Select Filters to View Grades
              </h3>
              <p className="text-gray-500">
                Please select Academic Year, Quarter, and Section from the
                filter dropdown in the header to view student grades.
              </p>
            </div>
          )}
        </div>

        {/* Grades Table - Only show if filters are set */}
        {hasAllFilters && (
          <GradesTable
            selectedAcademicYear={selectedAcademicYear}
            selectedQuarter={selectedQuarter}
            selectedSection={selectedSection}
          />
        )}
      </main>
    </div>
  );
};

export default Grades;
