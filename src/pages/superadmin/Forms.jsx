import React, { useState } from "react";
import SearchFilter from "../../components/SearchFilter";
import { LuImport, LuClipboardPlus } from "react-icons/lu";

const FormsPage = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [activeTab, setActiveTab] = useState("All Forms");

    const handleSearch = (value) => {
        setSearchTerm(value);
        console.log("Search input changed on Forms Page:", value);
    };

    const handleFilterButtonClick = () => {
        console.log("Filter button clicked on Forms Page!");
    };

    const handleExportClick = () => {
        alert("Export button clicked!");
    };

    const handleNewTemplateClick = () => {
        alert("New Template button clicked!");
    };

    return (
        <div className="p-4 sm:p-6 md:p-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
            <h1 className="text-2xl font-bold">Form Management</h1>

            {/* Buttons */}
            <div className="flex flex-wrap gap-2">
            <button
                onClick={handleExportClick}
                className="flex items-center w-full sm:w-auto justify-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition"
            >
                <LuImport className="h-5 w-5 mr-2" />
                Export
            </button>
            <button
                onClick={handleNewTemplateClick}
                className="flex items-center w-full sm:w-auto justify-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition"
            >
                <LuClipboardPlus className="h-5 w-5 mr-2" />
                New Template
            </button>
            </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap border-b border-gray-200 mb-6 overflow-x-auto">
            {["All Forms", "Active", "Complete", "Issues"].map((tab) => (
            <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 whitespace-nowrap text-sm font-medium border-b-2 ${
                activeTab === tab
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-700 hover:text-gray-900 hover:border-gray-300"
                } focus:outline-none focus:text-blue-600 focus:border-blue-500`}
            >
                {tab}
            </button>
            ))}
        </div>

        {/* Search */}
        <SearchFilter
            placeholder="Search forms..."
            onSearch={handleSearch}
            onFilterClick={handleFilterButtonClick}
        />

        {searchTerm && (
            <p className="mt-4 text-center text-gray-700">
            Current search term: <span className="font-semibold">{searchTerm}</span>
            </p>
        )}

        {/* Content */}
        <div className="mt-8 p-6 bg-white rounded-lg shadow-md">
            <p>
            This section would display your list of forms or entries for the "<strong>{activeTab}</strong>" tab, filtered by the search term.
            </p>
        </div>
        </div>
    );
};

export default FormsPage;
