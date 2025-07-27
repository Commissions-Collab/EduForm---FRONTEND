// src/pages/Achievements.jsx
import React, { useEffect } from 'react'
import AchievementsCertificates from '../../components/user/AchievementsCertificates'
import { useStoreUser } from '../../stores/useStoreUser' // Import your Zustand store

const Achievements = () => {
    // Get the action to fetch achievements from the store
    const {
        fetchAchievements,
        selectedSchoolYear,
        schoolYearOptions, // Get schoolYearOptions from the store
        setSelectedSchoolYear // Get setSelectedSchoolYear from the store
    } = useStoreUser();

    // Trigger initial data fetch when the component mounts
    useEffect(() => {
        fetchAchievements(selectedSchoolYear);
        console.log(`Achievements page loaded for school year: ${selectedSchoolYear}`);
    }, [fetchAchievements, selectedSchoolYear]); // Add dependencies to useEffect

    const pageTitle = "Achievements & Certificates"; // Define page title here

    return (
        <div className="min-h-screen bg-gray-50 p-4 lg:p-6"> {/* Added back page container styling */}
            <div className="mx-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 pb-4 border-b border-gray-200">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 sm:mb-0">
                        {pageTitle}
                    </h1>
                    <div className="flex items-center gap-3">
                        <select
                            value={selectedSchoolYear}
                            onChange={(e) => setSelectedSchoolYear(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        >
                            {schoolYearOptions.map((year) => (
                                <option key={year} value={year}>
                                    School Year {year}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* The AchievementsCertificates component will get all its necessary state and actions
                    directly from the useStoreUser Zustand store. */}
                <AchievementsCertificates />
            </div>
        </div>
    )
}

export default Achievements
