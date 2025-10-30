import React, { useEffect, useState } from "react";
import { Settings2, Loader, BookOpen, Calendar } from "lucide-react";
import useSF5SF6FormStore from "../../stores/superAdmin/sf5sf6FormStore";
import useSF5SF6FilterStore from "../../stores/superAdmin/sf5sf6FilterStore";

const SF5SF6FilterSection = () => {
  const { filterOptions, filterLoading } = useSF5SF6FormStore();
  const { globalFilters, setGlobalFilters, clearGlobalFilters } =
    useSF5SF6FilterStore();

  const [localFilters, setLocalFilters] = useState(globalFilters);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    setLocalFilters(globalFilters);
  }, [globalFilters]);

  // Debug: Log filter options
  useEffect(() => {
    console.log("Filter Options:", filterOptions);
    console.log("Local Filters:", localFilters);
  }, [filterOptions, localFilters]);

  const handleAcademicYearChange = (value) => {
    const yearId = value ? parseInt(value, 10) : null;
    console.log("Selected Academic Year:", yearId);

    setLocalFilters((prev) => ({
      ...prev,
      academicYearId: yearId,
      sectionId: null, // Reset section when year changes
    }));
  };

  const handleSectionChange = (value) => {
    const sectionId = value ? parseInt(value, 10) : null;
    console.log("Selected Section:", sectionId);

    setLocalFilters((prev) => ({
      ...prev,
      sectionId: sectionId,
    }));
  };

  const handleFormTypeChange = (value) => {
    setLocalFilters((prev) => ({
      ...prev,
      formType: value || "sf5",
    }));
  };

  const applyFilters = () => {
    console.log("Applying filters:", localFilters);
    setGlobalFilters(localFilters);
    setIsExpanded(false);
  };

  // Get sections for the selected academic year
  const getSectionsByYear = () => {
    if (!localFilters.academicYearId) {
      console.log("No academic year selected");
      return [];
    }

    console.log("Looking for sections for year:", localFilters.academicYearId);
    console.log("Available years:", filterOptions.sections_by_year);

    const yearData = filterOptions.sections_by_year?.find(
      (y) => y.academic_year_id === localFilters.academicYearId
    );

    console.log("Found year data:", yearData);

    if (!yearData || !yearData.year_levels) {
      return [];
    }

    const sections = [];
    yearData.year_levels.forEach((level) => {
      if (level.sections && Array.isArray(level.sections)) {
        // Include all sections, even if not accessible (for super admin)
        sections.push(...level.sections);
      }
    });

    console.log("Available sections:", sections);
    return sections;
  };

  const currentSections = getSectionsByYear();
  const hasCompleteFilters =
    localFilters.academicYearId &&
    localFilters.sectionId &&
    localFilters.formType;

  // Get selected academic year name
  const selectedAcademicYear = filterOptions.academic_years?.find(
    (y) => y.id === localFilters.academicYearId
  );

  // Get selected section name
  const selectedSection = currentSections.find(
    (s) => s.id === localFilters.sectionId
  );

  return (
    <div className="mb-8">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Settings2 className="w-5 h-5 text-gray-700" />
            <h2 className="text-lg font-semibold text-gray-900">
              Form Filters
            </h2>
          </div>
          {hasCompleteFilters && (
            <button
              onClick={clearGlobalFilters}
              className="text-sm text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-1 rounded transition-colors"
            >
              Clear All
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Academic Year */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Academic Year <span className="text-red-500">*</span>
            </label>
            <select
              value={localFilters.academicYearId || ""}
              onChange={(e) => handleAcademicYearChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 disabled:bg-gray-50 cursor-pointer"
              disabled={filterLoading}
            >
              <option value="">-- Select Academic Year --</option>
              {filterOptions.academic_years?.map((y) => (
                <option key={y.id} value={y.id}>
                  {y.name} {y.is_current ? "(Current)" : ""}
                </option>
              ))}
            </select>
            {filterOptions.academic_years?.length === 0 && (
              <p className="text-xs text-red-600 mt-1">
                No academic years available
              </p>
            )}
          </div>

          {/* Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Section <span className="text-red-500">*</span>
            </label>
            <select
              value={localFilters.sectionId || ""}
              onChange={(e) => handleSectionChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 disabled:bg-gray-50 cursor-pointer"
              disabled={
                filterLoading ||
                !localFilters.academicYearId ||
                currentSections.length === 0
              }
            >
              <option value="">-- Select Section --</option>
              {currentSections.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.student_count || 0} students)
                </option>
              ))}
            </select>
            {localFilters.academicYearId && currentSections.length === 0 && (
              <p className="text-xs text-orange-600 mt-1">
                No sections available for this academic year
              </p>
            )}
            {!localFilters.academicYearId && (
              <p className="text-xs text-gray-500 mt-1">
                Select an academic year first
              </p>
            )}
          </div>

          {/* Form Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Form Type <span className="text-red-500">*</span>
            </label>
            <select
              value={localFilters.formType || "sf5"}
              onChange={(e) => handleFormTypeChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 cursor-pointer"
            >
              <option value="sf5">SF5 - Class Register</option>
              <option value="sf6">SF6 - Learner Progress Report</option>
            </select>
          </div>

          {/* Apply Button */}
          <div className="flex items-end">
            <button
              onClick={applyFilters}
              className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              disabled={
                filterLoading ||
                !localFilters.academicYearId ||
                !localFilters.sectionId
              }
            >
              {filterLoading && <Loader className="w-4 h-4 animate-spin" />}
              Apply Filters
            </button>
          </div>
        </div>

        {/* Active Filters Display */}
        {hasCompleteFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex flex-wrap gap-2">
              {selectedAcademicYear && (
                <span className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm border border-blue-200">
                  <Calendar className="w-4 h-4" />
                  {selectedAcademicYear.name}
                </span>
              )}
              {selectedSection && (
                <span className="inline-flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm border border-green-200">
                  <BookOpen className="w-4 h-4" />
                  {selectedSection.name}
                </span>
              )}
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm border border-purple-200">
                📋 {localFilters.formType.toUpperCase()}
              </span>
            </div>
          </div>
        )}

        {/* Helper Text */}
        {!hasCompleteFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600 flex items-center gap-2">
              ℹ️ Select all fields and click "Apply Filters" to view the form
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SF5SF6FilterSection;
