// src/pages/admin/health/HealthProfile.jsx
import React, { useEffect, useState } from "react";
import { useAdminStore } from "../../../stores/useAdminStore";
import BmiStudentTable from "../../../components/admin/BMIStudentTable";
import { LuActivity } from "react-icons/lu";
import { getItem } from "../../../lib/utils";

const HealthProfile = () => {
  const { bmiStudents, bmiLoading, bmiError, fetchBmiStudents } =
    useAdminStore();

  const [selectedAcademicYear, setSelectedAcademicYear] = useState("");
  const [selectedQuarter, setSelectedQuarter] = useState("");
  const [selectedSection, setSelectedSection] = useState("");

  useEffect(() => {
    // Load saved filters from localStorage
    const savedAcademicYear = getItem("academicYearId", false);
    const savedQuarter = getItem("quarterId", false);
    const savedSection = getItem("sectionId", false);

    if (savedAcademicYear) setSelectedAcademicYear(savedAcademicYear);
    if (savedQuarter) setSelectedQuarter(savedQuarter);
    if (savedSection) setSelectedSection(savedSection);

    if (savedAcademicYear && savedQuarter && savedSection) {
      fetchBmiStudents(savedAcademicYear, savedQuarter, savedSection);
    }
  }, [fetchBmiStudents]);

  useEffect(() => {
    // Listen to global filter changes
    const handleGlobalFiltersChanged = (event) => {
      const { academicYearId, quarterId, sectionId } = event.detail;

      setSelectedAcademicYear(academicYearId || "");
      setSelectedQuarter(quarterId || "");
      setSelectedSection(sectionId || "");

      if (academicYearId && quarterId && sectionId) {
        fetchBmiStudents(academicYearId);
      }
    };

    window.addEventListener("globalFiltersChanged", handleGlobalFiltersChanged);

    return () => {
      window.removeEventListener(
        "globalFiltersChanged",
        handleGlobalFiltersChanged
      );
    };
  }, [fetchBmiStudents]);

  const hasAllFilters =
    selectedAcademicYear && selectedQuarter && selectedSection;
  const hasData = bmiStudents?.length > 0;

  return (
    <div className="bg-gray-50">
      <main className="p-4">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start space-y-4 sm:space-y-0">
            <div>
              <h1 className="page-title">Health Profile (SF)</h1>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full font-medium">
                  SF8
                </span>
                {!hasAllFilters && (
                  <span className="px-2 py-1 bg-amber-100 text-amber-800 rounded-full font-medium text-xs">
                    Please select filters from header
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* No Filters Message */}
          {!hasAllFilters && (
            <div className="mt-6 bg-white rounded-lg p-8 border border-gray-200 shadow-sm text-center">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <LuActivity className="w-6 h-6 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Select Filters to View Health Profile
              </h3>
              <p className="text-gray-500">
                Please select Academic Year, Quarter, and Section from the
                filter dropdown in the header to view BMI and health records.
              </p>
            </div>
          )}
        </div>

        {/* BMI Table */}
        {hasAllFilters && (
          <BmiStudentTable
            students={bmiStudents}
            loading={bmiLoading}
            error={bmiError}
          />
        )}
      </main>
    </div>
  );
};

export default HealthProfile;
