// components/common/GlobalFilterDropdown.jsx
import React, { useEffect, useState } from "react";
import { useAdminStore } from "../../stores/useAdminStore";
import { getItem, setItem } from "../../lib/utils";

const GlobalFilterDropdown = ({ userRole }) => {
  const { fetchFilterOptions, filters, loading } = useAdminStore();

  const [selectedAcademicYear, setSelectedAcademicYear] = useState("");
  const [selectedQuarter, setSelectedQuarter] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  // Only show for admin/teacher roles
  if (!["teacher"].includes(userRole?.toLowerCase())) {
    return null;
  }

  useEffect(() => {
    // Fetch filter options when component mounts
    fetchFilterOptions();

    // Get saved filter values from localStorage
    const savedAcademicYear = getItem("academicYearId", false);
    const savedQuarter = getItem("quarterId", false);
    const savedSection = getItem("sectionId", false);

    if (savedAcademicYear) setSelectedAcademicYear(savedAcademicYear);
    if (savedQuarter) setSelectedQuarter(savedQuarter);
    if (savedSection) setSelectedSection(savedSection);
  }, [fetchFilterOptions]);

  const handleAcademicYearChange = (value) => {
    setSelectedAcademicYear(value);
    setItem("academicYearId", value);

    // Dispatch custom event for other components to listen to
    window.dispatchEvent(
      new CustomEvent("globalFiltersChanged", {
        detail: {
          academicYearId: value,
          quarterId: selectedQuarter,
          sectionId: selectedSection,
        },
      })
    );
  };

  const handleQuarterChange = (value) => {
    setSelectedQuarter(value);
    setItem("quarterId", value);

    window.dispatchEvent(
      new CustomEvent("globalFiltersChanged", {
        detail: {
          academicYearId: selectedAcademicYear,
          quarterId: value,
          sectionId: selectedSection,
        },
      })
    );
  };

  const handleSectionChange = (value) => {
    setSelectedSection(value);
    setItem("sectionId", value);

    window.dispatchEvent(
      new CustomEvent("globalFiltersChanged", {
        detail: {
          academicYearId: selectedAcademicYear,
          quarterId: selectedQuarter,
          sectionId: value,
        },
      })
    );
  };

  const getCurrentAcademicYearLabel = () => {
    const currentYear = filters.academic_years?.find(
      (year) => year.id === selectedAcademicYear
    );
    return currentYear
      ? `${currentYear.year_start}-${currentYear.year_end}`
      : "Select Year";
  };

  const getQuarterLabel = () => {
    if (!selectedQuarter) return "Select Quarter";
    const quarters = {
      1: "1st Quarter",
      2: "2nd Quarter",
      3: "3rd Quarter",
      4: "4th Quarter",
    };
    return quarters[selectedQuarter] || "Select Quarter";
  };

  const getSectionLabel = () => {
    if (!selectedSection) return "Select Section";
    // You might want to get this from your store/API
    const sections = {
      1: "Section A",
      2: "Section B",
      3: "Section C",
    };
    return sections[selectedSection] || `Section ${selectedSection}`;
  };

  return (
    <div className="hidden lg:block relative">
      {/* Compact View */}
      <div className="flex items-center space-x-3">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="px-4 py-2 text-sm rounded-lg border border-[#C7D2FE] bg-[#E0E7FF] text-[#3730A3] hover:bg-[#C7D2FE] focus:outline-none focus:ring-2 focus:ring-[#3730A3] transition-all duration-200"
        >
          {getCurrentAcademicYearLabel()}
        </button>

        {selectedQuarter && (
          <span className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full font-medium">
            {getQuarterLabel()}
          </span>
        )}

        {selectedSection && (
          <span className="px-3 py-1 text-sm bg-green-100 text-green-800 rounded-full font-medium">
            {getSectionLabel()}
          </span>
        )}

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-2 text-[#3730A3] hover:bg-[#E0E7FF] rounded-lg transition-colors duration-200"
          title="Filter Options"
        >
          <svg
            className={`w-4 h-4 transform transition-transform duration-200 ${
              isExpanded ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
      </div>

      {/* Expanded Dropdown */}
      {isExpanded && (
        <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="p-4 border-b">
            <h3 className="text-lg font-semibold text-[#3730A3]">
              Filter Options
            </h3>
          </div>

          <div className="p-4 space-y-4">
            {/* Academic Year Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Academic Year
              </label>
              <select
                value={selectedAcademicYear}
                onChange={(e) => handleAcademicYearChange(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3730A3] focus:border-[#3730A3] transition-all duration-200 text-gray-700 disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed text-sm"
                disabled={loading}
              >
                <option value="">Select Academic Year</option>
                {filters.academic_years?.map((year) => (
                  <option key={year.id} value={year.id}>
                    {year.year_start} - {year.year_end}
                  </option>
                ))}
              </select>
            </div>

            {/* Quarter Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quarter
              </label>
              <select
                value={selectedQuarter}
                onChange={(e) => handleQuarterChange(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3730A3] focus:border-[#3730A3] transition-all duration-200 text-gray-700 disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed text-sm"
                disabled={loading}
              >
                <option value="">Select Quarter</option>
                <option value="1">1st Quarter</option>
                <option value="2">2nd Quarter</option>
                <option value="3">3rd Quarter</option>
                <option value="4">4th Quarter</option>
              </select>
            </div>

            {/* Section Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Section
              </label>
              <select
                value={selectedSection}
                onChange={(e) => handleSectionChange(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3730A3] focus:border-[#3730A3] transition-all duration-200 text-gray-700 disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed text-sm"
                disabled={loading}
              >
                <option value="">Select Section</option>
                <option value="1">Section A</option>
                <option value="2">Section B</option>
                <option value="3">Section C</option>
              </select>
            </div>

            {/* Clear Filters Button */}
            <div className="pt-2 border-t">
              <button
                onClick={() => {
                  setSelectedAcademicYear("");
                  setSelectedQuarter("");
                  setSelectedSection("");
                  setItem("academicYearId", "");
                  setItem("quarterId", "");
                  setItem("sectionId", "");
                  window.dispatchEvent(
                    new CustomEvent("globalFiltersChanged", {
                      detail: {
                        academicYearId: "",
                        quarterId: "",
                        sectionId: "",
                      },
                    })
                  );
                }}
                className="w-full px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-colors duration-200"
              >
                Clear All Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GlobalFilterDropdown;
