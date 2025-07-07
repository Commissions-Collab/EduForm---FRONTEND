import  { React, useState } from "react";
// Assuming SearchFilter is located in a components directory relative to this file
import SearchFilter from "../../components/SearchFilter";

const FormsPage = () => {
  // State to hold the current search term
    const [searchTerm, setSearchTerm] = useState('');
    // State to manage the active tab
    const [activeTab, setActiveTab] = useState('All Forms');

    // Handler for when the search input changes
    const handleSearch = (value) => {
        setSearchTerm(value);
        console.log("Search input changed on Forms Page:", value);
        // You would typically trigger form-related search/filtering logic here
    };

    // Handler for when the filter button is clicked
    const handleFilterButtonClick = () => {
        console.log("Filter button clicked on Forms Page!");
        // You might open a filter modal specific to forms or data on this page
    };

    // Handler for clicking the "Export" button
    const handleExportClick = () => {
        alert("Export button clicked!"); // Replace with actual export logic
    };

    // Handler for clicking the "New Template" button
    const handleNewTemplateClick = () => {
        alert("New Template button clicked!"); // Replace with actual navigation or modal logic for creating new templates
    };

    return (
        <div className="p-4">
        {/* Header section with title and action buttons */}
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Form Management</h1>
            <div className="flex space-x-3">
            {/* Export Button */}
            <button
                onClick={handleExportClick}
                className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
            >
                {/* Download icon for Export */}
                <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Export
            </button>
            {/* New Template Button */}
            <button
                onClick={handleNewTemplateClick}
                className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
            >
                {/* Document icon for New Template */}
                <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                New Template
            </button>
            </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 mb-6">
            {['All Forms', 'Active', 'Complete', 'Issues'].map((tab) => (
            <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 -mb-px text-sm font-medium leading-5 text-gray-700 border-b-2 ${
                activeTab === tab ? 'border-blue-500 text-blue-600' : 'border-transparent hover:text-gray-900 hover:border-gray-300'
                } focus:outline-none focus:text-blue-600 focus:border-blue-500`}
            >
                {tab}
            </button>
            ))}
        </div>

        {/* Render the SearchFilter component */}
        <SearchFilter
            placeholder="Search forms..." // Custom placeholder for forms page
            onSearch={handleSearch}
            onFilterClick={handleFilterButtonClick}
        />

        {searchTerm && (
            <p className="mt-4 text-center text-gray-700">
            Current search term: <span className="font-semibold">{searchTerm}</span>
            </p>
        )}

        <div className="mt-8 p-6 bg-white rounded-lg shadow-md">
            <p>This section would display your list of forms or entries for the "{activeTab}" tab, filtered by the search term.</p>
            {/* Example: Render a list of forms based on activeTab and searchTerm */}
            {/* <ul>
            {forms
                .filter(form => form.status === activeTab || activeTab === 'All Forms')
                .filter(form => form.title.includes(searchTerm))
                .map(form => (
                <li key={form.id}>{form.title} - {form.status}</li>
                ))}
            </ul> */}
        </div>
        </div>
    );
};

export default FormsPage;
