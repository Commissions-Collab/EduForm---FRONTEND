import {
  LuUserCheck,
  LuUserRoundX,
  LuClock,
  LuFileText,
  LuAward,
  LuBookOpen,
  LuBookText,
  LuCalendar,
} from "react-icons/lu";
import { Link } from "react-router-dom";

const DashboardCard = ({ title, type, data }) => {
  return (
    <div className="card">
      <h2 className="card-title">{title}</h2>

      {/* Attendance Card */}
      {type === "attendance" && (
        <>
          <div className="flex justify-between gap-3">
            {/* Present */}
            <div className="card-layout">
              <div className="card-status bg-green-100 text-green-600">
                <LuUserCheck className="w-6 h-6" />
              </div>
              <span className="card-text">Present</span>
              <span className="count">{data.present.count}</span>
              <span className="percent">{data.present.percent}%</span>
            </div>

            {/* Absent */}
            <div className="card-layout">
              <div className="card-status bg-red-100 text-red-500 ">
                <LuUserRoundX className="w-6 h-6" />
              </div>
              <span className="card-text">Absent</span>
              <span className="count">{data.absent.count}</span>
              <span className="percent">{data.absent.percent}%</span>
            </div>

            {/* Late */}
            <div className="card-layout">
              <div className="card-status bg-yellow-100 text-yellow-500">
                <LuClock className="w-6 h-6" />
              </div>
              <span className="card-text">Late</span>
              <span className="count">{data.late.count}</span>
              <span className="percent">{data.late.percent}%</span>
            </div>
          </div>
          <div className="mt-5">
            <Link to="/attendance">
              <button type="button" className="primary-button">
                Update Attendance (SF2)
              </button>
            </Link>
          </div>
          <div className="mt-3">
            <Link to="/monthlySummary">
              <button type="button" className="secondary-button">
                View Monthly Summary (SF4)
              </button>
            </Link>
          </div>
        </>
      )}

      {/* Academic Card */}
      {type === "academic" && (
        <>
          <div className="flex justify-between gap-3">
            <div className="card-layout">
              <div className="card-status text-purple-600 bg-purple-100 font-medium">
                <LuFileText className="w-6 h-6" />
              </div>
              <span className="card-text">Report cards</span>
              <span className="count">{data.reportsIssued}</span>
            </div>
            <div className="card-layout">
              <div className="card-status text-blue-500 bg-blue-100 font-medium">
                <LuAward className="w-6 h-6" />
              </div>
              <span className="card-text">Honors eligible</span>
              <span className="count">{data.honorEligible} </span>
            </div>
          </div>
          <div className="mt-5">
            <Link to="/academicRecords">
              <button type="button" className="dashboard-p-button">
                View Academic Records (SF9)
              </button>
            </Link>
          </div>
        </>
      )}

      {/* Resources & Calendar Card */}
      {type === "resources" && (
        <div className="space-y-3">
          <div className="resources-layout">
            <span className="book  text-red-500 font-medium">
              <LuBookOpen />
              <span>Textbook Overdues</span>
            </span>
            <span className="count">{data.textbookOverdues}</span>
          </div>
          <div className="resources-layout">
            <span className="book  text-yellow-500 font-medium">
              <LuBookText />
              <span> Pending Returns</span>
            </span>
            <span className="count">{data.pendingReturns}</span>
          </div>
          <hr className="border-t border-gray-300 my-6" />
          <div>
            <h4 className="card-text mb-5">Upcoming Events:</h4>
            <ul className="list-inside text-sm space-y-3">
              {data.upcomingEvents.map((event, index) => (
                <li key={index} className="flex items-start gap-3">
                  <LuCalendar className="w-6 h-6 text-[#3730A3] mt-1" />

                  <div className="flex flex-col">
                    <span className="text-[14px] text-gray-700 font-medium">
                      {event.name}
                    </span>
                    <span className="text-xs text-gray-500">{event.date}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardCard;
