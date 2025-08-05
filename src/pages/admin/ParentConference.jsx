import React, { useEffect, useState } from "react";
import {
  LuCalendar,
  LuMail,
  LuPrinter,
  LuSearch,
  LuUser,
} from "react-icons/lu";
import { useAdminStore } from "../../stores/useAdminStore";

const ParentConference = () => {
  const {
    conferenceStudents,
    fetchConferenceDashboard,
    conferenceSection,
    fetchConferenceStudent,
    selectedConferenceStudent,
    downloadStudentReportCard,
    downloadAllReportCards,
  } = useAdminStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredStudents, setFilteredStudents] = useState([]);

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
    fetchConferenceStudent(studentId);
  };

  const handleContactParent = () => {
    if (!selectedConferenceStudent?.guardian_email) return;
    window.location.href = `mailto:${selectedConferenceStudent.guardian_email}`;
  };

  return (
    <main className="p-4">
      <div className="between">
        <div className="page-title">
          Parent-Teacher Conference Prep: {conferenceSection}
        </div>
        <div className="items-center">
          <div className="flex space-x-3">
            <button
              className="gray-button"
              onClick={() => alert("Schedule feature coming soon!")}
            >
              <LuCalendar size={15} />
              <span className="ml-2">Schedule Conferences</span>
            </button>
            <button className="brand-button" onClick={downloadAllReportCards}>
              <LuPrinter size={15} />
              <span className="ml-2">Print All Report Cards</span>
            </button>
          </div>
        </div>
      </div>

      <div className="mt-5">
        <div className="grid grid-cols-12 gap-4 max-h-screen">
          {/* Sidebar: Student List */}
          <div className="col-span-4 shad-container p-8 space-y-5">
            <div className="border-b-1 border-gray-200">
              <h2 className="text-xl font-semibold">Students</h2>
            </div>
            <div>
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LuSearch />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm"
                  placeholder="Search students..."
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="w-full max-w-md mx-auto space-y-4 overflow-y-auto h-[450px]">
              {filteredStudents.map((student, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between border-b pb-4 last:border-b-0 cursor-pointer hover:bg-gray-50 p-2 rounded"
                  onClick={() => handleSelectStudent(student.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <LuUser className="w-5 h-5 text-gray-500" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-900">
                        {student.name}
                      </span>
                      <span className="text-xs text-gray-500">
                        {student.guardian}
                      </span>
                    </div>
                  </div>
                  <span
                    className={`text-xs px-3 py-1 rounded-full font-medium ${
                      student.status === "Excellent"
                        ? "bg-green-100 text-green-700"
                        : student.status === "Good Standing"
                        ? "bg-blue-100 text-blue-700"
                        : student.status === "At Risk"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {student.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Main: Student 360 Profile */}
          <div className="col-span-8 shad-container space-y-5">
            <div className="flex justify-between p-8 border-b-1 border-gray-200">
              <h2 className="text-xl font-semibold">Student 360° Profile</h2>
              <div className="items-center">
                <div className="flex space-x-3">
                  <button className="gray-button" onClick={handleContactParent}>
                    <LuMail size={15} />
                    <span className="ml-2">Contact Parent</span>
                  </button>
                  <button
                    className="flex text-[12.5px] bg-[#E0E7FF] hover:bg-[#C7D2FE] text-[#3730A3] font-semibold py-2 px-4 rounded-lg transition-all duration-200"
                    onClick={() =>
                      selectedConferenceStudent &&
                      downloadStudentReportCard(selectedConferenceStudent.id)
                    }
                  >
                    <LuPrinter size={15} />
                    <span className="ml-2">Print Report Card</span>
                  </button>
                </div>
              </div>
            </div>

            {selectedConferenceStudent ? (
              <div className="p-8 space-y-4">
                <h3 className="text-lg font-semibold">
                  {selectedConferenceStudent.name}
                </h3>
                <p className="text-sm text-gray-600">
                  Guardian: {selectedConferenceStudent.guardian}
                </p>
                <p className="text-sm text-gray-600">
                  Email: {selectedConferenceStudent.guardian_email}
                </p>
                <p className="text-sm text-gray-600">
                  Phone: {selectedConferenceStudent.guardian_phone}
                </p>

                <div className="mt-4">
                  <h4 className="font-semibold">Attendance Summary</h4>
                  <ul className="text-sm list-disc pl-5">
                    <li>
                      Present:{" "}
                      {
                        selectedConferenceStudent.attendance_summary
                          .present_percent
                      }
                      %
                    </li>
                    <li>
                      Absent:{" "}
                      {
                        selectedConferenceStudent.attendance_summary
                          .absent_percent
                      }
                      %
                    </li>
                    <li>
                      Late:{" "}
                      {
                        selectedConferenceStudent.attendance_summary
                          .late_percent
                      }
                      %
                    </li>
                  </ul>
                </div>

                <div className="mt-4">
                  <h4 className="font-semibold">Grades</h4>
                  <ul className="text-sm list-disc pl-5">
                    {selectedConferenceStudent.grades?.map((grade, index) => (
                      <li key={index}>
                        {grade.subject}: {grade.average_grade}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-4">
                  <h4 className="font-semibold">BMI Records</h4>
                  <ul className="text-sm list-disc pl-5">
                    {selectedConferenceStudent.bmi_records?.map(
                      (bmi, index) => (
                        <li key={index}>
                          Quarter {bmi.quarter_id}: {bmi.bmi} (
                          {bmi.bmi_category})
                        </li>
                      )
                    )}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="p-8 text-gray-400 italic">
                Select a student to view their profile.
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default ParentConference;
