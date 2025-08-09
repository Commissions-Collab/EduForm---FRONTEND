import { adminNav, studentNav, superAdminNav } from "../../constants";

import { Link, useLocation } from "react-router-dom";
import SidebarFooter from "./SidebarFooter";
import { useAuthStore } from "../../stores/useAuthStore";

const Sidebar = () => {
  const user = useAuthStore((state) => state.user);
  const { pathname } = useLocation();

  if (!user) return null;

  let navItems = [];

  switch (user.role?.toLowerCase()) {
    case "super_admin":
      navItems = superAdminNav;
      break;
    case "teacher":
      navItems = adminNav;
      break;
    case "student":
      navItems = studentNav;
      break;
    default:
      navItems = [];
  }

  return (
    <aside className="sidebar h-screen flex flex-col max-h-screen overflow-hidden">
      <div className="px-7 py-5 gap-4 flex items-center border-b border-gray-200">
        <div className="w-13 h-13 bg-indigo-100  rounded-full flex items-center justify-center">
          <img
            src="/logo/acadflow.png"
            alt="AcadFlow Logo"
            className="w-10 h-10 object-contain"
          />
        </div>

        <h2 className="text-2xl font-bold text-[#3730A3] hidden lg:block">
          AcadFlow
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {navItems.length > 0 ? (
          <nav>
            <ul className="space-y-2">
              {navItems.map(({ name, url, icon: Icon }) => (
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
                          pathname === url ? "text-white" : "text-gray-500 ]"
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
          </nav>
        ) : (
          <div className="text-sm text-gray-500 px-3 py-4 text-center">
            No navigation available for your role.
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-gray-100 p-6">
        <SidebarFooter />
      </div>
    </aside>
  );
};

export default Sidebar;
