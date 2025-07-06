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
    <aside className="w-64 bg-gray-800 text-white min-h-screen p-4">
      <h2 className="text-lg font-bold mb-6">Hello, {user.role}</h2>
      <ul className="flex flex-col gap-4">
        {navItems.map(({ name, url }) => (
          <li key={name}>
            <Link
              to={url}
              className={`flex items-center gap-3 p-2 rounded ${
                pathname === url ? "" : ""
              }`}
            >
              {name}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
