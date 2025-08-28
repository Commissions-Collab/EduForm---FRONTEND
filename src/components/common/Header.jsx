import React, { useEffect, useRef, useState } from "react";
import MobileNavigation from "./MobileNavigation";
import GlobalFilterDropdown from "../admin/GlobalFilterDropdown";
import { LuMenu, LuBell, LuRefreshCw, LuFilter, LuX } from "react-icons/lu";
import { useAuthStore } from "../../stores/useAuthStore";
import { useAdminStore } from "../../stores/useAdminStore";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const notifDropdownRef = useRef();

  // Get role and refresh function from stores
  const userRole = useAuthStore((state) => state.user?.role);
  const { refreshAllData, globalFilters, clearGlobalFilters, filterOptions } =
    useAdminStore();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notifDropdownRef.current &&
        !notifDropdownRef.current.contains(event.target)
      ) {
        setIsNotifOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Listen for global filter changes and refresh data
  useEffect(() => {
    const handleFilterChange = async (event) => {
      const { academicYearId, quarterId, sectionId } = event.detail;

      // Only refresh if all required filters are present
      if (academicYearId && quarterId && sectionId) {
        await handleRefreshData();
      }
    };

    window.addEventListener("globalFiltersChanged", handleFilterChange);
    return () =>
      window.removeEventListener("globalFiltersChanged", handleFilterChange);
  }, []);

  const handleRefreshData = async () => {
    if (
      !globalFilters.academicYearId ||
      !globalFilters.quarterId ||
      !globalFilters.sectionId
    ) {
      return;
    }

    setIsRefreshing(true);
    try {
      await refreshAllData();
    } catch (error) {
      console.error("Failed to refresh data:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const hasCompleteFilters =
    globalFilters.academicYearId &&
    globalFilters.quarterId &&
    globalFilters.sectionId;

  const hasAnyFilter =
    globalFilters.academicYearId ||
    globalFilters.quarterId ||
    globalFilters.sectionId;

  // Get filter labels for display
  const getFilterLabels = () => {
    const labels = [];

    if (globalFilters.academicYearId) {
      const year = filterOptions.academicYears?.find(
        (y) => y.id == globalFilters.academicYearId
      );
      if (year) labels.push(`${year.year_start}-${year.year_end}`);
    }

    if (globalFilters.quarterId) {
      const quarter = filterOptions.quarters?.find(
        (q) => q.id === globalFilters.quarterId
      );
      if (quarter) labels.push(quarter.name);
    }

    if (globalFilters.sectionId) {
      const section = filterOptions.sections?.find(
        (s) => s.id === globalFilters.sectionId
      );
      if (section) labels.push(section.name);
    }

    return labels;
  };

  const filterLabels = getFilterLabels();
  const shouldShowRole = ["admin", "teacher"].includes(userRole?.toLowerCase());

  return (
    <>
      <header className="w-full border-b border-gray-200 bg-white shadow-sm">
        <div className="flex items-center justify-between px-4 h-22">
          {/* Left Side - Menu + Filters */}
          <div className="flex items-center space-x-3">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-xl text-[#3730A3] hover:scale-105 transition-transform duration-200 focus:outline-none xl:hidden"
            >
              <LuMenu />
            </button>

            {/* Global Filter Dropdown */}
            {shouldShowRole && (
              <div className="flex items-center space-x-2">
                <GlobalFilterDropdown userRole={userRole} />

                {/* Small Filter Status Badge */}
                {hasCompleteFilters && (
                  <span className="hidden md:inline-flex items-center px-2 py-0.5 text-xs bg-green-50 text-green-700 rounded-md border border-green-200">
                    <LuFilter className="w-3 h-3 mr-1" />
                    Active
                  </span>
                )}

                {!hasCompleteFilters && hasAnyFilter && (
                  <span className="hidden md:inline-flex items-center px-2 py-0.5 text-xs bg-amber-50 text-amber-700 rounded-md border border-amber-200">
                    <LuFilter className="w-3 h-3 mr-1" />
                    Incomplete
                  </span>
                )}

                {!hasAnyFilter && (
                  <span className="hidden md:inline-flex items-center px-2 py-0.5 text-xs bg-gray-50 text-gray-600 rounded-md border border-gray-200">
                    <LuFilter className="w-3 h-3 mr-1" />
                    None
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Right Side - Actions */}
          <div className="flex items-center space-x-2">
            {/* Refresh */}
            {shouldShowRole && hasCompleteFilters && (
              <button
                onClick={handleRefreshData}
                disabled={isRefreshing}
                className="p-2 bg-[#E0E7FF] hover:bg-[#C7D2FE] text-[#3730A3] rounded-md transition-all duration-200 disabled:opacity-50"
                title="Refresh data"
              >
                <LuRefreshCw
                  className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
                />
              </button>
            )}

            {/* Notifications */}
            <div className="relative" ref={notifDropdownRef}>
              <button
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className="relative p-2 bg-[#E0E7FF] hover:bg-[#C7D2FE] text-[#3730A3] rounded-md transition-all duration-200"
              >
                <LuBell className="w-4 h-4" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold border-2 border-white">
                  3
                </span>
              </button>

              {isNotifOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white border border-gray-200 rounded-lg shadow-xl z-50">
                  <div className="p-3 border-b bg-gradient-to-r from-[#3730A3] to-[#4F46E5] text-white">
                    <h3 className="text-sm font-semibold">Notifications</h3>
                    <p className="text-xs opacity-90">Recent updates</p>
                  </div>
                  <ul className="text-sm max-h-56 overflow-y-auto">
                    {/* notifications list here */}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Filter Tags */}
        {shouldShowRole && filterLabels.length > 0 && (
          <div className="lg:hidden px-4 pb-2 flex flex-wrap gap-2 text-xs">
            {filterLabels.map((label, index) => (
              <span
                key={index}
                className="px-2 py-0.5 bg-[#E0E7FF] text-[#3730A3] rounded-full border border-[#C7D2FE]"
              >
                {label}
              </span>
            ))}

            {hasAnyFilter && (
              <button
                onClick={clearGlobalFilters}
                className="px-2 py-0.5 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-full border border-red-200 text-xs"
              >
                Clear
              </button>
            )}
          </div>
        )}
      </header>
      {/* Mobile Navigation */}
      {menuOpen && <MobileNavigation onClose={() => setMenuOpen(false)} />}
    </>
  );
};

export default Header;
