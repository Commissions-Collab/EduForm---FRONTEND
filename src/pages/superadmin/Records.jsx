import  { React, useState } from "react";
// Assuming SearchFilter is located in a components directory relative to this file
import SearchFilter from "../../components/SearchFilter";

const Records = () => {
    // State to hold the current search term for the main search input
    const [searchTerm, setSearchTerm] = useState('');
    // State to hold the selected grade filter
    const [selectedGrade, setSelectedGrade] = useState('All Grades');
    // State to hold the selected section filter
    const [selectedSection, setSelectedSection] = useState('All Sections');

    // Handler for when the main search input changes
    const handleSearch = (value) => {
        setSearchTerm(value);
        console.log("Search input changed on Records Page:", value);
        // You would typically trigger record search/filtering logic here
    };

    // Handler for when the main filter button is clicked (if any, though the image shows dropdowns)
    const handleFilterButtonClick = () => {
        console.log("Main Filter button clicked on Records Page!");
        // This might be used if there's a more complex filter modal
    };

    // Handler for clicking the "Export Records" button
    const handleExportRecordsClick = () => {
        alert("Export Records button clicked!"); // Replace with actual export logic for records
    };

    // Handler for clicking the "Add Student" button
    const handleAddStudentClick = () => {
        alert("Add Student button clicked!"); // Replace with actual navigation or modal logic for adding students
    };

    // Handler for grade dropdown change
    const handleGradeChange = (e) => {
        setSelectedGrade(e.target.value);
        console.log("Grade changed to:", e.target.value);
        // Trigger filtering based on grade
    };

    // Handler for section dropdown change
    const handleSectionChange = (e) => {
        setSelectedSection(e.target.value);
        console.log("Section changed to:", e.target.value);
        // Trigger filtering based on section
    };

    return (
        <div className="p-4">
        {/* Header section with title and action buttons */}
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Student Records</h1>
            <div className="flex space-x-3">
            {/* Export Records Button */}
            <button
                onClick={handleExportRecordsClick}
                className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
            >
                {/* Download icon for Export Records */}
                <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Export Records
            </button>
            {/* Add Student Button */}
            <button
                onClick={handleAddStudentClick}
                className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
            >
                {/* User plus icon for Add Student */}
                <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                Add Student
            </button>
            </div>
        </div>

        {/* Search and Filter section */}
        <div className="flex items-center w-full space-x-3 mb-6">
            {/* Main Search Input (using SearchFilter component) */}
            <div className="flex-grow">
            <SearchFilter
                placeholder="Search by name, ID, or LRN..." // Custom placeholder for records page
                onSearch={handleSearch}
                // The image does not show a filter button next to the search bar,
                // but if you need one, you can uncomment and provide a handler:
                // onFilterClick={handleFilterButtonClick}
            />
            </div>

            <div className="p-5 bg-white rounded-xl shadow-md"> 
            {/* Grade Dropdown */}
            <select
            value={selectedGrade}
            onChange={handleGradeChange}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm"
            >
            <option value="All Grades">All Grades</option>
            <option value="Grade 1">Grade 1</option>
            <option value="Grade 2">Grade 2</option>
            <option value="Grade 3">Grade 3</option>
            {/* Add more grade options as needed */}
            </select>

            {/* Section Dropdown */}
            <select
            value={selectedSection}
            onChange={handleSectionChange}
            className="ml-3 px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm"
            >
            <option value="All Sections">All Sections</option>
            <option value="Section A">Section A</option>
            <option value="Section B">Section B</option>
            <option value="Section C">Section C</option>
            {/* Add more section options as needed */}
            </select>
            </div>
        </div>

        {searchTerm && (
            <p className="mt-4 text-center text-gray-700">
            Current search term: <span className="font-semibold">{searchTerm}</span>
            </p>
        )}
        {selectedGrade !== 'All Grades' && (
            <p className="mt-2 text-center text-gray-700">
            Filtered by Grade: <span className="font-semibold">{selectedGrade}</span>
            </p>
        )}
        {selectedSection !== 'All Sections' && (
            <p className="mt-2 text-center text-gray-700">
            Filtered by Section: <span className="font-semibold">{selectedSection}</span>
            </p>
        )}


        <div className="mt-8 p-6 bg-white rounded-lg shadow-md">
            <p>This section would display your list of student records, filtered by search term, grade, and section.</p>
            {/* Example: Render a list of students */}
            {/* <ul>
            {students
                .filter(student => student.name.includes(searchTerm) || student.id.includes(searchTerm) || student.lrn.includes(searchTerm))
                .filter(student => selectedGrade === 'All Grades' || student.grade === selectedGrade)
                .filter(student => selectedSection === 'All Sections' || student.section === selectedSection)
                .map(student => (
                <li key={student.id}>{student.name} - {student.grade} - {student.section}</li>
                ))}
            </ul> */}
        </div>
        </div>
    );
};

export default Records;
