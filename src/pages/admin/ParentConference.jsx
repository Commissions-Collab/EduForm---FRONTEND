import React, { useEffect, useState } from "react";
import {
  LuCalendar,
  LuMail,
  LuPrinter,
  LuSearch,
  LuUser,
  LuPhone,
  LuGraduationCap,
  LuCalendarDays,
  LuActivity,
  LuLoader,
} from "react-icons/lu";
import { useAdminStore } from "../../stores/useAdminStore";

const StudentCard = ({ student, isSelected, onClick }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "Excellent":
        return "bg-green-100 text-green-700";
      case "Good Standing":
        return "bg-blue-100 text-blue-700";
      case "At Risk":
        return "bg-yellow-100 text-yellow-700";
      case "Critical":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div
      className={`flex items-center justify-between border-b pb-4 last:border-b-0 cursor-pointer hover:bg-gray-50 p-3 rounded transition-all duration-200 ${
        isSelected ? "bg-blue-50 border-blue-200" : ""
      }`}
      onClick={() => onClick(student.id)}
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
          <LuUser className="w-5 h-5 text-gray-500" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-900">
            {student.name}
          </span>
          <span className="text-xs text-gray-500">{student.guardian}</span>
        </div>
      </div>
      <span
        className={`text-xs px-3 py-1 rounded-full font-medium ${getStatusColor(
          student.status
        )}`}
      >
        {student.status}
      </span>
    </div>
  );
};

const ProfileSection = ({ title, children, icon: Icon }) => (
  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
    <div className="flex items-center gap-2">
      {Icon && <Icon className="w-5 h-5 text-gray-600" />}
      <h4 className="font-semibold text-gray-800">{title}</h4>
    </div>
    <div className="space-y-2">{children}</div>
  </div>
);

