import React from "react";

const Attendance = () => {
  return (
    <main className="p-4">
      <div className="between">
        <div className="page-title">Daily Attendance (SF2): Grade 10-A</div>
        <div className="items-center">Date:</div>
      </div>
      <div className="mt-10 shad-container p-5 flex justify-between items-center">
        <div>
          <h2 className="card-title">Attendance Summary</h2>
        </div>
        <div className="flex justify-between gap-4">
          <p>Present</p>
          <p>Absent</p>
          <p>Late</p>
        </div>
      </div>
    </main>
  );
};

export default Attendance;
