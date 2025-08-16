import { adminNav, studentNav, superAdminNav } from "../../constants";
import { Link, useLocation } from "react-router-dom";
import SidebarFooter from "./SidebarFooter";
import { useAuthStore } from "../../stores/useAuthStore";

// Navigation categories for teachers
const teacherNavCategories = [
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

const Sidebar = () => {
  const user = useAuthStore((state) => state.user);
  const { pathname } = useLocation();

  if (!user) return null;

  const renderNavItems = (items) => (
    <ul className="space-y-1">
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
          </Link>
        </li>
      ))}
    </ul>
  );

  const renderCategorizedNav = () => {
    return (
      <nav className="space-y-6">
        {teacherNavCategories.map((category, index) => (
          <div key={category.title}>
            <h3 className="hidden lg:block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2 px-3">
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
            <h3 className="hidden lg:block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2 px-3">
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
            <h3 className="hidden lg:block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2 px-3">
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