const StudentProfile = ({ student, onContactParent, onPrintReportCard }) => {
  if (!student) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        <div className="text-center">
          <LuUser className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p className="text-lg font-medium">No Student Selected</p>
          <p className="text-sm">
            Choose a student from the list to view their profile
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Student Header */}
      <div className="border-b pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">{student.name}</h3>
            <p className="text-sm text-gray-600">
              Student ID: {student.student_id}
            </p>
          </div>
          <div className="flex space-x-2">
            <button
              className="gray-button"
              onClick={onContactParent}
              disabled={!student.guardian_email}
            >
              <LuMail size={15} />
              <span className="ml-2">Contact Parent</span>
            </button>
            <button
              className="flex text-[12.5px] bg-[#E0E7FF] hover:bg-[#C7D2FE] text-[#3730A3] font-semibold py-2 px-4 rounded-lg transition-all duration-200"
              onClick={() => onPrintReportCard(student.id)}
            >
              <LuPrinter size={15} />
              <span className="ml-2">Print Report Card</span>
            </button>
          </div>
        </div>
      </div>

      {/* Guardian Information */}
      <ProfileSection title="Guardian Information" icon={LuUser}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <LuUser className="w-4 h-4 text-gray-500" />
            <span className="text-sm">
              <strong>Name:</strong> {student.guardian || "Not provided"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <LuMail className="w-4 h-4 text-gray-500" />
            <span className="text-sm">
              <strong>Email:</strong> {student.guardian_email || "Not provided"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <LuPhone className="w-4 h-4 text-gray-500" />
            <span className="text-sm">
              <strong>Phone:</strong> {student.guardian_phone || "Not provided"}
            </span>
          </div>
        </div>
      </ProfileSection>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Academic Performance */}
        <ProfileSection title="Academic Performance" icon={LuGraduationCap}>
          {student.grades && student.grades.length > 0 ? (
            <div className="space-y-2">
              {student.grades.map((grade, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center py-1"
                >
                  <span className="text-sm font-medium">{grade.subject}:</span>
                  <span
                    className={`text-sm font-semibold px-2 py-1 rounded ${
                      grade.average_grade >= 90
                        ? "bg-green-100 text-green-700"
                        : grade.average_grade >= 85
                        ? "bg-blue-100 text-blue-700"
                        : grade.average_grade >= 75
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {grade.average_grade}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 italic">No grades available</p>
          )}
        </ProfileSection>

        {/* Attendance Summary */}
        <ProfileSection title="Attendance Summary" icon={LuCalendarDays}>
          {student.attendance_summary ? (
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-green-100 p-3 rounded">
                  <div className="text-lg font-bold text-green-700">
                    {student.attendance_summary.present_percent}%
                  </div>
                  <div className="text-xs text-green-600">Present</div>
                </div>
                <div className="bg-red-100 p-3 rounded">
                  <div className="text-lg font-bold text-red-700">
                    {student.attendance_summary.absent_percent}%
                  </div>
                  <div className="text-xs text-red-600">Absent</div>
                </div>
                <div className="bg-yellow-100 p-3 rounded">
                  <div className="text-lg font-bold text-yellow-700">
                    {student.attendance_summary.late_percent}%
                  </div>
                  <div className="text-xs text-yellow-600">Late</div>
                </div>
              </div>

              {student.attendance_summary.recent_absents &&
                student.attendance_summary.recent_absents.length > 0 && (
                  <div>
                    <h5 className="text-sm font-medium text-gray-700 mb-2">
                      Recent Absences:
                    </h5>
                    <div className="space-y-1">
                      {student.attendance_summary.recent_absents
                        .slice(0, 3)
                        .map((absence, index) => (
                          <div
                            key={index}
                            className="text-xs text-gray-600 bg-white p-2 rounded border"
                          >
                            {new Date(
                              absence.attendance_date
                            ).toLocaleDateString()}
                          </div>
                        ))}
                    </div>
                  </div>
                )}
            </div>
          ) : (
            <p className="text-sm text-gray-500 italic">
              No attendance data available
            </p>
          )}
        </ProfileSection>
      </div>

      {/* Health Profile */}
      {student.bmi_records && student.bmi_records.length > 0 && (
        <ProfileSection title="Health Profile (BMI Records)" icon={LuActivity}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="text-left p-2 font-medium">Quarter</th>
                  <th className="text-left p-2 font-medium">Height (cm)</th>
                  <th className="text-left p-2 font-medium">Weight (kg)</th>
                  <th className="text-left p-2 font-medium">BMI</th>
                  <th className="text-left p-2 font-medium">Category</th>
                </tr>
              </thead>
              <tbody>
                {student.bmi_records.map((bmi, index) => (
                  <tr key={index} className="border-b">
                    <td className="p-2">Q{bmi.quarter_id}</td>
                    <td className="p-2">{bmi.height_cm || "N/A"}</td>
                    <td className="p-2">{bmi.weight_kg || "N/A"}</td>
                    <td className="p-2">{bmi.bmi || "N/A"}</td>
                    <td className="p-2">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          bmi.bmi_category === "Normal"
                            ? "bg-green-100 text-green-700"
                            : bmi.bmi_category === "Underweight"
                            ? "bg-blue-100 text-blue-700"
                            : bmi.bmi_category === "Overweight"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {bmi.bmi_category || "N/A"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ProfileSection>
      )}
    </div>
  );
};

const ParentConference = () => {
  const {
    conferenceStudents,
    fetchConferenceDashboard,
    conferenceSection,
    fetchConferenceStudentProfile,
    selectedConferenceStudent,
    downloadStudentReportCard,
    downloadAllStudentReportCards,
    conferenceLoading,
    conferenceError,
  } = useAdminStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState(null);

  useEffect(() => {
    fetchConferenceDashboard();
  }, []);

  useEffect(() => {
    const filtered = conferenceStudents.filter((student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredStudents(filtered);
  }, [searchTerm, conferenceStudents]);

  const handleSelectStudent = (studentId) => {
    setSelectedStudentId(studentId);
    fetchConferenceStudentProfile(studentId);
  };

  const handleContactParent = () => {
    if (!selectedConferenceStudent?.guardian_email) {
      alert("No email address available for this student's guardian.");
      return;
    }
    window.location.href = `mailto:${selectedConferenceStudent.guardian_email}`;
  };

  const handlePrintReportCard = (studentId) => {
    downloadStudentReportCard(studentId);
  };

  const handlePrintAllReportCards = () => {
    downloadAllStudentReportCards();
  };

  if (conferenceError) {
    return (
      <main className="p-4">
        <div className="text-center py-8">
          <div className="text-red-600 text-lg font-medium mb-2">Error</div>
          <p className="text-gray-600">{conferenceError}</p>
          <button
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={fetchConferenceDashboard}
          >
            Try Again
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="p-4">
      <div className="between">
        <div className="page-title">Parent-Teacher Conference</div>
        <div className="items-center">
          <div className="flex space-x-3">
            <button
              className="gray-button"
              onClick={() => alert("Schedule feature coming soon!")}
            >
              <LuCalendar size={15} />
              <span className="ml-2">Schedule Conferences</span>
            </button>
            <button
              className="brand-button"
              onClick={handlePrintAllReportCards}
              disabled={conferenceLoading || conferenceStudents.length === 0}
            >
              <LuPrinter size={15} />
              <span className="ml-2">Print All Report Cards</span>
            </button>
          </div>
        </div>
      </div>

      {conferenceSection && (
        <div className="mt-4 text-sm text-gray-600">
          <strong>Section (Advisory Class) :</strong>{" "}
          <span className="font-medium">{conferenceSection}</span>
        </div>
      )}

      <div className="mt-5">
        <div className="grid grid-cols-12 gap-4 max-h-screen">
          {/* Sidebar: Student List */}
          <div className="col-span-4 shad-container p-6 space-y-5">
            <div className="border-b pb-4">
              <h2 className="text-xl font-semibold">
                Students ({conferenceStudents.length})
              </h2>
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LuSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm"
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="w-full space-y-2 overflow-y-auto h-[450px]">
              {conferenceLoading ? (
                <div className="flex justify-center py-8">
                  <LuLoader className="w-6 h-6 text-blue-700 animate-spin" />
                </div>
              ) : filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <StudentCard
                    key={student.id}
                    student={student}
                    isSelected={selectedStudentId === student.id}
                    onClick={handleSelectStudent}
                  />
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <LuUser className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p>
                    {searchTerm
                      ? "No students match your search"
                      : "No students available"}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Main: Student 360 Profile */}
          <div className="col-span-8 shad-container">
            <div className="flex justify-between p-6 border-b">
              <h2 className="text-xl font-semibold">Student 360° Profile</h2>
            </div>

            {conferenceLoading ? (
              <div className="flex justify-center items-center h-96">
                <LuLoader className="w-6 h-6 text-blue-700 animate-spin" />
              </div>
            ) : (
              <StudentProfile
                student={selectedConferenceStudent}
                onContactParent={handleContactParent}
                onPrintReportCard={handlePrintReportCard}
              />
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default ParentConference;
