import React, { useEffect, useState, useRef } from "react";
import { useAdminStore } from "../../stores/useAdminStore";
import {
  LuChevronDown,
  LuFilter,
  LuCheck,
  LuX,
  LuCalendar,
  LuBookOpen,
  LuUsers,
} from "react-icons/lu";

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
  const [draftFilters, setDraftFilters] = useState(globalFilters); // ✅ local draft state
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

  // ✅ Update draft only
  const handleAcademicYearChange = (value) => {
    setDraftFilters((prev) => ({
      ...prev,
      academicYearId: value || null,
      quarterId: null,
      sectionId: null,
    }));
  };

  const handleQuarterChange = (value) => {
    setDraftFilters((prev) => ({
      ...prev,
      quarterId: value ? parseInt(value) : null,
    }));
  };

  const handleSectionChange = (value) => {
    setDraftFilters((prev) => ({
      ...prev,
      sectionId: value ? parseInt(value) : null,
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
        (y) => y.id == draftFilters.academicYearId
      );
      selections.academicYear = year
        ? `${year.year_start}-${year.year_end}`
        : null;
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

  return (
    <div className="relative w-full max-w-sm" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 ${getTriggerStyle()}`}
      >
        <div className="flex items-center gap-2.5">
          <LuFilter className="w-4 h-4 flex-shrink-0" />
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
          <div className="bg-[#3730A3]  px-6 py-4 text-white flex justify-between">
            <h3 className="font-semibold text-base">Filter Settings</h3>
            <button
              onClick={() => setIsExpanded(false)}
              className="p-2 hover:bg-white/20 rounded-lg"
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
                  <LuCalendar className="w-5 h-5 text-[#3730A3]" /> Academic
                  Year
                </span>
                {selections.academicYear && (
                  <LuCheck className="w-5 h-5 text-emerald-600" />
                )}
              </label>
              <select
                value={draftFilters.academicYearId || ""}
                onChange={(e) => handleAcademicYearChange(e.target.value)}
                className="w-full p-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                disabled={loading}
              >
                <option value="">Choose Academic Year</option>
                {filterOptions.academicYears?.map((y) => (
                  <option key={y.id} value={y.id}>
                    {y.year_start} - {y.year_end}
                  </option>
                ))}
              </select>
            </div>

            {/* Quarter */}
            <div>
              <label className="flex items-center justify-between text-sm font-semibold text-gray-800 mb-2">
                <span className="flex items-center gap-2">
                  <LuBookOpen className="w-5 h-5 text-[#3730A3]" /> Quarter
                </span>
                {selections.quarter && (
                  <LuCheck className="w-5 h-5 text-emerald-600" />
                )}
              </label>
              <select
                value={draftFilters.quarterId || ""}
                onChange={(e) => handleQuarterChange(e.target.value)}
                className="w-full p-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                disabled={loading}
              >
                <option value="">Choose Quarter</option>
                {filterOptions.quarters?.map((q) => (
                  <option key={q.id} value={q.id}>
                    {q.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Section */}
            <div>
              <label className="flex items-center justify-between text-sm font-semibold text-gray-800 mb-2">
                <span className="flex items-center gap-2">
                  <LuUsers className="w-5 h-5 text-[#3730A3]" /> Section
                </span>
                {selections.section && (
                  <LuCheck className="w-5 h-5 text-emerald-600" />
                )}
              </label>
              <select
                value={draftFilters.sectionId || ""}
                onChange={(e) => handleSectionChange(e.target.value)}
                className="w-full p-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                disabled={loading}
              >
                <option value="">Choose Section</option>
                {filterOptions.sections?.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 p-4 flex gap-3 bg-gray-50">
            {hasFiltersSelected && (
              <button
                onClick={() => {
                  clearGlobalFilters();
                  setDraftFilters({});
                  setIsExpanded(false);
                }}
                className="flex-1 px-4 py-2 text-sm text-red-600 border rounded-lg"
              >
                Clear All
              </button>
            )}
            <button
              onClick={() => {
                setGlobalFilters(draftFilters); // ✅ Apply only here
                setIsExpanded(false);
              }}
              className="flex-1 px-4 py-2 text-sm text-white bg-[#3730A3] rounded-lg"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GlobalFilterDropdown;
