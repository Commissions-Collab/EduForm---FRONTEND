import { Link, useLocation } from "react-router-dom";
import { adminNav, studentNav, superAdminNav } from "../../constants";
import SidebarFooter from "./SidebarFooter";
import { useAuthStore } from "../../stores/useAuthStore";

const MobileNavigation = ({ onClose }) => {
  const user = useAuthStore((state) => state.user);
  const { pathname } = useLocation();

  if (!user) return null;

  let navItems = [];

  switch (user.role?.toLowerCase()) {
    case "superadmin":
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
    <div className="fixed top-0 left-0 h-full w-[290px] bg-white z-50 flex flex-col p-5 gap-6 xl:hidden shadow-xl">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[#3730A3]">AcadFlow</h2>
        <button
          onClick={onClose}
          className="text-3xl text-[#3730A3] duration-300 cursor-pointer hover:scale-105 transition-transform"
        >
          ✕
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pr-1">
        <nav className="flex flex-col gap-2 mt-6">
          {navItems.length > 0 ? (
            <ul className="flex flex-col mt-10 gap-1.5">
              {navItems.map(({ name, url, icon: Icon }) => (
                <li key={name}>
                  <Link
                    to={url}
                    className={`flex items-center gap-3 p-3 rounded-lg transition ${
                      pathname === url
                        ? "bg-[#3730A3] font-semibold text-white"
                        : "text-gray-700 font-medium hover:bg-gray-100"
                    }`}
                  >
                    {Icon && (
                      <Icon
                        size={21}
                        className={`${
                          pathname === url ? "text-white" : "text-gray-700"
                        }`}
                      />
                    )}
                    <p className="hidden lg:block text-[14px]">{name}</p>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-sm text-gray-500 mt-10 px-3">
              No navigation available for your role.
            </div>
          )}
        </nav>
      </div>

      <hr className="border-t border-gray-300" />

      <SidebarFooter />
    </div>
  );
};

export default MobileNavigation;
