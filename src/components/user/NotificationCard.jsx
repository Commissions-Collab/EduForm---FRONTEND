// src/components/student/NotificationCard.jsx
import React from 'react';
import { LuCircleAlert, LuClock, LuAward } from 'react-icons/lu';

const iconMap = {
    'alert': LuCircleAlert,
    'clock': LuClock,
    'award': LuAward,
};

const NotificationCard = ({ type, message, suggestion, time, fine, returnDate }) => {
    const IconComponent = iconMap[type];
    let bgColorClass = '';
    let textColorClass = '';

    switch (type) {
        case 'alert':
            bgColorClass = 'bg-red-50';
            textColorClass = 'text-red-700';
            break;
        case 'clock':
            bgColorClass = 'bg-yellow-50';
            textColorClass = 'text-yellow-700';
            break;
        case 'award':
            bgColorClass = 'bg-green-50';
            textColorClass = 'text-green-700';
            break;
        default:
            bgColorClass = 'bg-gray-50';
            textColorClass = 'text-gray-700';
    }

    return (
        <div className={`p-4 rounded-lg flex items-start space-x-3 ${bgColorClass}`}>
            {IconComponent && <IconComponent className={`w-6 h-6 flex-shrink-0 ${textColorClass}`} />}
            <div>
                <p className={`font-medium ${textColorClass}`}>{message}</p>
                {suggestion && <p className="text-sm text-gray-600 mt-1">{suggestion}</p>}
                {returnDate && fine && <p className="text-sm text-gray-600 mt-1">Return by {returnDate} to avoid ₱{fine}/day fine.</p>}
            </div>
        </div>
    );
};

export default NotificationCard;