// src/pages/UserAttendance.jsx
import React from "react";
import AttendanceCards from "../../components/user/AttendanceCards";

const UserAttendance = () => {
  return (
    <div className="p-5">
      
      {/* You can add other components or content specific to the User Attendance page here */}
      <AttendanceCards />
    </div>
  );
};

export default UserAttendance;