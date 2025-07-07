import React from "react";
import { dashboardStats } from "../../../constants";

const StatCards = () => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-4 py-4 md:px-5 md:py-5">
        {dashboardStats.map((stat) => {
            const Icon = stat.icon;
            return (
            <div
                key={stat.label}
                className="bg-white shadow rounded-md p-6 sm:p-8 lg:p-10" // Adjusted padding for responsiveness
            >
                <div className="flex items-center mb-2"> {/* Added margin-bottom for spacing */}
                <div className={`${stat.iconColor} mr-3`}> {/* Adjusted margin-right */}
                    <Icon className="h-7 w-7 sm:h-8 sm:w-8" /> {/* Slightly larger icons on larger screens */}
                </div>
                <div className="text-sm sm:text-base text-gray-500 font-medium">{stat.label}</div> {/* Adjusted font size and added font-medium */}
                </div>
                <div className="mt-2 text-2xl sm:text-3xl font-bold text-gray-900">{stat.value}</div> {/* Adjusted font size and color */}
                {stat.link ? (
                <a href={stat.link.href} className={`${stat.changeColor} text-xs sm:text-sm mt-1 block`}> {/* Adjusted font size, added mt-1 block */}
                    {stat.link.text}
                </a>
                ) : (
                <div className={`${stat.changeColor} text-xs sm:text-sm mt-1`}> {/* Adjusted font size, added mt-1 */}
                    {stat.change}
                </div>
                )}
            </div>
            );
        })}
        </div>
    );
};

export default StatCards;