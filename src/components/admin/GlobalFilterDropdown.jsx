import React, { useEffect, useState, useRef } from "react";
import {
  LuChevronDown,
  LuFilter,
  LuCheck,
  LuX,
  LuCalendar,
  LuBookOpen,
  LuUsers,
  LuLoader,
} from "react-icons/lu";
import { useAdminStore } from "../../stores/admin";

const GlobalFilterDropdown = ({ userRole }) => {
  const {
    globalFilters,
    filterOptions,
    loading,
    initializeGlobalFilters,
    fetchGlobalFilterOptions,
    setGlobalFilters,
    clearGlobalFilters,
    updateQuartersForAcademicYear,
    updateSectionsForAcademicYear,
  } = useAdminStore();

  const [isExpanded, setIsExpanded] = useState(false);
  const [draftFilters, setDraftFilters] = useState(globalFilters);
  const [isUpdatingFilters, setIsUpdatingFilters] = useState(false);
  const dropdownRef = useRef();

  // Only show for admin/teacher roles
  const normalizedRole = (userRole || "").toLowerCase();
  if (!["admin", "teacher"].includes(normalizedRole)) {
    return null;
  }

  useEffect(() => {
    initializeGlobalFilters();
    fetchGlobalFilterOptions();
  }, [initializeGlobalFilters, fetchGlobalFilterOptions]);

  useEffect(() => {
    // Keep draft in sync when global filters change externally
    setDraftFilters(globalFilters);
  }, [globalFilters]);

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

  // Handle academic year change with cascade updates
  const handleAcademicYearChange = async (value) => {
    const academicYearId = value ? parseInt(value, 10) : null;

    setDraftFilters((prev) => ({
      ...prev,
      academicYearId,
      quarterId: null, // Reset quarter when year changes
      sectionId: null, // Reset section when year changes
    }));

    // Update quarters and sections for the new academic year
    if (academicYearId) {
      setIsUpdatingFilters(true);
      try {
        await updateQuartersForAcademicYear(academicYearId);
        await updateSectionsForAcademicYear(academicYearId);
      } catch (error) {
        console.error("Error updating filters:", error);
      } finally {
        setIsUpdatingFilters(false);
      }
    }
  };

  const handleQuarterChange = (value) => {
    setDraftFilters((prev) => ({
      ...prev,
      quarterId: value ? parseInt(value, 10) : null,
    }));
  };

  const handleSectionChange = (value) => {
    setDraftFilters((prev) => ({
      ...prev,
      sectionId: value ? parseInt(value, 10) : null,
    }));
  };

  const hasFiltersSelected =
    draftFilters.academicYearId ||
    draftFilters.quarterId ||
    draftFilters.sectionId;

  const hasCompleteFilters =
    draftFilters.academicYearId &&
    draftFilters.quarterId &&
    draftFilters.sectionId;

  const getCurrentSelections = () => {
    const selections = {};

    if (draftFilters.academicYearId) {
      const year = filterOptions.academicYears?.find(
        (y) => y.id === draftFilters.academicYearId
      );
      selections.academicYear = year ? year.name : null;
    }

    if (draftFilters.quarterId) {
      const quarter = filterOptions.quarters?.find(
        (q) => q.id === draftFilters.quarterId
      );
      selections.quarter = quarter ? quarter.name : null;
    }

    if (draftFilters.sectionId) {
      const section = filterOptions.sections?.find(
        (s) => s.id === draftFilters.sectionId
      );
      selections.section = section ? section.name : null;
    }

    return selections;
  };

  const selections = getCurrentSelections();
  const filterCount = Object.values(selections).filter(Boolean).length;

  const getTriggerStyle = () => {
    if (hasCompleteFilters) {
      return "border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 shadow-sm";
    } else if (hasFiltersSelected) {
      return "border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-100 shadow-sm";
    } else {
      return "border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-400";
    }
  };

  const getSelectedYear = () => {
    if (!draftFilters.academicYearId) return null;
    return filterOptions.academicYears?.find(
      (y) => y.id === draftFilters.academicYearId
    );
  };

  const getAvailableQuarters = () => {
    const selectedYear = getSelectedYear();
    if (selectedYear?.quarters?.length) {
      return selectedYear.quarters;
    }
    return filterOptions.quarters || [];
  };

  const applyFilters = () => {
    setGlobalFilters(draftFilters);
    setIsExpanded(false);
  };

  const clearAllFilters = () => {
    clearGlobalFilters();
    setDraftFilters({
      academicYearId: null,
      quarterId: null,
      sectionId: null,
    });
    setIsExpanded(false);
  };

  const isLoading = loading || isUpdatingFilters;

  return (
    <div className="relative w-full max-w-sm" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 ${getTriggerStyle()}`}
        disabled={isLoading}
      >
        <div className="flex items-center gap-2.5">
          {isLoading ? (
            <LuLoader className="w-4 h-4 flex-shrink-0 animate-spin" />
          ) : (
            <LuFilter className="w-4 h-4 flex-shrink-0" />
          )}
          <span className="text-sm font-medium truncate">
            {hasCompleteFilters
              ? "All Filters Applied"
              : hasFiltersSelected
              ? `${filterCount} Filter${filterCount > 1 ? "s" : ""} Set`
              : "Select Filters"}
          </span>
        </div>
        <LuChevronDown
          className={`w-4 h-4 transform transition-transform duration-200 ${
            isExpanded ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown Panel */}
      {isExpanded && (
        <div className="absolute left-0 right-0 mt-2 bg-white border border-gray-200/60 rounded-xl shadow-xl z-50 min-w-[320px]">
          {/* Header */}
          <div className="bg-[#3730A3] px-6 py-4 text-white flex justify-between">
            <h3 className="font-semibold text-base">Filter Settings</h3>
            <button
              onClick={() => setIsExpanded(false)}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <LuX className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Academic Year */}
            <div>
              <label className="flex items-center justify-between text-sm font-semibold text-gray-800 mb-2">
                <span className="flex items-center gap-2">
                  <LuCalendar className="w-5 h-5 text-[#3730A3]" />
                  Academic Year
                </span>
                {selections.academicYear && (
                  <LuCheck className="w-5 h-5 text-emerald-600" />
                )}
              </label>
              <select
                value={draftFilters.academicYearId || ""}
                onChange={(e) => handleAcademicYearChange(e.target.value)}
                className="w-full p-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:bg-gray-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                <option value="">Choose Academic Year</option>
                {filterOptions.academicYears?.map((y) => (
                  <option key={y.id} value={y.id}>
                    {y.name} {y.is_current ? "(Current)" : ""}
                  </option>
                ))}
              </select>
            </div>

            {/* Quarter */}
            <div>
              <label className="flex items-center justify-between text-sm font-semibold text-gray-800 mb-2">
                <span className="flex items-center gap-2">
                  <LuBookOpen className="w-5 h-5 text-[#3730A3]" />
                  Quarter
                </span>
                {selections.quarter && (
                  <LuCheck className="w-5 h-5 text-emerald-600" />
                )}
              </label>
              <select
                value={draftFilters.quarterId || ""}
                onChange={(e) => handleQuarterChange(e.target.value)}
                className="w-full p-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:bg-gray-50 disabled:cursor-not-allowed"
                disabled={isLoading || !draftFilters.academicYearId}
              >
                <option value="">Choose Quarter</option>
                {getAvailableQuarters().map((q) => (
                  <option key={q.id} value={q.id}>
                    {q.name}
                  </option>
                ))}
              </select>
              {!draftFilters.academicYearId && (
                <p className="text-xs text-gray-500 mt-1">
                  Select an academic year first
                </p>
              )}
            </div>

            {/* Section */}
            <div>
              <label className="flex items-center justify-between text-sm font-semibold text-gray-800 mb-2">
                <span className="flex items-center gap-2">
                  <LuUsers className="w-5 h-5 text-[#3730A3]" />
                  Section
                </span>
                {selections.section && (
                  <LuCheck className="w-5 h-5 text-emerald-600" />
                )}
              </label>
              <select
                value={draftFilters.sectionId || ""}
                onChange={(e) => handleSectionChange(e.target.value)}
                className="w-full p-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:bg-gray-50 disabled:cursor-not-allowed"
                disabled={isLoading || !draftFilters.academicYearId}
              >
                <option value="">Choose Section</option>
                {filterOptions.sections?.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
              {!draftFilters.academicYearId && (
                <p className="text-xs text-gray-500 mt-1">
                  Select an academic year first
                </p>
              )}
            </div>

            {/* Current Selections Summary */}
            {hasFiltersSelected && (
              <div className="bg-blue-50 rounded-lg p-3 space-y-1">
                <h4 className="text-sm font-medium text-blue-900">
                  Current Selection:
                </h4>
                {selections.academicYear && (
                  <p className="text-xs text-blue-700">
                    📅 {selections.academicYear}
                  </p>
                )}
                {selections.quarter && (
                  <p className="text-xs text-blue-700">
                    📚 {selections.quarter}
                  </p>
                )}
                {selections.section && (
                  <p className="text-xs text-blue-700">
                    👥 {selections.section}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 p-4 flex gap-3 bg-gray-50">
            {hasFiltersSelected && (
              <button
                onClick={clearAllFilters}
                className="flex-1 px-4 py-2 text-sm text-red-600 border border-red-300 hover:bg-red-50 rounded-lg transition-colors"
                disabled={isLoading}
              >
                Clear All
              </button>
            )}
            <button
              onClick={applyFilters}
              className="flex-1 px-4 py-2 text-sm text-white bg-[#3730A3] hover:bg-[#312e81] rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              disabled={isLoading || !hasFiltersSelected}
            >
              {isLoading ? (
                <>
                  <LuLoader className="w-4 h-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Apply Filters"
              )}
            </button>
          </div>

          {/* Loading Indicator */}
          {isUpdatingFilters && (
            <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-xl">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <LuLoader className="w-4 h-4 animate-spin" />
                Updating filter options...
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GlobalFilterDropdown;
