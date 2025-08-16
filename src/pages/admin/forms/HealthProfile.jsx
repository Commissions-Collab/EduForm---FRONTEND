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
    <div className="bg-gray-50  p-4 sm:p-6">
      <div className="mb-6">
        <h1 className="page-title">Health Profile (SF)</h1>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full font-medium">
            SF8
          </span>
        </div>
      </div>

      <BmiStudentTable
        students={bmiStudents}
        loading={bmiLoading}
        error={bmiError}
      />
    </div>
  );
};

export default HealthProfile;
