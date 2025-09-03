import React, { useEffect, useState } from "react";
import { LuCalendar, LuPrinter } from "react-icons/lu";
import ConferenceMain from "../../components/admin/ConferenceMain";
import ConferenceSidebar from "../../components/admin/ConferenceSidebar";
import useParentConferenceStore from "../../stores/admin/parentConference";

const ParentConference = () => {
  const {
    conferenceStudents,
    fetchConferenceDashboard,
    conferenceSection,
    fetchConferenceStudentProfile,
    selectedConferenceStudent,
    downloadStudentReportCard,
    downloadAllStudentReportCards,
    loading,
    error,
  } = useParentConferenceStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState(null);

  useEffect(() => {
    fetchConferenceDashboard();
  }, [fetchConferenceDashboard]);

  useEffect(() => {
    const filtered = conferenceStudents.filter((student) =>
      (student.name || "").toLowerCase().includes(searchTerm.toLowerCase())
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

  if (error) {
    return (
      <main className="p-4 lg:p-6">
        <div className="text-center py-8">
          <div className="text-red-600 text-lg font-medium mb-2">Error</div>
          <p className="text-gray-600">{error}</p>
          <button
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            onClick={fetchConferenceDashboard}
          >
            Try Again
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="p-4 lg:p-6 bg-gray-50/50">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Parent-Teacher Conference
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage student profiles and report cards
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            onClick={() => alert("Schedule feature coming soon!")}
          >
            <LuCalendar size={15} />
            <span>Schedule Conferences</span>
          </button>
          <button
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300"
            onClick={handlePrintAllReportCards}
            disabled={loading || conferenceStudents.length === 0}
          >
            <LuPrinter size={15} />
            <span>Print All Report Cards</span>
          </button>
        </div>
      </div>

      {conferenceSection && (
        <div className="mb-6 text-sm text-gray-600">
          <strong>Section (Advisory Class):</strong>{" "}
          <span className="font-medium">{conferenceSection}</span>
        </div>
      )}

      <div className="grid grid-cols-12 gap-4 max-h-[calc(100vh-200px)]">
        <ConferenceSidebar
          loading={loading}
          students={filteredStudents}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedStudentId={selectedStudentId}
          onSelectStudent={handleSelectStudent}
        />
        <ConferenceMain
          loading={loading}
          selectedConferenceStudent={selectedConferenceStudent}
          onContactParent={handleContactParent}
          onPrintReportCard={handlePrintReportCard}
        />
      </div>
    </main>
  );
};

export default ParentConference;
