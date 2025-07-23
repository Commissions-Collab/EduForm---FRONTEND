// src/pages/Grades.jsx
import React from "react";
// Import the new component (which now uses Zustand internally)
import StudentGradesTable from "../../components/user/StudentGradesTable";

const Grades = () => {
    return (
    <div className="overflow-x-auto">
      {/* This component gets its data from the Zustand store */}
      <StudentGradesTable pageTitle="My Quarterly Grades" /> {/* */}
    </div>
    );
};

export default Grades;