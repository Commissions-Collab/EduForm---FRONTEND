import { LuUser, LuLogOut } from "react-icons/lu";
import { useAuthStore } from "../../stores/useAuthStore";
import { useNavigate } from "react-router-dom";

const SidebarFooter = () => {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate("/sign-in");
  };

  return (
    <div className="flex mt-5 items-center gap-3 p-1 pt-4">
      <div className="w-9 h-9 rounded-full overflow-hidden bg-[#3730A3] flex items-center justify-center">
        {user?.avatar ? (
          <img
            src={user.avatar}
            alt="User Avatar"
            className="w-full h-full object-cover"
          />
        ) : (
          <LuUser className="text-white w-5 h-5" />
        )}
      </div>

      <div className="flex-1 text-sm">
        <p className="text-[14px] text-gray-900 font-bold uppercase">
          {user.name}
        </p>
        <p className="text-xs text-gray-600 font-medium uppercase">
          {user.role}
        </p>
      </div>

      <button
        onClick={handleLogout}
        title="Logout"
        className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition"
      >
        <LuLogOut className="w-5 h-5" />
      </button>
    </div>
  );
};

export default SidebarFooter;
