import React, { useEffect } from "react";
import { useAdminStore } from "../../../stores/useAdminStore";
import BmiStudentTable from "../../../components/admin/BMIStudentTable";

const HealthProfile = () => {
  const { bmiStudents, bmiLoading, bmiError, fetchBmiStudents } =
    useAdminStore();

  useEffect(() => {
    fetchBmiStudents();
  }, []);

  return (
    <div className="p-6">
      <h1 className="page-title">Health Profile (BMI)</h1>
      <BmiStudentTable
        students={bmiStudents}
        loading={bmiLoading}
        error={bmiError}
      />
    </div>
  );
};

export default HealthProfile;
