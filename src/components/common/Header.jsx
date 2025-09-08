import React, { useEffect, useRef, useState } from "react";
import { LuMenu, LuBell, LuRefreshCw, LuX } from "react-icons/lu";
import { useAuthStore } from "../../stores/auth";
import useFilterStore from "../../stores/admin/filterStore";
import useDashboardStore from "../../stores/admin/dashboardStore";
import useGradesStore from "../../stores/admin/gradeStore";
import useCertificatesStore from "../../stores/admin/certificateStore";
import useAttendanceStore from "../../stores/admin/attendanceStore";
import useBmiStore from "../../stores/admin/bmiStore";
import GlobalFilterDropdown from "../admin/GlobalFilterDropdown";
import MobileNavigation from "./MobileNavigation";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const notifDropdownRef = useRef();

  // Get user role from auth store
  const userRole = useAuthStore((state) => state.user?.role);

  // Get filter state and options from filter store
  const { globalFilters, filterOptions, clearGlobalFilters } = useFilterStore();

  // Get fetch functions from relevant stores
  const fetchDashboardData = useDashboardStore(
    (state) => state.fetchDashboardData
  );
  const fetchGrades = useGradesStore((state) => state.fetchGrades);
  const fetchCertificateData = useCertificatesStore(
    (state) => state.fetchCertificateData
  );
  const fetchMonthlyAttendance = useAttendanceStore(
    (state) => state.fetchMonthlyAttendance
  );
  const fetchBmiStudents = useBmiStore((state) => state.fetchBmiStudents);

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
      await Promise.all([
        fetchDashboardData(),
        fetchGrades(),
        fetchCertificateData(),
        fetchMonthlyAttendance(),
        fetchBmiStudents(),
      ]);
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
        (y) => y.id === globalFilters.academicYearId
      );
      if (year) labels.push(year.name);
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
      <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-sm border-b border-gray-200/60 shadow-sm">
        <div className="max-w-full mx-auto">
          {/* Main Header Row */}
          <div className="flex items-center justify-between px-4 lg:px-6 h-22">
            {/* Left Section - Global Filters */}
            <div className="flex items-center gap-4">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 text-gray-700 hover:text-gray-900"
                aria-label="Toggle mobile menu"
              >
                <LuMenu className="w-5 h-5" />
              </button>

              {/* Global Filters */}
              {shouldShowRole && (
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0 max-w-sm">
                    <GlobalFilterDropdown userRole={userRole} />
                  </div>

                  {/* Filter Display (Desktop) */}
                  {filterLabels.length > 0 && (
                    <div className="hidden lg:flex items-center gap-2 text-sm">
                      <div className="flex items-center gap-2">
                        {filterLabels.map((label, index) => (
                          <span
                            key={index}
                            className="px-2.5 py-1 bg-[#3730A3] text-white rounded-md text-xs font-medium"
                          >
                            {label}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-2">
              {/* Refresh Button */}
              {/* {shouldShowRole && hasCompleteFilters && (
                <button
                  onClick={handleRefreshData}
                  disabled={isRefreshing}
                  className="p-2.5 hover:bg-indigo-50 text-indigo-600 hover:text-indigo-700 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group"
                  title="Refresh data"
                >
                  <LuRefreshCw
                    className={`w-5 h-5 ${
                      isRefreshing ? "animate-spin" : "group-hover:rotate-180"
                    } transition-transform duration-300`}
                  />
                </button>
              )} */}

              {/* Notifications */}
              <div className="relative" ref={notifDropdownRef}>
                <button
                  onClick={() => setIsNotifOpen(!isNotifOpen)}
                  className="relative p-2.5 hover:bg-gray-100 text-gray-700 hover:text-gray-900 rounded-lg transition-all duration-200"
                  aria-label="View notifications"
                >
                  <LuBell className="w-5 h-5" />
                  <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-medium border-2 border-white shadow-sm">
                    3
                  </span>
                </button>

                {/* Notifications Dropdown */}
                {isNotifOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200/60 rounded-xl shadow-xl z-50 overflow-hidden">
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-3 text-white">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-sm">
                            Notifications
                          </h3>
                          <p className="text-xs text-indigo-100">
                            3 unread messages
                          </p>
                        </div>
                        <button
                          onClick={() => setIsNotifOpen(false)}
                          className="p-1 hover:bg-white/20 rounded-md transition-colors"
                        >
                          <LuX className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      <div className="p-4 text-center text-gray-500 text-sm">
                        No new notifications
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Mobile Filter Tags */}
          {shouldShowRole && filterLabels.length > 0 && (
            <div className="lg:hidden px-4 pb-3 border-t border-gray-100">
              <div className="flex items-center gap-2 pt-3">
                <span className="text-xs font-medium text-gray-600 flex-shrink-0">
                  Active Filters:
                </span>
                <div className="flex flex-wrap gap-1.5 flex-1">
                  {filterLabels.map((label, index) => (
                    <span
                      key={index}
                      className="px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-medium border border-indigo-200/50"
                    >
                      {label}
                    </span>
                  ))}
                </div>
                {hasAnyFilter && (
                  <button
                    onClick={clearGlobalFilters}
                    className="px-2.5 py-1 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-full border border-red-200/50 text-xs font-medium transition-colors flex-shrink-0"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Mobile Navigation */}
      {menuOpen && <MobileNavigation onClose={() => setMenuOpen(false)} />}
    </>
  );
};

export default Header;
