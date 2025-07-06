import React from "react";

const AdminDashboard = () => {
  return (
    <main>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ">
        {/* Container 1 */}
        <div className="dashboard-card">
          <h2 className="card-title">Today's Attendance</h2>
          <p className="text-gray-600"></p>
        </div>

        {/* Container 2 */}
        <div className="dashboard-card">
          <h2 className="card-title">Academic Status</h2>
          <p className="text-gray-600"></p>
        </div>

        {/* Container 3 */}
        <div className="dashboard-card">
          <h2 className="card-title">Resources and Calendar</h2>
          <p className="text-gray-600"></p>
        </div>
      </div>

      <div className="mt-10 dashboard-card">
        <h2 className="card-title">This Week's Summary</h2>
        <p className="text-gray-600"></p>
      </div>
    </main>
  );
};

export default AdminDashboard;
