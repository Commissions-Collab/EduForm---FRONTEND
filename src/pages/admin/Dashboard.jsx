import React from "react";
import { adminCards } from "../../constants";
import DashboardCard from "../../components/admin/DashboardCard";

const AdminDashboard = () => {
  return (
    <main className="p-4">
      <div className="page-title">Dashboard</div>
      <div className="mt-10 dashboard-grid">
        {adminCards.map((card) => (
          <DashboardCard
            key={card.id}
            title={card.title}
            type={card.type}
            data={card.data}
          />
        ))}
      </div>

      <div className="mt-10 dashboard-card">
        <h2 className="card-title">This Week's Summary</h2>
        <p className="text-gray-600"></p>
      </div>
    </main>
  );
};

export default AdminDashboard;
