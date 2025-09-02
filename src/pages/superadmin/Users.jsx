import React, { useState, useEffect } from "react";
import { useSuperAdminStore } from "../../stores/superAdmin";
import UserTable from "../../components/superadmin/UserTable";
import UserModal from "../../components/superadmin/UserModal";
import SearchFilter from "../../components/common/SearchFilter";
import useIsMobile from "../../hooks/useIsMobile";
import {
  LuUserPlus,
  LuDownload,
  LuUsers,
  LuUserCheck,
  LuUserX,
} from "react-icons/lu";

const Users = () => {
  const {
    teachers, // Teachers are users in this context
    isLoading,
    fetchTeachers,
    createTeacher,
    updateTeacher,
    deleteTeacher,
  } = useSuperAdminStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("All Roles");
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const isMobile = useIsMobile();

  const USERS_PER_PAGE = isMobile ? 5 : 10;

  // Fetch users/teachers on component mount
  useEffect(() => {
    fetchTeachers();
  }, [fetchTeachers]);

  const handleSearch = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleRoleChange = (e) => {
    setSelectedRole(e.target.value);
    setCurrentPage(1);
  };

  const handleStatusChange = (e) => {
    setSelectedStatus(e.target.value);
    setCurrentPage(1);
  };

  const handleAddNewUser = () => {
    setSelectedUser(null);
    setIsModalOpen(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleDeleteUser = async (userId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this user? This action cannot be undone."
      )
    ) {
      await deleteTeacher(userId);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleModalSave = async (userData) => {
    if (selectedUser) {
      await updateTeacher(selectedUser.id, userData);
    } else {
      await createTeacher(userData);
    }
    handleModalClose();
  };

  const handleExport = () => {
    // Create CSV content from filtered users
    const csvContent = [
      [
        "Name",
        "Email",
        "Role",
        "Department",
        "Status",
        "Phone",
        "Last Active",
      ].join(","),
      ...filteredUsers.map((user) =>
        [
          user.name ||
            `${user.first_name || ""} ${user.last_name || ""}`.trim(),
          user.email || "",
          user.role || user.position || "Teacher",
          user.department || user.subject_area || "",
          user.status || "Active",
          user.phone || user.contact_number || "",
          user.last_active || user.updated_at || "",
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("hidden", "");
    a.setAttribute("href", url);
    a.setAttribute("download", "users_list.csv");
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Transform teachers data to users format and get unique values for filters
  const allUsers = teachers.map((teacher) => ({
    id: teacher.id,
    name:
      teacher.name ||
      `${teacher.first_name || ""} ${teacher.last_name || ""}`.trim() ||
      "Unknown",
    email: teacher.email || "N/A",
    role: teacher.role || teacher.position || "Teacher",
    department: teacher.department || teacher.subject_area || "General",
    status: teacher.status || teacher.is_active ? "Active" : "Inactive",
    phone: teacher.phone || teacher.contact_number || "N/A",
    permissions: teacher.permissions || ["View Students", "Manage Classes"],
    lastActive: teacher.last_active || teacher.updated_at || "N/A",
    created_at: teacher.created_at,
    updated_at: teacher.updated_at,
    // Keep original teacher data for editing
    originalData: teacher,
  }));

  const uniqueRoles = [...new Set(allUsers.map((user) => user.role))].filter(
    Boolean
  );
  const uniqueStatuses = [
    ...new Set(allUsers.map((user) => user.status)),
  ].filter(Boolean);

  // Filter users based on search and filter criteria
  const filteredUsers = allUsers.filter((user) => {
    const matchesSearch =
      searchTerm === "" ||
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.department.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole =
      selectedRole === "All Roles" || user.role === selectedRole;
    const matchesStatus =
      selectedStatus === "All Status" || user.status === selectedStatus;

    return matchesSearch && matchesRole && matchesStatus;
  });

  // Pagination
  const indexOfLastUser = currentPage * USERS_PER_PAGE;
  const indexOfFirstUser = indexOfLastUser - USERS_PER_PAGE;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.max(
    1,
    Math.ceil(filteredUsers.length / USERS_PER_PAGE)
  );

  // Statistics
  const activeUsers = allUsers.filter(
    (user) => user.status === "Active"
  ).length;
  const inactiveUsers = allUsers.filter(
    (user) => user.status === "Inactive"
  ).length;
  const totalUsers = allUsers.length;

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-1">
            Manage system users and their permissions ({totalUsers} total users)
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleExport}
            disabled={filteredUsers.length === 0}
            className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <LuDownload className="h-5 w-5 mr-2" />
            Export Users
          </button>
          <button
            onClick={handleAddNewUser}
            className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            <LuUserPlus className="mr-2 w-5 h-5" />
            Add New User
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <LuUsers className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total Users</p>
              <p className="text-2xl font-semibold text-gray-900">
                {totalUsers}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <LuUserCheck className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Active Users</p>
              <p className="text-2xl font-semibold text-gray-900">
                {activeUsers}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <LuUserX className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Inactive Users</p>
              <p className="text-2xl font-semibold text-gray-900">
                {inactiveUsers}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        <div className="flex-grow">
          <SearchFilter
            placeholder="Search users by name, email, or department..."
            onSearch={handleSearch}
          />
        </div>
        <div className="p-5 bg-white rounded-xl shadow-md">
          <div className="flex flex-wrap gap-3">
            <select
              value={selectedRole}
              onChange={handleRoleChange}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="All Roles">All Roles</option>
              {uniqueRoles.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
            <select
              value={selectedStatus}
              onChange={handleStatusChange}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="All Status">All Status</option>
              {uniqueStatuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results Summary */}
      {searchTerm && (
        <div className="mb-4 text-sm text-gray-600">
          Showing {filteredUsers.length} results for "{searchTerm}"
        </div>
      )}

      {/* User Table */}
      <UserTable
        users={currentUsers}
        loading={isLoading}
        onEdit={handleEditUser}
        onDelete={handleDeleteUser}
      />

      {/* Pagination */}
      {filteredUsers.length > 0 && (
        <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-sm text-gray-700">
            Showing {indexOfFirstUser + 1} to{" "}
            {Math.min(indexOfLastUser, filteredUsers.length)} of{" "}
            {filteredUsers.length} results
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <span className="px-3 py-2 text-sm text-gray-700">
              {currentPage} of {totalPages}
            </span>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="px-3 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* User Modal */}
      {isModalOpen && (
        <UserModal
          user={selectedUser}
          isOpen={isModalOpen}
          onClose={handleModalClose}
          onSave={handleModalSave}
        />
      )}
    </div>
  );
};

export default Users;
