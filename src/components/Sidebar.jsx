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
      <h2 className="text-lg font-bold mb-6">Logo</h2>
      <ul className="flex flex-col mt-10 gap-1">
        {navItems.map(({ name, url, icon: Icon }) => (
          <li key={name}>
            <Link
              to={url}
              className={`flex items-center gap-3 p-2 rounded-lg  transition ${
                pathname === url
                  ? "bg-gray-200 font-medium text-gray-900"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {Icon && (
                <Icon
                  size={20}
                  className={`${
                    pathname === url ? "text-gray-800" : "text-gray-500"
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
