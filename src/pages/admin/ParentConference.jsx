import React, { useEffect, useState } from "react";
import { Calendar, Printer, Menu, X } from "lucide-react";
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
    setIsSidebarOpen(false); // Close sidebar on mobile after selection
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
      <main className="p-3 sm:p-4 lg:p-6">
        <div className="text-center py-8">
          <div className="text-red-600 text-base sm:text-lg font-medium mb-2">
            Error
          </div>
          <p className="text-sm sm:text-base text-gray-600">{error}</p>
          <button
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            onClick={fetchConferenceDashboard}
          >
            Try Again
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="p-3 sm:p-4 lg:p-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            Parent-Teacher Conference
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            Manage student profiles and report cards
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <button
            className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-xs sm:text-sm"
            onClick={() => alert("Schedule feature coming soon!")}
          >
            <Calendar size={14} className="sm:w-4 sm:h-4" />
            <span>Schedule Conferences</span>
          </button>
          <button
            className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300 text-xs sm:text-sm"
            onClick={handlePrintAllReportCards}
            disabled={loading || conferenceStudents.length === 0}
          >
            <Printer size={14} className="sm:w-4 sm:h-4" />
            <span>Print All Report Cards</span>
          </button>
        </div>
      </div>

      {conferenceSection && (
        <div className="mb-4 sm:mb-6 text-xs sm:text-sm text-gray-600">
          <strong>Section (Advisory Class):</strong>{" "}
          <span className="font-medium">{conferenceSection}</span>
        </div>
      )}

      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed bottom-4 right-4 z-50 flex items-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors"
      >
        {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        <span className="text-sm font-medium">
          {isSidebarOpen ? "Close" : "Students"}
        </span>
      </button>

      <div className="relative lg:grid lg:grid-cols-12 lg:gap-4">
        {/* Sidebar Overlay for Mobile */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40  lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div
          className={`
            fixed lg:relative
            inset-y-0 left-0
            transform lg:transform-none
            transition-transform duration-300 ease-in-out
            ${
              isSidebarOpen
                ? "translate-x-0"
                : "-translate-x-full lg:translate-x-0"
            }
            w-80 lg:w-auto
            lg:col-span-4
            z-40 lg:z-0
            h-screen lg:h-auto
            overflow-y-auto lg:overflow-visible
          `}
        >
          <ConferenceSidebar
            loading={loading}
            students={filteredStudents}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedStudentId={selectedStudentId}
            onSelectStudent={handleSelectStudent}
          />
        </div>

        {/* Main Content */}
        <div className="lg:col-span-8">
          <ConferenceMain
            loading={loading}
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
