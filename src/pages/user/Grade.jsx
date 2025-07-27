// src/pages/Grades.jsx
import React, { useEffect } from "react";
import StudentGradesTable from "../../components/user/StudentGradesTable";
import { useStoreUser } from "../../stores/useStoreUser"; // Import the store

const Grades = () => {
    const {
        initializeUserData,
        quarterOptions,
        selectedQuarter,
        setSelectedQuarter,
    } = useStoreUser();

    // Example of Grades.jsx interacting with the store on mount
    useEffect(() => {
        // You might call an initialization function for user data here
        // For instance, if 'initializeUserData' in your store fetches all initial data
        // from an API when the user first visits a page that needs user-specific data.
        initializeUserData("currentUserId"); // Pass a dummy user ID or actual user ID
        console.log(`Grades page loaded for: ${selectedQuarter}`);
    }, [initializeUserData, selectedQuarter]); // Depend on initializeUserData to prevent infinite loops

    const pageTitle = "Quarterly Grades (SF9)"; // Define page title here

    return (
        <div className="min-h-screen bg-gray-50 p-4"> {/* Added back the page container styling */}
            <div className="mx-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 pb-4 border-b border-gray-200">
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 sm:mb-0">
                        {pageTitle}
                    </h2>
                    <div className="flex items-center gap-3">
                        <span className="text-gray-600 font-medium text-sm sm:text-base">Quarter:</span>
                        <select
                            className="px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            value={selectedQuarter}
                            onChange={(e) => setSelectedQuarter(e.target.value)}
                        >
                            {quarterOptions.map((quarter, index) => (
                                <option key={index} value={quarter}>
                                    {quarter}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* This component gets all its data and setters from the Zustand store internally */}
                <StudentGradesTable /> {/* No longer passes props for quarter selection */}
            </div>
        </div>
    );
};

export default Grades;
