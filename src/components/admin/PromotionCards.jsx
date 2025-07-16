import React from "react";
import { promotionCards } from "../../constants";

const PromotionCards = () => {
  return (
    <div className="promoGrid">
      {promotionCards.map((stat) => {
        return (
          <div key={stat.label} className="card">
            <div className="flex items-center mb-2">
              <div className="text-sm sm:text-base  text-gray-500 font-medium">
                {stat.label}
              </div>
            </div>
            <div
              className={`mt-2 text-2xl sm:text-3xl font-bold ${stat.iconColor}`}
            >
              {stat.value}
            </div>
            <div className="text-xs sm:text-sm mt-1 text-gray-600">
              {stat.change}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PromotionCards;
