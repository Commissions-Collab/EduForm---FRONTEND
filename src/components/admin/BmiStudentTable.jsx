import React from "react";
import { ClipLoader } from "react-spinners";

const BmiStudentTable = ({ students, loading, error }) => {
  return (
    <div className="mt-8 overflow-x-auto bg-white rounded-lg shadow-md min-h-[400px]">
      <table className="min-w-full divide-y divide-gray-20">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Name
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Height (cm)
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Weight (kg)
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              BMI
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Status
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {loading ? (
            <tr>
              <td colSpan={7} className="text-center py-20">
                <ClipLoader size={30} color="#4F46E5" />
              </td>
            </tr>
          ) : error ? (
            <tr>
              <td
                colSpan="5"
                className="px-6 py-6 text-center text-red-500 font-medium"
              >
                {error}
              </td>
            </tr>
          ) : students.length === 0 ? (
            <tr>
              <td
                colSpan="5"
                className="px-6 py-6 text-center text-gray-500 font-medium"
              >
                No BMI records found.
              </td>
            </tr>
          ) : (
            students.map((student) => (
              <tr key={student.student_id} className="hover:bg-gray-50">
                <td className="px-6 py-3">{student.name}</td>
                <td className="px-6 py-3">{student.height ?? "-"}</td>
                <td className="px-6 py-3">{student.weight ?? "-"}</td>
                <td className="px-6 py-3">{student.bmi ?? "-"}</td>
                <td className="px-6 py-3">{student.bmi_status ?? "-"}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default BmiStudentTable;
