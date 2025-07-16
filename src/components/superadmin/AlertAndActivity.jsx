// components/AlertAndActivity.jsx
import React from "react";
import { systemAlerts, recentActivity } from "../../constants";

const AlertAndActivity = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-5 mt-3">
      {/* System Alerts Container */}
      <div className="bg-white shadow rounded-md p-6 sm:pb-5 md:pb-10 lg:pb-20">
        <h2 className="text-lg font-semibold mb-4">System Alerts</h2>
        {systemAlerts.map((alert, index) => {
          const Icon = alert.icon;
          return (
            <div key={index} className="flex items-start mb-4">
              <div className={`${alert.iconColor} mr-3`}>
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-gray-800">{alert.message}</p>
                <p className="text-sm text-gray-500">{alert.time}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity Container */}
      <div className="bg-white shadow rounded-md p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
        {recentActivity.map((activity, index) => {
          const Icon = activity.icon;
          return (
            <div key={index} className="flex items-start mb-4">
              <div className="mr-3">
                <Icon className="h-5 w-5 text-gray-500" />
              </div>
              <div>
                <p className="text-gray-800">
                  <span className="font-medium">{activity.user}</span>{" "}
                  {activity.action}
                </p>
                <p className="text-sm text-gray-500">{activity.time}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AlertAndActivity;
