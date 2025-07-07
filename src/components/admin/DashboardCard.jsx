import {
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaFileAlt,
  FaAward,
  FaBookOpen,
} from "react-icons/fa";

const DashboardCard = ({ title, type, data }) => {
  return (
    <div className="dashboard-card">
      <h2 className="card-title">{title}</h2>

      {/* Attendance Card */}
      {type === "attendance" && (
        <>
          <div className="flex justify-between gap-3">
            {/* Present */}
            <div className="flex flex-col items-center p-3 rounded-lg flex-1">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-green-100 text-green-600 text-lg">
                <FaCheckCircle className="w-6 h-6" />
              </div>
              <span className="attendance-status">Present</span>
              <span className="count">{data.present.count}</span>
              <span className="percent">{data.present.percent}%</span>
            </div>

            {/* Absent */}
            <div className="flex flex-col items-center p-3 rounded-lg flex-1">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-red-100 text-red-500 text-lg">
                <FaTimesCircle className="w-6 h-6" />
              </div>
              <span className="attendance-status">Absent</span>
              <span className="count">{data.absent.count}</span>
              <span className="percent">{data.absent.percent}%</span>
            </div>

            {/* Late */}
            <div className="flex flex-col items-center  p-3 rounded-lg flex-1">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-yellow-100 text-yellow-500 text-lg">
                <FaClock className="w-6 h-6" />
              </div>
              <span className="attendance-status">Late</span>
              <span className="count">{data.late.count}</span>
              <span className="percent">{data.late.percent}%</span>
            </div>
          </div>
          <div className="mt-5">
            <button
              type="button"
              className="w-full bg-[#E0E7FF] hover:bg-[#C7D2FE] text-[#3730A3] text-lg font-semibold py-3 px-4 rounded-lg transition-all duration-200 "
            >
              Update Attendance (SF2)
            </button>
          </div>
          <div className="mt-3">
            <button
              type="button"
              className="w-full border border-[#E0E7FF] hover:bg-[#C7D2FE]/20 text-[#3730A3] text-lg font-semibold py-3 px-4 rounded-lg transition-all duration-200 "
            >
              View Monthly Summary (SF4)
            </button>
          </div>
        </>
      )}

      {/* Academic Card */}
      {type === "academic" && (
        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-blue-600 font-medium">
              <FaFileAlt /> Report Cards Issued
            </span>
            <span>{data.reportsIssued}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-green-500 font-medium">
              <FaAward /> Honor Eligible
            </span>
            <span>{data.honorEligible}</span>
          </div>
        </div>
      )}

      {/* Resources & Calendar Card */}
      {type === "resources" && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-red-500 font-medium">
              <FaBookOpen /> Textbook Overdues
            </span>
            <span>{data.textbookOverdues}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-yellow-500 font-medium">
              Pending Returns
            </span>
            <span>{data.pendingReturns}</span>
          </div>
          <div>
            <h4 className="text-sm font-medium mb-1 text-gray-700">
              Upcoming Events:
            </h4>
            <ul className="list-disc list-inside text-gray-600 text-sm space-y-1">
              {data.upcomingEvents.map((event, index) => (
                <li key={index}>{event}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardCard;
