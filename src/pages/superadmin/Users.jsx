import React, { useState } from "react";
import SearchFilter from "../../components/SearchFilter";
import UserTable from "../../components/superadmin//UserTable";
import { sampleUsers } from "../../constants";
import useIsMobile from "../../hooks/useIsMobile";
import { LuUserRoundPlus } from "react-icons/lu";


const Users = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const isMobile = useIsMobile();

  // Determine how many rows per page based on screen size
  const USERS_PER_PAGE = isMobile ? 5 : 10;

  const handleSearch = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleFilterButtonClick = () => {
    console.log("Filter button clicked!");
  };

  const handleAddNewUserClick = () => {
    alert("Add New User button clicked!");
  };

  // Filtered users
  const filteredUsers = sampleUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const indexOfLastUser = currentPage * USERS_PER_PAGE;
  const indexOfFirstUser = indexOfLastUser - USERS_PER_PAGE;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6 flex-wrap gap-2">
        <h1 className="md:text-xl lg:text-2xl font-bold">User Management</h1>
        <button
          onClick={handleAddNewUserClick}
          className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
        >
        <LuUserRoundPlus className="mr-2 w-5 h-5"/>
          Add New User
        </button>
      </div>

      <SearchFilter
        placeholder="Search users by name or email..."
        onSearch={handleSearch}
        onFilterClick={handleFilterButtonClick}
      />

      <UserTable
        users={currentUsers}
        currentPage={currentPage}
        totalPages={totalPages}
        onPreviousPage={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        onNextPage={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
      />
    </div>
  );
};

export default Users;