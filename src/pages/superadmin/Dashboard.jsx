import React from "react";
import StatCards from "../../components/superadmin/StatsCard";
import AlertAndActivity from "../../components/superadmin/AlertAndActivity";

const Dashboard = () => {
  return (
    <main>
      <StatCards />
      <AlertAndActivity />
    </main>
  );
};

export default Dashboard;
