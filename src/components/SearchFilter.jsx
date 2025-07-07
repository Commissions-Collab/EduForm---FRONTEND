import React from 'react';
import { LuFilter, LuSearch } from "react-icons/lu";

// Define the SearchBar functional component that accepts props for customization.
const SearchFilter = ({
  placeholder = "Search users...", // Default placeholder text
  onSearch = () => {},             // Default empty function for search input change
  onFilterClick = () => {}          // Default empty function for filter button click
}) => {
    return (
        <div className="flex items-center w-full p-5 bg-white rounded-xl shadow-md">
            {/* Search input container */}
            <div className="relative flex-grow">
                {/* Search icon (using inline SVG for simplicity and customizability) */}
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LuSearch />
                </div>
                {/* Search input field */}
                <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm"
                placeholder={placeholder} // Uses the placeholder prop
                onChange={(e) => onSearch(e.target.value)} // Calls onSearch with the input value
                />
            </div>

            {/* Filter button */}
            <button
                onClick={onFilterClick} // Calls onFilterClick when the button is clicked
                className="ml-3 flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
            >
                {/* Filter icon (using inline SVG) */}
                <LuFilter />
                <div className='ml-2'>Filter</div>
            </button>
        </div>
    );
};

export default SearchFilter; // Export the component for use in other parts of your application
