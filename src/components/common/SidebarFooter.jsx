import { LuUser } from "react-icons/lu";
import { useAuth } from "../../context/AuthContext";

const SidebarFooter = () => {
  const { user } = useAuth();

  return (
    <div className="flex mt-5 items-center gap-3 p-1 border-gray-700">
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

      <div className="text-sm">
        <p className="text-[14px] text-gray-900 font-bold uppercase">
          {user?.name}
        </p>
        <p className="text-xs text-gray-600 font-medium uppercase ">
          {user?.role}
        </p>
      </div>
    </div>
  );
};

export default SidebarFooter;
