import React, { useEffect, useState, useRef } from "react";
import { useAdminStore } from "../../stores/useAdminStore";
import { LuChevronDown, LuSettings, LuCheck, LuX } from "react-icons/lu";

const GlobalFilterDropdown = ({ userRole }) => {
  const {
    globalFilters,
    filterOptions,
    loading,
    initializeGlobalFilters,
    fetchGlobalFilterOptions,
    setGlobalFilters,
    clearGlobalFilters,
  } = useAdminStore();

  const [isExpanded, setIsExpanded] = useState(false);
  const dropdownRef = useRef();

  // Only show for admin/teacher roles
  const normalizedRole = (userRole || "").toLowerCase();
  if (!["admin", "teacher"].includes(normalizedRole)) {
    return null;
  }

  useEffect(() => {
    // Initialize filters from localStorage on mount
    initializeGlobalFilters();
    // Fetch filter options
    fetchGlobalFilterOptions();
  }, [initializeGlobalFilters, fetchGlobalFilterOptions]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsExpanded(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAcademicYearChange = (value) => {
    setGlobalFilters({
      academicYearId: value || null,
      // Reset dependent filters when academic year changes
      quarterId: null,
      sectionId: null,
    });
  };

  const handleQuarterChange = (value) => {
    setGlobalFilters({
      quarterId: value ? parseInt(value) : null,
    });
  };

  const handleSectionChange = (value) => {
    setGlobalFilters({
      sectionId: value ? parseInt(value) : null,
    });
  };

  const hasFiltersSelected =
    globalFilters.academicYearId ||
    globalFilters.quarterId ||
    globalFilters.sectionId;

  const hasCompleteFilters =
    globalFilters.academicYearId &&
    globalFilters.quarterId &&
    globalFilters.sectionId;

  // Get current selections for display
  const getCurrentSelections = () => {
    const selections = {};

    if (globalFilters.academicYearId) {
      const year = filterOptions.academicYears?.find(
        (y) => y.id == globalFilters.academicYearId
      );
      selections.academicYear = year
        ? `${year.year_start}-${year.year_end}`
        : null;
    }

    if (globalFilters.quarterId) {
      const quarter = filterOptions.quarters?.find(
        (q) => q.id === globalFilters.quarterId
      );
      selections.quarter = quarter ? quarter.name : null;
    }

    if (globalFilters.sectionId) {
      const section = filterOptions.sections?.find(
        (s) => s.id === globalFilters.sectionId
      );
      selections.section = section ? section.name : null;
    }

    return selections;
  };

  const selections = getCurrentSelections();
  const filterCount = Object.values(selections).filter(Boolean).length;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#3730A3] focus:ring-offset-1 ${
          hasCompleteFilters
            ? "border-[#3730A3] bg-[#3730A3] text-white hover:bg-[#312e81] shadow-md"
            : hasFiltersSelected
            ? "border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-100"
            : "border-[#C7D2FE] bg-[#F8FAFC] text-[#3730A3] hover:bg-[#E0E7FF]"
        }`}
      >
        <LuSettings className="w-4 h-4" />
        <span className="text-sm font-medium">
          {hasCompleteFilters
            ? "Filters Applied"
            : hasFiltersSelected
            ? `${filterCount} Filter${filterCount > 1 ? "s" : ""}`
            : "Set Filters"}
        </span>

        {filterCount > 0 && (
          <span
            className={`px-2 py-0.5 text-xs rounded-full font-bold ${
              hasCompleteFilters
                ? "bg-white text-[#3730A3]"
                : "bg-amber-200 text-amber-800"
            }`}
          >
            {filterCount}
          </span>
        )}

        <LuChevronDown
          className={`w-4 h-4 transform transition-transform duration-200 ${
            isExpanded ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown Panel */}
      {isExpanded && (
        <div className="absolute left-0 mt-2 w-96 bg-white border border-gray-200 rounded-lg shadow-xl z-50 overflow-hidden">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-[#3730A3] to-[#4F46E5] text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Global Filters</h3>
                <p className="text-sm opacity-90">
                  Apply filters across all sections
                </p>
              </div>
              <button
                onClick={() => setIsExpanded(false)}
                className="p-1 hover:bg-white/10 rounded-lg transition-colors"
              >
                <LuX className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 space-y-4">
            {/* Academic Year Filter */}
            <div className="space-y-2">
              <label className="flex items-center justify-between text-sm font-medium text-gray-700">
                Academic Year
                {selections.academicYear && (
                  <LuCheck className="w-4 h-4 text-green-600" />
                )}
              </label>
              <select
                value={globalFilters.academicYearId || ""}
                onChange={(e) => handleAcademicYearChange(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3730A3] focus:border-[#3730A3] transition-all duration-200 text-gray-700 disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
                disabled={loading}
              >
                <option value="">Choose Academic Year</option>
                {filterOptions.academicYears?.map((year) => (
                  <option key={year.id} value={year.id}>
                    {year.year_start} - {year.year_end}
                  </option>
                ))}
              </select>
              {selections.academicYear && (
                <p className="text-xs text-green-600 font-medium">
                  Selected: {selections.academicYear}
                </p>
              )}
            </div>

            {/* Quarter Filter */}
            <div className="space-y-2">
              <label className="flex items-center justify-between text-sm font-medium text-gray-700">
                Quarter
                {selections.quarter && (
                  <LuCheck className="w-4 h-4 text-green-600" />
                )}
              </label>
              <select
                value={globalFilters.quarterId || ""}
                onChange={(e) => handleQuarterChange(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3730A3] focus:border-[#3730A3] transition-all duration-200 text-gray-700 disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
                disabled={loading}
              >
                <option value="">Choose Quarter</option>
                {filterOptions.quarters?.map((quarter) => (
                  <option key={quarter.id} value={quarter.id}>
                    {quarter.name}
                  </option>
                ))}
              </select>
              {selections.quarter && (
                <p className="text-xs text-green-600 font-medium">
                  Selected: {selections.quarter}
                </p>
              )}
            </div>

            {/* Section Filter */}
            <div className="space-y-2">
              <label className="flex items-center justify-between text-sm font-medium text-gray-700">
                Section
                {selections.section && (
                  <LuCheck className="w-4 h-4 text-green-600" />
                )}
              </label>
              <select
                value={globalFilters.sectionId || ""}
                onChange={(e) => handleSectionChange(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3730A3] focus:border-[#3730A3] transition-all duration-200 text-gray-700 disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
                disabled={loading}
              >
                <option value="">Choose Section</option>
                {filterOptions.sections?.map((section) => (
                  <option key={section.id} value={section.id}>
                    {section.name}
                  </option>
                ))}
              </select>
              {selections.section && (
                <p className="text-xs text-green-600 font-medium">
                  Selected: {selections.section}
                </p>
              )}
              {filterOptions.sections?.length === 0 && !loading && (
                <p className="text-xs text-amber-600">
                  No sections available. Please select an academic year first.
                </p>
              )}
            </div>

            {/* Filter Status */}
            <div className="pt-3 border-t">
              {hasCompleteFilters ? (
                <div className="flex items-center space-x-2 text-green-700 bg-green-50 p-3 rounded-lg">
                  <LuCheck className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    All filters applied
                  </span>
                </div>
              ) : hasFiltersSelected ? (
                <div className="flex items-center space-x-2 text-amber-700 bg-amber-50 p-3 rounded-lg">
                  <LuSettings className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {3 - filterCount} more filter
                    {3 - filterCount > 1 ? "s" : ""} needed
                  </span>
                </div>
              ) : (
                <div className="text-gray-600 bg-gray-50 p-3 rounded-lg">
                  <span className="text-sm">
                    Please select filters to continue
                  </span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-2 pt-2">
              {hasFiltersSelected && (
                <button
                  onClick={() => {
                    clearGlobalFilters();
                    setIsExpanded(false);
                  }}
                  className="flex-1 px-4 py-2.5 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors duration-200 border border-red-200 hover:border-red-300 font-medium"
                >
                  Clear All
                </button>
              )}

              <button
                onClick={() => setIsExpanded(false)}
                className="flex-1 px-4 py-2.5 text-sm text-[#3730A3] hover:text-white hover:bg-[#3730A3] rounded-lg transition-colors duration-200 border border-[#3730A3] font-medium"
              >
                Done
              </button>
            </div>
          </div>

          {/* Loading Overlay */}
          {loading && (
            <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center">
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-b-transparent border-[#3730A3]"></div>
                <span className="text-sm text-gray-600">
                  Loading options...
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GlobalFilterDropdown;
