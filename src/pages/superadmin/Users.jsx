import {React, useState} from "react";
import SearchFilter from "../../components/SearchFilter";

const Users = () => {

  // State to hold the current search term
  const [searchTerm, setSearchTerm] = useState('');

  // Handler for when the search input changes
  const handleSearch = (value) => {
    setSearchTerm(value);
    console.log("Search input changed:", value);
    // Here you would typically trigger your user search/filtering logic
    // e.g., call an API, filter a local array of users
  };

  // Handler for when the filter button is clicked
  const handleFilterButtonClick = () => {
    console.log("Filter button clicked!");
    // Here you would typically open a filter modal, navigate to a filter page, etc.
  };

  const handleAddNewUserClick = () => {
    alert("Add New User button clicked!"); // Replace with actual navigation or modal logic
  };

  return (
    <>
      <div className="p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="md:text-xl lg:text-2xl font-bold">User Management</h1>
          <button
            onClick={handleAddNewUserClick}
            className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
          >
            {/* Plus icon for "Add New User" */}
            <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Add New User
          </button>
        </div>

        {/* Render the SearchFilter component (your SearchBar) and pass the props */}
        <SearchFilter
          placeholder="Search users by name or ID..." // Custom placeholder text
          onSearch={handleSearch}                     // Pass the search handler function
          onFilterClick={handleFilterButtonClick}     // Pass the filter button handler function
        />

        {/* Display the current search term for demonstration purposes */}
        {searchTerm && (
          <p className="mt-4 text-center text-gray-700">
            Current search term: <span className="font-semibold">{searchTerm}</span>
          </p>
        )}

        <div className="mt-8 p-6 bg-white rounded-lg shadow-md">
          <p>This is where your list of users would be displayed, potentially filtered by the search term.</p>
          {/* Example of displaying users based on searchTerm */}
          {/* <ul>
            {users.filter(user => user.name.includes(searchTerm)).map(user => (
              <li key={user.id}>{user.name}</li>
            ))}
          </ul> */}
        </div>
      </div>
    </>
  )
};

export default Users;
