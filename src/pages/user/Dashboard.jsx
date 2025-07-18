// src/pages/student/UserDashboard.jsx (or wherever your Dashboard.jsx is located)
import React from "react";
import DashboardStatCard from "../../components/user/DashboardStatCard";
import NotificationCard from "../../components/user/NotificationCard";
import { studentDashboardStats, studentNotifications } from "../../constants";
import { LuCircleAlert } from "react-icons/lu"; 

const Dashboard = () => {
  return (
    <main className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold">Student Dashboard</h1>
        <p className="text-sm text-gray-500">Last updated: Today, 10:45 AM</p>
      </div>

      {/* Important Notifications Section */}
      <section className="bg-white p-4 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center mb-4">
          <LuCircleAlert className="w-6 h-6 text-red-500 mr-2" />
          Important Notifications
        </h2>
        <div className="grid grid-cols-1 gap-4">
          {studentNotifications.map((notification, index) => (
            <NotificationCard
              key={index}
              type={notification.type}
              message={notification.message}
              suggestion={notification.suggestion}
              time={notification.time}
              fine={notification.fine}
              returnDate={notification.returnDate}
            />
          ))}
        </div>
      </section>

      {/* Dashboard Stats Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {studentDashboardStats.map((stat, index) => (
          <DashboardStatCard
            key={index}
            title={stat.title}
            value={stat.value}
            subText={stat.subText}
            change={stat.change}
            progress={stat.progress}
            resources={stat.resources}
          />
        ))}
      </section>

      {/* You can add more sections here if needed for the dashboard */}
    </main>
  );
};

export default Dashboard;