import React from "react";
import {
  LuUserRoundCog,
  LuTrash2,
  LuEye,
  LuMail,
  LuPhone,
  LuPen,
} from "react-icons/lu";

const UserTable = ({ users, loading, onEdit, onDelete, onView }) => {
  // Function to get initials from name
  const getInitials = (name) => {
    if (!name) return "?";
    const names = name.split(" ");
    return names.length > 1
      ? `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase()
      : name[0].toUpperCase();
  };

  // Function to determine status color
  const getStatusColor = (status) => {
    const statusLower = status.toLowerCase();
    if (statusLower === "active") {
      return "bg-green-100 text-green-800";
    } else if (statusLower === "inactive") {
      return "bg-red-100 text-red-800";
    } else if (statusLower === "pending") {
      return "bg-yellow-100 text-yellow-800";
    }
    return "bg-gray-100 text-gray-800";
  };

  // Function to determine role color
  const getRoleColor = (role) => {
    const roleLower = role.toLowerCase();
    if (roleLower.includes("admin")) {
      return "bg-purple-100 text-purple-800";
    } else if (roleLower.includes("teacher")) {
      return "bg-blue-100 text-blue-800";
    } else if (roleLower.includes("staff")) {
      return "bg-green-100 text-green-800";
    }
    return "bg-gray-100 text-gray-800";
  };

  // Function to format date
  const formatDate = (dateString) => {
    if (!dateString || dateString === "N/A") return "Never";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="mt-8">
        <div className="bg-white rounded-lg shadow-md border border-gray-200">
          <div className="animate-pulse">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <div className="flex space-x-4">
                <div className="h-4 bg-gray-200 rounded w-20"></div>
                <div className="h-4 bg-gray-200 rounded w-16"></div>
                <div className="h-4 bg-gray-200 rounded w-16"></div>
                <div className="h-4 bg-gray-200 rounded w-20"></div>
                <div className="h-4 bg-gray-200 rounded w-16"></div>
                <div className="h-4 bg-gray-200 rounded w-16"></div>
              </div>
            </div>
            {[...Array(5)].map((_, i) => (
              <div key={i} className="px-6 py-4 border-b border-gray-100">
                <div className="flex items-center space-x-4">
                  <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-32"></div>
                    <div className="h-3 bg-gray-200 rounded w-24"></div>
                  </div>
                  <div className="h-4 bg-gray-200 rounded w-16"></div>
                  <div className="h-4 bg-gray-200 rounded w-16"></div>
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <div className="overflow-x-auto bg-white rounded-lg shadow-md border border-gray-200">
        {users.length === 0 ? (
          <div className="p-12 text-center">
            <div className="mx-auto h-12 w-12 text-gray-400">
              <LuUserRoundCog className="h-full w-full" />
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              No users found
            </h3>
            <p className="mt-2 text-gray-500">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role & Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact Info
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Active
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        {getInitials(user.name)}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.name}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <LuMail className="w-3 h-3 mr-1" />
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(
                          user.role
                        )}`}
                      >
                        {user.role}
                      </span>
                      <div className="text-sm text-gray-500">
                        {user.department}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {user.phone !== "N/A" ? (
                        <div className="flex items-center">
                          <LuPhone className="w-3 h-3 mr-1" />
                          {user.phone}
                        </div>
                      ) : (
                        <span className="text-gray-400">No phone</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                        user.status
                      )}`}
                    >
                      <span
                        className={`w-1.5 h-1.5 mr-1.5 rounded-full ${
                          user.status === "Active"
                            ? "bg-green-400"
                            : "bg-red-400"
                        }`}
                      ></span>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(user.lastActive)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center space-x-2">
                      {onView && (
                        <button
                          onClick={() => onView(user)}
                          className="text-blue-400 hover:text-blue-600 transition-colors"
                          title="View User Details"
                        >
                          <LuEye className="w-5 h-5" />
                        </button>
                      )}
                      {onEdit && (
                        <button
                          onClick={() => onEdit(user.originalData || user)}
                          className="text-green-400 hover:text-green-600 transition-colors"
                          title="Edit User"
                        >
                          <LuPen className="w-5 h-5" />
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => onDelete(user.id)}
                          className="text-red-400 hover:text-red-600 transition-colors"
                          title="Delete User"
                        >
                          <LuTrash2 className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default UserTable;
