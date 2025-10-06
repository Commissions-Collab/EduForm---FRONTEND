import React, { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { adminNav, studentNav, superAdminNav } from "../../constants";
import { Link, useLocation } from "react-router-dom";
import SidebarFooter from "./SidebarFooter";
import { useAuthStore } from "../../stores/auth";

// Navigation categories for teachers
const teacherNavCategories = [
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

const Sidebar = () => {
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
    teacherNavCategories.forEach((category) => {
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
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
              pathname === url
                ? "bg-[#3730A3] text-white shadow-sm"
                : "text-gray-700 hover:bg-gray-100"
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
            <span className="hidden lg:block text-sm font-medium truncate">
              {name}
            </span>
            <span className="lg:hidden text-xs font-medium truncate flex-1">
              {name}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );

  const renderCategorizedNav = () => {
    return (
      <nav className="space-y-4 lg:space-y-6">
        {teacherNavCategories.map((category) => {
          const isExpanded = expandedCategories[category.title];
          return (
            <div key={category.title} className="space-y-1">
              {/* Clickable Category Title */}
              <h3
                className={`cursor-pointer flex items-center justify-between text-xs font-semibold uppercase tracking-wide mb-2 px-3 py-1.5 rounded-lg transition-all duration-200 ${
                  isExpanded
                    ? "text-gray-700 bg-gray-50"
                    : "text-gray-400 hover:bg-gray-50"
                }`}
                onClick={() => toggleCategory(category.title)}
              >
                <span className="truncate lg:pr-2">{category.title}</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 lg:w-4 lg:h-4 flex-shrink-0 transition-transform duration-200 ${
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
    <aside className="sidebar h-screen flex flex-col max-h-screen overflow-hidden bg-white border-r border-gray-200">
      {/* Header */}
      <div className="px-6 py-5 gap-4 flex items-center border-b border-gray-100">
        <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
          <img
            src="/logo/acadflow.png"
            alt="AcadFlow Logo"
            className="w-8 h-8 object-contain"
          />
        </div>
        <div className="hidden lg:block">
          <h2 className="text-xl font-bold text-[#3730A3]">AcadFlow</h2>
          <p className="text-xs text-gray-500 capitalize">
            {user.role?.replace("_", " ")}
          </p>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto p-4">{getNavigationContent()}</div>

      {/* Footer */}
      <div className="border-t border-gray-100 p-4">
        <SidebarFooter />
      </div>
    </aside>
  );
};

export default Sidebar;
