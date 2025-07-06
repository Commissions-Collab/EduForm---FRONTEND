import { adminNav, studentNav, superAdminNav } from "../constants";
import { useAuth } from "../context/AuthContext";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const { user } = useAuth();
  const { pathname } = useLocation();

  if (!user) return null;

  let navItems = [];

  if (user.role === "superadmin") navItems = superAdminNav;
  else if (user.role === "admin") navItems = adminNav;
  else if (user.role === "student") navItems = studentNav;

  return (
    <aside className="sidebar">
      <h2 className="text-3xl font-bold mb-6">EDUFORM</h2>
      <ul className="flex flex-col mt-10 gap-1.5">
        {navItems.map(({ name, url, icon: Icon }) => (
          <li key={name}>
            <Link
              to={url}
              className={`flex items-center gap-3 p-3 rounded-lg  transition ${
                pathname === url
                  ? "bg-blue-500 font-semibold text-white"
                  : "text-gray-700 font-medium transition-all duration-200 hover:bg-gray-100"
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
              <p className="hidden lg:block text-lg">{name}</p>
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
