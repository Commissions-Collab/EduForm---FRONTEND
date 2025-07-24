import { Link, useLocation } from "react-router-dom";
import SidebarFooter from "./SidebarFooter";
import { useAuthStore } from "../../stores/useAuthStore";
import { navConfig } from "../../constants";

const MobileNavigation = ({ onClose }) => {
  const user = useAuthStore((state) => state.user);
  const { pathname } = useLocation();

  if (!user) return null;

  const navItems = navConfig[user.role] || [];

  return (
    <div className="fixed top-0 left-0 h-full w-[290px] bg-white z-50 flex flex-col p-5 gap-6 xl:hidden shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[#3730A3]">AcadFlow</h2>
        <button
          onClick={onClose}
          className="text-3xl text-[#3730A3] duration-300 cursor-pointer hover:scale-105 transition-transform"
        >
          ✕
        </button>
      </div>

      {/* Scrollable Nav */}
      <div className="flex-1 overflow-y-auto pr-1">
        <nav className="flex flex-col gap-2 mt-6">
          {navItems.map(({ name, url, icon: Icon }) => (
            <Link
              to={url}
              key={name}
              onClick={onClose}
              className={`flex items-center gap-4 text-lg px-4 py-3 rounded-lg ${
                pathname === url
                  ? "bg-[#3730A3] text-white font-semibold"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {Icon && (
                <Icon
                  size={18}
                  className={pathname === url ? "text-white" : "text-gray-700"}
                />
              )}
              <span className="text-[15px]">{name}</span>
            </Link>
          ))}
        </nav>
      </div>

      <hr className="border-t border-gray-300" />

      {/* Footer */}
      <SidebarFooter />
    </div>
  );
};

export default MobileNavigation;
