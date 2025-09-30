import { LogOut, ChevronUp } from "lucide-react";
import { useAuthStore } from "../../stores/auth";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { useState } from "react";

const SidebarFooter = () => {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const isLoggingOut = useAuthStore((state) => state.isLoggingOut);
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  if (!user) return null;

  const handleLogout = async () => {
    if (isLoggingOut) return; // Prevent multiple logout attempts
    setShowDropdown(false); // Close dropdown immediately
    await logout();
    navigate("/sign-in", { replace: true }); // Use replace to prevent back navigation
  };

  const getRoleDisplayName = (role) => {
    switch (role?.toLowerCase()) {
      case "super_admin":
        return "Super Admin";
      case "teacher":
        return "Teacher";
      case "student":
        return "Student";
      default:
        return role || "User";
    }
  };

  const getUserInitials = (name) => {
    return (
      name
        ?.split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2) || "U"
    );
  };

  // Helper function to get full name from first_name and last_name
  const getFullName = () => {
    const firstName = user.first_name?.trim() || "";
    const lastName = user.last_name?.trim() || "";

    if (firstName && lastName) {
      return `${firstName} ${lastName}`;
    } else if (firstName) {
      return firstName;
    } else if (lastName) {
      return lastName;
    }
    return null;
  };

  // Helper function to get display name with fallback
  const getDisplayName = () => {
    const fullName = getFullName();
    return fullName || user.email || "Unknown User";
  };

  // Helper function to check if user has a name
  const hasUserName = () => {
    return getFullName() !== null;
  };

  // Get the full name for use in JSX
  const fullName = getFullName();
  const displayName = getDisplayName();

  return (
    <div className="relative">
      {/* User Profile Section */}
      <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
        <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-[#3730A3] to-[#4F46E5] flex items-center justify-center flex-shrink-0 shadow-sm">
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt="User Avatar"
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-white text-sm font-semibold">
              {getUserInitials(fullName || user.email)}
            </span>
          )}
        </div>

        <div className="flex-1 min-w-0 hidden lg:block">
          <p className="text-sm font-semibold text-gray-900 truncate">
            {displayName}
          </p>
          <p className="text-sm text-gray-500 truncate">
            {getRoleDisplayName(user.role)}
          </p>
        </div>

        {/* Mobile: Show only logout button */}
        <div className="lg:hidden">
          <button
            onClick={handleLogout}
            title="Logout"
            aria-label="Logout"
            disabled={isLoggingOut}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors disabled:opacity-50"
          >
            {isLoggingOut ? (
              <ClipLoader size={16} color="#6B7280" />
            ) : (
              <LogOut className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Desktop: Show dropdown toggle */}
        <div className="hidden lg:block">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors"
            aria-label="User menu"
          >
            <ChevronUp
              className={`w-4 h-4 transition-transform ${
                showDropdown ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* Dropdown Menu - Desktop Only */}
      {showDropdown && (
        <div className="hidden lg:block absolute bottom-full left-0 right-0 mb-2 bg-white rounded-lg shadow-lg border border-gray-200 py-1">
          <div className="px-4 py-2 border-b border-gray-100">
            <p className="text-sm font-medium text-gray-900 truncate">
              {displayName}
            </p>
            <p className="text-sm text-gray-500 truncate">
              {user.email || getRoleDisplayName(user.role)}
            </p>
          </div>

          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full flex items-center gap-3 px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            {isLoggingOut ? (
              <>
                <ClipLoader size={14} color="#6B7280" />
                <span>Logging out...</span>
              </>
            ) : (
              <>
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Click outside to close dropdown */}
      {showDropdown && (
        <div
          className="fixed inset-0 z-[-1]"
          onClick={() => setShowDropdown(false)}
        />
      )}
    </div>
  );
};

export default SidebarFooter;
