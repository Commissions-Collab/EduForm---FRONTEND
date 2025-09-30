import React from "react";
import { TrendingUp, User, Award, UserCheck } from "lucide-react";

const PromotionCards = ({ stats = {} }) => {
  const cardData = [
    {
      label: "Total Students",
      value: stats.total || 0,
      change: "All enrolled",
      icon: User,
      iconColor: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-100",
    },
    {
      label: "Promoted",
      value: stats.promoted || 0,
      change: `${stats.promotedPercentage || 0}% promotion rate`,
      icon: UserCheck,
      iconColor: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-100",
    },
    {
      label: "With Honors",
      value: stats.withHonors || 0,
      change: `${stats.honorsPercentage || 0}% of students`,
      icon: Award,
      iconColor: "text-yellow-600",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-100",
    },
    {
      label: "Retained",
      value: stats.retained || 0,
      change: `${stats.retainedPercentage || 0}% retention rate`,
      icon: TrendingUp,
      iconColor: "text-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-100",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {cardData.map((card, index) => {
        const IconComponent = card.icon;
        return (
          <div
            key={card.label}
            className={`${card.bgColor} ${card.borderColor} border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200`}
          >
            <div className="flex items-center justify-between mb-4">
              <div
                className={`w-12 h-12 ${card.bgColor} rounded-lg flex items-center justify-center border ${card.borderColor}`}
              >
                <IconComponent className={`w-6 h-6 ${card.iconColor}`} />
              </div>
              <div className="text-right">
                <div
                  className={`text-2xl sm:text-3xl font-bold ${card.iconColor}`}
                >
                  {card.value}
                </div>
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-sm font-medium text-gray-700">
                {card.label}
              </div>
              <div className="text-xs text-gray-600">{card.change}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PromotionCards;
