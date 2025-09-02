import { Link, useLocation } from "react-router-dom";
import { adminNav, studentNav, superAdminNav } from "../../constants";
import SidebarFooter from "./SidebarFooter";
import { useAuthStore } from "../../stores/auth";
import { LuX } from "react-icons/lu";

// Mobile navigation categories for teachers (same as desktop)
const mobileTeacherNavCategories = [
  {
    title: "Overview",
    items: adminNav.slice(0, 1), // Dashboard
  },
  {
    title: "Student Management",
    items: adminNav.slice(1, 4), // Student List, Approval, Health
  },
  {
    title: "Attendance & Records",
    items: adminNav.slice(4, 7), // Daily, Monthly, Academic Records
  },
  {
    title: "Academic Resources",
    items: adminNav.slice(7, 9), // Textbooks, Workload
  },
  {
    title: "Reports & Communication",
    items: adminNav.slice(9), // Promotion, Certificates, Parent Conference
  },
];

const MobileNavigation = ({ onClose }) => {
  const user = useAuthStore((state) => state.user);
  const { pathname } = useLocation();

  if (!user) return null;

  const renderNavItems = (items) => (
    <ul className="space-y-1">
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
      <nav className="space-y-6">
        {mobileTeacherNavCategories.map((category) => (
          <div key={category.title}>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2 px-3">
              {category.title}
            </h3>
            {renderNavItems(category.items)}
          </div>
        ))}
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

      {/* Mobile Navigation */}
      <div className="fixed top-0 left-0 h-full w-[320px] max-w-[85vw] bg-white z-50 flex flex-col xl:hidden shadow-2xl">
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
            <LuX size={20} />
          </button>
        </div>

        {/* Navigation Content */}
        <div className="flex-1 overflow-y-auto p-4">
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
