import React, { useEffect, useRef, useState } from "react";
import { Menu, Bell, RefreshCcw, X } from "lucide-react";
import { useAuthStore } from "../../stores/auth";
import useFilterStore from "../../stores/admin/filterStore";
import useDashboardStore from "../../stores/admin/dashboardStore";
import useGradesStore from "../../stores/admin/gradeStore";
import useCertificatesStore from "../../stores/admin/certificateStore";
import useAttendanceStore from "../../stores/admin/attendanceStore";
import useBmiStore from "../../stores/admin/bmiStore";
import GlobalFilterDropdown from "../admin/GlobalFilterDropdown";
import MobileNavigation from "./MobileNavigation";
import NotificationBell from "../NotificationBell";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

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
  const shouldShowNotifications = !["super_admin"].includes(
    userRole?.toLowerCase()
  );

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-sm border-b border-gray-200/60 shadow-sm">
        <div className="max-w-full mx-auto py-3 md:py-0 px-5 md:px-7">
          {/* Main Header Row */}
          <div className="flex items-center justify-between px-3 sm:px-4 lg:px-6 h-16 sm:h-18 lg:h-20">
            {/* Left Section */}
            <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 flex-1 min-w-0">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="lg:hidden p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 text-gray-700 hover:text-gray-900 flex-shrink-0"
                aria-label="Toggle mobile menu"
              >
                <Menu className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
              </button>

              {/* Global Filters - Desktop Only */}
              {shouldShowRole && (
                <div className="hidden lg:flex items-center gap-2 lg:gap-3 flex-1 min-w-0">
                  <div className="flex-shrink-0 max-w-md">
                    <GlobalFilterDropdown userRole={userRole} />
                  </div>

                  {/* Filter Display (Desktop) */}
                  {filterLabels.length > 0 && (
                    <div className="flex items-center gap-1.5 lg:gap-2 text-xs">
                      {filterLabels.map((label, index) => (
                        <span
                          key={index}
                          className="px-1.5 py-0.5 lg:px-4 lg:py-1 bg-[#3730A3] text-white rounded-md text-xs font-medium truncate max-w-30 lg:max-w-40"
                          title={label}
                        >
                          {label}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
              {/* Notifications - Hidden for super_admin */}
              {shouldShowNotifications && <NotificationBell />}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      {menuOpen && (
        <MobileNavigation
          onClose={() => setMenuOpen(false)}
          userRole={userRole}
          filterLabels={filterLabels}
          clearGlobalFilters={clearGlobalFilters}
          shouldShowRole={shouldShowRole}
        />
      )}
    </>
  );
};

export default Header;
