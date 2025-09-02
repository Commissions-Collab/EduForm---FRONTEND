import React, { useState, useEffect } from "react";
import { LuFilter, LuSearch, LuX } from "react-icons/lu";

const SearchFilter = ({
  placeholder = "Search...",
  onSearch = () => {},
  onFilterClick = () => {},
  showFilterButton = true,
  value = "",
  debounceMs = 300,
}) => {
  const [searchValue, setSearchValue] = useState(value);

  // Debounce search to avoid too many API calls
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onSearch(searchValue);
    }, debounceMs);

    return () => clearTimeout(timeoutId);
  }, [searchValue, onSearch, debounceMs]);

  // Update local state when external value changes
  useEffect(() => {
    setSearchValue(value);
  }, [value]);

  const handleInputChange = (e) => {
    setSearchValue(e.target.value);
  };

  const handleClear = () => {
    setSearchValue("");
    onSearch("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onSearch(searchValue);
    }
  };

  return (
    <div className="flex items-center w-full p-5 bg-white rounded-xl shadow-md">
      {/* Search input container */}
      <div className="relative flex-grow">
        {/* Search icon */}
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <LuSearch className="h-5 w-5 text-gray-400" />
        </div>

        {/* Search input field */}
        <input
          type="text"
          className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm"
          placeholder={placeholder}
          value={searchValue}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
        />

        {/* Clear button */}
        {searchValue && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <button
              type="button"
              onClick={handleClear}
              className="text-gray-400 hover:text-gray-600 focus:outline-none"
            >
              <LuX className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {/* Filter button */}
      {showFilterButton && (
        <button
          onClick={onFilterClick}
          className="ml-3 flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
        >
          <LuFilter className="h-4 w-4" />
          <span className="ml-2 hidden sm:block">Filter</span>
        </button>
      )}
    </div>
  );
};

export default SearchFilter;
