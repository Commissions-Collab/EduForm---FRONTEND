import { useEffect } from "react";
import PromotionCards from "../../../components/admin/PromotionCards";
import PromotionTable from "../../../components/admin/PromotionTable";
import {
  BadgeAlert,
  Filter,
  AlertTriangle,
  Clock,
  XCircle,
} from "lucide-react";
import usePromotionStore from "../../../stores/admin/promotionStore";
import useFilterStore from "../../../stores/admin/filterStore";

const PromotionReport = () => {
  const {
    fetchPromotionData,
    isPromotionAccessible,
    promotionMessage,
    promotionWarning,
    overallPromotionStats,
    loading,
  } = usePromotionStore();

  const { globalFilters } = useFilterStore();
  const hasAllFilters = globalFilters.academicYearId && globalFilters.sectionId;

  useEffect(() => {
    if (hasAllFilters) {
      fetchPromotionData();
    }
  }, [
    fetchPromotionData,
    globalFilters.academicYearId,
    globalFilters.sectionId,
  ]);

  const getWarningIcon = (type) => {
    switch (type) {
      case "incomplete":
        return Clock;
      case "failing":
        return XCircle;
      case "mixed":
        return AlertTriangle;
      default:
        return BadgeAlert;
    }
  };

  const getWarningColors = (type) => {
    switch (type) {
      case "incomplete":
        return {
          bg: "from-blue-50 to-indigo-50",
          border: "border-blue-200",
          iconBg: "bg-blue-100",
          iconColor: "text-blue-600",
          titleColor: "text-blue-800",
          textColor: "text-blue-700",
        };
      case "failing":
        return {
          bg: "from-red-50 to-rose-50",
          border: "border-red-200",
          iconBg: "bg-red-100",
          iconColor: "text-red-600",
          titleColor: "text-red-800",
          textColor: "text-red-700",
        };
      case "mixed":
        return {
          bg: "from-orange-50 to-amber-50",
          border: "border-orange-200",
          iconBg: "bg-orange-100",
          iconColor: "text-orange-600",
          titleColor: "text-orange-800",
          textColor: "text-orange-700",
        };
      default:
        return {
          bg: "from-amber-50 to-yellow-50",
          border: "border-amber-200",
          iconBg: "bg-amber-100",
          iconColor: "text-amber-600",
          titleColor: "text-amber-800",
          textColor: "text-amber-700",
        };
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <main className="p-3 sm:p-4 lg:p-6">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Promotion Reports
              </h1>
              <div className="flex items-center gap-2 text-sm text-gray-600 mt-2">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full font-medium">
                  SF5
                </span>
                {!hasAllFilters && (
                  <span className="px-2 py-1 bg-amber-100 text-amber-800 rounded-full font-medium text-xs">
                    Please select filters from header
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Missing Filters */}
        {!hasAllFilters && (
          <div className="mt-6 bg-white rounded-xl p-8 border border-gray-200 shadow-sm text-center">
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Filter className="w-6 h-6 text-gray-400" />
            </div>
            <h3 className="text-gray-700 font-medium">
              Please select Academic Year and Section to view Promotion Reports
            </h3>
          </div>
        )}

        {/* API Error */}
        {promotionMessage && hasAllFilters && (
          <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl border-2 border-amber-200 p-6 shadow-lg mb-8">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                  <BadgeAlert className="w-6 h-6 text-amber-600" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-amber-800 mb-2">
                  {promotionMessage.title}
                </h3>
                <p className="text-amber-700">{promotionMessage.content}</p>
              </div>
            </div>
          </div>
        )}

        {/* Warning for Section Not Ready */}
        {promotionWarning && hasAllFilters && !loading && (
          <div
            className={`bg-gradient-to-br ${
              getWarningColors(promotionWarning.type).bg
            } rounded-xl border-2 ${
              getWarningColors(promotionWarning.type).border
            } p-6 shadow-lg mb-8`}
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div
                  className={`w-14 h-14 ${
                    getWarningColors(promotionWarning.type).iconBg
                  } rounded-full flex items-center justify-center`}
                >
                  {(() => {
                    const IconComponent = getWarningIcon(promotionWarning.type);
                    return (
                      <IconComponent
                        className={`w-7 h-7 ${
                          getWarningColors(promotionWarning.type).iconColor
                        }`}
                      />
                    );
                  })()}
                </div>
              </div>
              <div className="flex-1">
                <h3
                  className={`text-xl font-bold ${
                    getWarningColors(promotionWarning.type).titleColor
                  } mb-3`}
                >
                  {promotionWarning.title}
                </h3>
                <p
                  className={`${
                    getWarningColors(promotionWarning.type).textColor
                  } text-base leading-relaxed mb-4`}
                >
                  {promotionWarning.content}
                </p>

                {/* Additional warning details */}
                {(promotionWarning.issueCount ||
                  promotionWarning.affectedStudents ||
                  promotionWarning.details) && (
                  <div
                    className={`${
                      getWarningColors(promotionWarning.type).iconBg
                    } rounded-lg p-4 mt-4`}
                  >
                    <h4
                      className={`font-semibold ${
                        getWarningColors(promotionWarning.type).titleColor
                      } mb-2`}
                    >
                      Details:
                    </h4>
                    {promotionWarning.issueCount && (
                      <p
                        className={`${
                          getWarningColors(promotionWarning.type).textColor
                        } text-sm mb-1`}
                      >
                        • Issues found: {promotionWarning.issueCount}
                      </p>
                    )}
                    {promotionWarning.affectedStudents && (
                      <p
                        className={`${
                          getWarningColors(promotionWarning.type).textColor
                        } text-sm mb-1`}
                      >
                        • Students affected: {promotionWarning.affectedStudents}
                      </p>
                    )}
                    {promotionWarning.details && (
                      <p
                        className={`${
                          getWarningColors(promotionWarning.type).textColor
                        } text-sm`}
                      >
                        • {promotionWarning.details}
                      </p>
                    )}
                  </div>
                )}

                <div
                  className={`mt-4 p-3 ${
                    getWarningColors(promotionWarning.type).iconBg
                  } rounded-lg border-l-4 ${
                    getWarningColors(promotionWarning.type).border
                  }`}
                >
                  <p
                    className={`text-sm font-medium ${
                      getWarningColors(promotionWarning.type).titleColor
                    }`}
                  >
                    📋 Action Required: Please ensure all student grades are
                    complete and finalized before generating promotion reports.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Success State */}
        {hasAllFilters && isPromotionAccessible && !promotionWarning && (
          <div className="space-y-8">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Promotion Summary
              </h2>
              <PromotionCards stats={overallPromotionStats} />
            </div>
            <div>
              <PromotionTable />
            </div>
          </div>
        )}

        {/* Skeleton Loading */}
        {loading && hasAllFilters && (
          <div className="space-y-8">
            {/* Skeleton for PromotionCards */}
            <div>
              <div className="h-6 w-48 bg-gray-200 animate-pulse rounded mb-4"></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, index) => (
                  <div
                    key={index}
                    className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-gray-200 animate-pulse rounded-lg"></div>
                      <div className="text-right">
                        <div className="h-8 w-16 bg-gray-200 animate-pulse rounded"></div>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="h-4 w-24 bg-gray-200 animate-pulse rounded"></div>
                      <div className="h-3 w-32 bg-gray-200 animate-pulse rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Skeleton for PromotionTable */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="px-4 sm:px-6 py-4 border-b border-gray-200 bg-gray-50 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div>
                  <div className="h-6 w-48 bg-gray-200 animate-pulse rounded"></div>
                  <div className="h-4 w-64 bg-gray-200 animate-pulse rounded mt-1"></div>
                </div>
                <div className="h-6 w-24 bg-gray-200 animate-pulse rounded-full"></div>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left">
                        <div className="h-4 w-32 bg-gray-200 animate-pulse rounded"></div>
                      </th>
                      <th className="px-6 py-4 text-center">
                        <div className="h-4 w-24 bg-gray-200 animate-pulse rounded"></div>
                      </th>
                      <th className="px-6 py-4 text-center">
                        <div className="h-4 w-24 bg-gray-200 animate-pulse rounded"></div>
                      </th>
                      <th className="px-6 py-4 text-center">
                        <div className="h-4 w-32 bg-gray-200 animate-pulse rounded"></div>
                      </th>
                      <th className="px-6 py-4 text-center">
                        <div className="h-4 w-20 bg-gray-200 animate-pulse rounded"></div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {[...Array(5)].map((_, index) => (
                      <tr key={index}>
                        <td className="px-6 py-5 flex items-center">
                          <div className="w-10 h-10 bg-gray-200 animate-pulse rounded-full mr-3"></div>
                          <div className="h-4 w-48 bg-gray-200 animate-pulse rounded"></div>
                        </td>
                        <td className="px-6 py-5 text-center">
                          <div className="h-4 w-16 bg-gray-200 animate-pulse rounded mx-auto"></div>
                        </td>
                        <td className="px-6 py-5 text-center">
                          <div className="h-4 w-16 bg-gray-200 animate-pulse rounded mx-auto"></div>
                        </td>
                        <td className="px-6 py-5 text-center">
                          <div className="h-4 w-24 bg-gray-200 animate-pulse rounded mx-auto"></div>
                        </td>
                        <td className="px-6 py-5 text-center">
                          <div className="h-4 w-20 bg-gray-200 animate-pulse rounded mx-auto"></div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="px-4 sm:px-6 py-4 border-t border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="h-8 w-24 bg-gray-200 animate-pulse rounded"></div>
                  <div className="h-4 w-32 bg-gray-200 animate-pulse rounded"></div>
                  <div className="h-8 w-24 bg-gray-200 animate-pulse rounded"></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default PromotionReport;
