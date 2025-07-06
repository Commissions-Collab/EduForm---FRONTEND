import React from "react";
import { dashboardStats } from "../../../constants";

const StatCards = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 px-5">
        {dashboardStats.map((stat) => {
            const Icon = stat.icon;
            return (
            <div
                key={stat.label}
                className="bg-white shadow rounded-md p-10"
            >
                <div className="flex items-center">
                <div className={`${stat.iconColor} mr-2`}>
                    <Icon className="h-6 w-6" />
                </div>
                <div className="text-sm text-gray-500">{stat.label}</div>
                </div>
                <div className="mt-2 text-2xl font-bold">{stat.value}</div>
                {stat.link ? (
                <a href={stat.link.href} className={`${stat.changeColor} text-sm`}>
                    {stat.link.text}
                </a>
                ) : (
                <div className={`${stat.changeColor} text-sm`}>
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
