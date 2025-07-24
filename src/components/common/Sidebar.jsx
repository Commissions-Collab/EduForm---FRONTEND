import { Link, useLocation } from "react-router-dom";
import { useAuthStore } from "../../stores/useAuthStore";
import { navConfig } from "../../constants";
import SidebarFooter from "./SidebarFooter";

const Sidebar = () => {
  const user = useAuthStore((state) => state.user);
  const user = useAuthStore((state) => state.user);
  const { pathname } = useLocation();

  if (!user) return null;

  const navItems = navConfig[user.role] || [];

  return (
    <aside className="sidebar h-screen flex flex-col max-h-screen overflow-hidden">
      <h2 className="text-3xl font-bold mb-6 text-[#3730A3]">AcadFlow</h2>

      <div className="flex-1 overflow-y-auto pr-1">
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
      </div>

      <div className="py-1">
        <SidebarFooter />
      </div>
    </aside>
  );
};

export default Sidebar;
