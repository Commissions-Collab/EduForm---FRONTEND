import {
  LuUserCheck,
  LuUserRoundX,
  LuClock,
  LuFileText,
  LuAward,
  LuBookOpen,
  LuBookText,
  LuCalendar,
  LuLoader,
} from "react-icons/lu";
import { Link } from "react-router-dom";

const DashboardCard = ({ title, type, data, loading = false }) => {
  // Loading skeleton component
  const LoadingSkeleton = ({ type }) => {
    if (type === "attendance") {
      return (
        <div className="animate-pulse">
          <div className="flex justify-between gap-3">
            {[1, 2, 3].map((item) => (
              <div key={item} className="card-layout">
                <div className="card-status bg-gray-200">
                  <div className="w-6 h-6 bg-gray-300 rounded"></div>
                </div>
                <div className="h-4 bg-gray-200 rounded mb-1"></div>
                <div className="h-6 bg-gray-300 rounded mb-1"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
          <div className="mt-5 space-y-3">
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
        </div>
      );
    }
    
    if (type === "academic") {
      return (
        <div className="animate-pulse">
          <div className="flex justify-between gap-3">
            {[1, 2].map((item) => (
              <div key={item} className="card-layout">
                <div className="card-status bg-gray-200">
                  <div className="w-6 h-6 bg-gray-300 rounded"></div>
                </div>
                <div className="h-4 bg-gray-200 rounded mb-1"></div>
                <div className="h-6 bg-gray-300 rounded"></div>
              </div>
            ))}
          </div>
          <div className="mt-5">
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
        </div>
      );
    }
    
    if (type === "resources") {
      return (
        <div className="animate-pulse space-y-3">
          <div className="resources-layout">
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 bg-gray-300 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-32"></div>
            </div>
            <div className="h-6 bg-gray-300 rounded w-8"></div>
          </div>
          <div className="resources-layout">
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 bg-gray-300 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-32"></div>
            </div>
            <div className="h-6 bg-gray-300 rounded w-8"></div>
          </div>
          <hr className="border-t border-gray-300 my-6" />
          <div>
            <div className="h-4 bg-gray-200 rounded w-32 mb-5"></div>
            <div className="space-y-3">
              {[1, 2, 3].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-gray-300 rounded mt-1"></div>
                  <div className="flex flex-col space-y-1">
                    <div className="h-4 bg-gray-200 rounded w-40"></div>
                    <div className="h-3 bg-gray-200 rounded w-24"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="card relative">
      <div className="flex items-center justify-between">
        <h2 className="card-title">{title}</h2>
        {loading && (
          <LuLoader className="w-4 h-4 animate-spin text-indigo-600" />
        )}
      </div>

      {loading ? (
        <LoadingSkeleton type={type} />
      ) : (
        <>
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
                  <button type="button" className="primary-button w-full">
                    Update Attendance (SF2)
                  </button>
                </Link>
              </div>
              <div className="mt-3">
                <Link to="/monthlySummary">
                  <button type="button" className="secondary-button w-full">
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
                  <span className="count">{data.honorEligible}</span>
                </div>
              </div>
              
              {/* Grades Submitted Progress */}
              {data.gradesSubmitted !== undefined && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Grades Submitted</span>
                    <span className="text-sm font-semibold text-indigo-600">
                      {data.gradesSubmitted}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(data.gradesSubmitted, 100)}%` }}
                    ></div>
                  </div>
                </div>
              )}

              <div className="mt-5">
                <Link to="/academicRecords">
                  <button type="button" className="dashboard-p-button w-full">
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
                <span className="book text-red-500 font-medium">
                  <LuBookOpen />
                  <span>Textbook Overdues</span>
                </span>
                <span className="count">{data.textbookOverdues}</span>
              </div>
              <div className="resources-layout">
                <span className="book text-yellow-500 font-medium">
                  <LuBookText />
                  <span>Pending Returns</span>
                </span>
                <span className="count">{data.pendingReturns}</span>
              </div>
              <hr className="border-t border-gray-300 my-6" />
              <div>
                <h4 className="card-text mb-5">Upcoming Events:</h4>
                {data.upcomingEvents && data.upcomingEvents.length > 0 ? (
                  <ul className="list-inside text-sm space-y-3">
                    {data.upcomingEvents.slice(0, 5).map((event, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <LuCalendar className="w-5 h-5 text-[#3730A3] mt-1 flex-shrink-0" />
                        <div className="flex flex-col min-w-0">
                          <span className="text-[14px] text-gray-700 font-medium truncate">
                            {event.name}
                          </span>
                          <span className="text-xs text-gray-500">{event.date}</span>
                          {event.type && (
                            <span className="text-xs text-indigo-600 capitalize">
                              {event.type}
                            </span>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-center py-6 text-gray-500">
                    <LuCalendar className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p className="text-sm">No upcoming events</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default DashboardCard;