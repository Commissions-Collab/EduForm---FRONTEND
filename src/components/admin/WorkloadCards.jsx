import React from "react";
import { workloadCards } from "../../constants";

const WorkloadCards = () => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-5 gap-4 py-2 md:py-2">
      {workloadCards.map((stat) => {
        const Icon = stat.icon; // Call the icon component

        return (
          <div key={stat.label} className="card text-center">
            <div className="flex justify-center mb-3">
              <div
                className={`rounded-full p-3 ${stat.iconBg} ${stat.iconColor}`}
              >
                <Icon className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-2 mb-4 text-2xl sm:text-3xl font-bold text-gray-700">
              {stat.value}
            </div>
            <div className="text-sm sm:text-base text-gray-500 font-medium">
              {stat.label}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default WorkloadCards;
