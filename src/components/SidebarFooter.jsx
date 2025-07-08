import { useAuth } from "../context/AuthContext";
import { LuUser } from "react-icons/lu";

const SidebarFooter = () => {
  const { user } = useAuth();

  return (
    <div className="flex items-center gap-3 p-3 border-gray-700">
      <div className="w-10 h-10 rounded-full overflow-hidden bg-[#3730A3] flex items-center justify-center">
        {user?.avatar ? (
          <img
            src={user.avatar}
            alt="User Avatar"
            className="w-full h-full object-cover"
          />
        ) : (
          <LuUser className="text-white w-6 h-6" />
        )}
      </div>

      <div className="text-sm">
        <p className="text-lg text-gray-700 font-medium">{user?.name}</p>
      </div>
    </div>
  );
};

export default SidebarFooter;
