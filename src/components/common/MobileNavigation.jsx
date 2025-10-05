import { Link, useLocation } from "react-router-dom";
import { adminNav, studentNav, superAdminNav } from "../../constants";
import SidebarFooter from "./SidebarFooter";
import { useAuthStore } from "../../stores/auth";
import { X, ChevronDown } from "lucide-react";
import React, { useState, useEffect } from "react";
import GlobalFilterDropdown from "../admin/GlobalFilterDropdown";

// Mobile navigation categories for teachers (same as desktop)
const mobileTeacherNavCategories = [
  {
    title: "Overview",
    items: adminNav.slice(0, 1), // Dashboard
  },
  {
    title: "School Forms (SF 2-9)",
    items: adminNav.slice(1, 8), // Daily Attendance (SF 2) through Academic Records (SF 9)
  },
  {
    title: "Documents & Communication",
    items: adminNav.slice(8),
  },
];

const MobileNavigation = ({
  onClose,
  userRole,
  filterLabels,
  clearGlobalFilters,
  shouldShowRole,
}) => {
  const user = useAuthStore((state) => state.user);
  const { pathname } = useLocation();
  const [expandedCategories, setExpandedCategories] = useState({});

  if (!user) return null;

  // Toggle category expand/collapse
  const toggleCategory = (title) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  // Auto-expand category if it contains the active route
  useEffect(() => {
    if (user.role?.toLowerCase() !== "teacher") return;

    const newExpanded = {};
    mobileTeacherNavCategories.forEach((category) => {
      const isActive = category.items.some((item) => item.url === pathname);
      if (isActive) {
        newExpanded[category.title] = true;
      }
    });

    setExpandedCategories((prev) => ({
      ...prev, // Preserve manual expansions/collapses
      ...newExpanded, // Ensure active categories are expanded
    }));
  }, [pathname, user.role]);

  const renderNavItems = (items) => (
    <ul className="space-y-1 transition-all duration-200 overflow-hidden">
      {items.map(({ name, url, icon: Icon }) => (
        <li key={name}>
          <Link
            to={url}
            onClick={onClose} // Close mobile nav when item is clicked
            className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 ${
              pathname === url
                ? "bg-[#3730A3] text-white shadow-sm"
                : "text-gray-700 hover:bg-gray-100 active:bg-gray-200"
            }`}
          >
            {Icon && (
              <Icon
                size={20}
                className={`flex-shrink-0 ${
                  pathname === url ? "text-white" : "text-gray-500"
                }`}
              />
            )}
            <span className="text-sm font-medium truncate">{name}</span>
          </Link>
        </li>
      ))}
    </ul>
  );

  const renderCategorizedNav = () => {
    return (
      <nav className="space-y-4">
        {mobileTeacherNavCategories.map((category) => {
          const isExpanded = expandedCategories[category.title];
          return (
            <div key={category.title} className="space-y-1">
              {/* Clickable Category Title */}
              <h3
                className={`cursor-pointer flex items-center justify-between text-xs font-semibold uppercase tracking-wide mb-2 px-3 py-1.5 rounded-lg transition-all duration-200 ${
                  isExpanded
                    ? "text-gray-700 bg-gray-50"
                    : "text-gray-400 hover:bg-gray-50 active:bg-gray-100"
                }`}
                onClick={() => toggleCategory(category.title)}
              >
                <span className="truncate">{category.title}</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 flex-shrink-0 transition-transform duration-200 ${
                    isExpanded ? "rotate-180" : ""
                  }`}
                />
              </h3>

              {/* Items - Conditionally Rendered */}
              {isExpanded && renderNavItems(category.items)}
            </div>
          );
        })}
      </nav>
    );
  };

  const getNavigationContent = () => {
    switch (user.role?.toLowerCase()) {
      case "super_admin":
        return (
          <nav>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2 px-3">
              System Administration
            </h3>
            {renderNavItems(superAdminNav)}
          </nav>
        );
      case "teacher":
        return renderCategorizedNav();
      case "student":
        return (
          <nav>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2 px-3">
              Student Portal
            </h3>
            {renderNavItems(studentNav)}
          </nav>
        );
      default:
        return (
          <div className="text-sm text-gray-500 px-3 py-4 text-center">
            No navigation available for your role.
          </div>
        );
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 xl:hidden"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        onClick={onClose}
      />

      {/* Mobile Navigation - Wider */}
      <div className="fixed top-0 left-0 h-full w-[360px] max-w-[90vw] bg-white z-50 flex flex-col xl:hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
              <img
                src="/logo/acadflow.png"
                alt="AcadFlow Logo"
                className="w-6 h-6 object-contain"
              />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#3730A3]">AcadFlow</h2>
              <p className="text-xs text-gray-500 capitalize">
                {user.role?.replace("_", " ")}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
            aria-label="Close navigation"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Global Filters - Mobile Only */}
          {shouldShowRole && (
            <div className="space-y-3 border-b border-gray-200 pb-4">
              <div className="w-full max-w-full">
                <GlobalFilterDropdown userRole={userRole} />
              </div>
              {/* Applied Filters Tags */}
              {filterLabels.length > 0 && (
                <div className="flex flex-wrap justify-center gap-3 pt-2">
                  {filterLabels.map((label, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-medium border border-indigo-200/50"
                      title={label}
                    >
                      {label}
                    </span>
                  ))}
                </div>
              )}
              {filterLabels.length > 0 && (
                <button
                  onClick={clearGlobalFilters}
                  className="w-full px-3 py-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-full border border-red-200/50 text-xs font-medium transition-colors"
                >
                  Clear Filters
                </button>
              )}
            </div>
          )}

          {getNavigationContent()}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 p-4">
          <SidebarFooter />
        </div>
      </div>
    </>
  );
};

export default MobileNavigation;
