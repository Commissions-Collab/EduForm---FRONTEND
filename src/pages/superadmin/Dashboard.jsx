import React from "react";
import StatCards from "./components/StatsCard";
import AlertAndActivity from "./components/AlertAndActivity";

const Dashboard = () => {
  return (
    <main>
      <StatCards />
      <AlertAndActivity />
    </main>
  );
};

export default Dashboard;