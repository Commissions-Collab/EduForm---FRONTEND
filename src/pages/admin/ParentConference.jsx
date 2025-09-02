import React, { useEffect, useState } from "react";
import { LuCalendar, LuPrinter } from "react-icons/lu";
import { useAdminStore } from "../../stores/admin";
import ConferenceMain from "../../components/admin/ConferenceMain";
import ConferenceSidebar from "../../components/admin/ConferenceSidebar";

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
          <strong>Section (Advisory Class):</strong>{" "}
          <span className="font-medium">{conferenceSection}</span>
        </div>
      )}

      <div className="mt-5">
        <div className="grid grid-cols-12 gap-4 max-h-screen">
          <ConferenceSidebar
            conferenceLoading={conferenceLoading}
            students={filteredStudents}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedStudentId={selectedStudentId}
            onSelectStudent={handleSelectStudent}
          />
          <ConferenceMain
            conferenceLoading={conferenceLoading}
            selectedConferenceStudent={selectedConferenceStudent}
            onContactParent={handleContactParent}
            onPrintReportCard={handlePrintReportCard}
          />
        </div>
      </div>
    </main>
  );
};

export default ParentConference;
