// src/components/student/DashboardStatCard.jsx
import React from 'react';

const DashboardStatCard = ({ title, value, subText, change, progress, resources }) => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col justify-between">
            <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">{title}</h3>
                <p className="mt-1 text-3xl font-bold text-gray-900 flex items-baseline">
                    {value}
                    {change && (
                        <span className={`ml-2 text-base font-semibold ${change.includes('+') ? 'text-green-500' : 'text-red-500'}`}>
                            {change}
                        </span>
                    )}
                </p>
                {subText && <p className="text-sm text-gray-500">{subText}</p>}
            </div>

            {progress && (
                <div className="mt-4">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${parseFloat(value)}%` }}></div>
                    </div>
                </div>
            )}

            {resources && (
                <div className="mt-4 text-gray-700">
                    {resources.map((res, index) => (
                        <p key={index} className="text-sm">{res}</p>
                    ))}
                </div>
            )}
        </div>
    );
};

export default DashboardStatCard;