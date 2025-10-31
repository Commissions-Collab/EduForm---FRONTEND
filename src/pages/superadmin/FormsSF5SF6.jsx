import React, { useEffect, useState } from "react";
import {
  Filter,
  AlertTriangle,
  Clock,
  XCircle,
  BadgeAlert,
  Download,
  Printer,
  Settings2,
  BookOpen,
  ClipboardList,
} from "lucide-react";
import useSF5SF6FormStore from "../../stores/superAdmin/sf5sf6FormStore";
import useSF5SF6FilterStore from "../../stores/superAdmin/sf5sf6FilterStore";
import SF5SF6FilterSection from "../../components/superadmin/SF5SF6FilterSection";
import SF5FormView from "../../components/superadmin/SF5FormView";
import SF6FormView from "../../components/superadmin/SF6FormView";

const FormsSF5SF6 = () => {
  const {
    fetchFilterOptions,
    fetchFormStatistics,
    exportFormPDF,
    isFormAccessible,
    formMessage,
    formWarning,
    overallFormStats,
    loading,
    filterLoading,
  } = useSF5SF6FormStore();

  const { globalFilters } = useSF5SF6FilterStore();
  const hasAllFilters =
    globalFilters.academicYearId &&
    globalFilters.sectionId &&
    globalFilters.formType;

  const [downloadLoading, setDownloadLoading] = useState(false);

  useEffect(() => {
    fetchFilterOptions();
  }, [fetchFilterOptions]);

  useEffect(() => {
    if (hasAllFilters) {
      fetchFormStatistics(
        globalFilters.academicYearId,
        globalFilters.sectionId,
        globalFilters.formType
      );
    }
  }, [
    fetchFormStatistics,
    globalFilters.academicYearId,
    globalFilters.sectionId,
    globalFilters.formType,
  ]);

  const handleExportPDF = async () => {
    setDownloadLoading(true);
    try {
      await exportFormPDF(
        globalFilters.academicYearId,
        globalFilters.sectionId,
        globalFilters.formType
      );
    } catch (err) {
      console.error("Export failed:", err);
    } finally {
      setDownloadLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

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

  // Form type styling
  const isFormSF5 = globalFilters.formType === "sf5";
  const formConfig = isFormSF5
    ? {
        title: "Class Register (SF5)",
        description: "Daily attendance and class management records",
        bgGradient: "from-blue-600 to-blue-800",
        accentColor: "blue",
        icon: ClipboardList,
      }
    : {
        title: "Learner Progress Report (SF6)",
        description: "Student assessment and progress tracking",
        bgGradient: "from-emerald-600 to-emerald-800",
        accentColor: "emerald",
        icon: BookOpen,
      };

  const FormIcon = formConfig.icon;

  return (
    <div className="bg-gray-50 min-h-screen">
      <main className="p-3 sm:p-4 lg:p-6">
        {/* Dynamic Header based on Form Type */}
        <div className="mb-8">
          <div
            className={`bg-gradient-to-r ${formConfig.bgGradient} rounded-xl shadow-lg p-8 text-white mb-6`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div>
                  <h1 className="text-3xl font-bold mb-2">
                    {formConfig.title}
                  </h1>
                  <p className="text-white text-opacity-90">
                    {formConfig.description}
                  </p>
                </div>
              </div>
              <div className="flex gap-2"></div>
            </div>
          </div>

          {/* Form Status Indicator */}
          {hasAllFilters && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white border-l-4 border-blue-500 rounded-lg p-4 shadow-sm">
                <p className="text-gray-600 text-sm font-medium">Form Type</p>
                <p className="text-gray-900 font-bold text-lg mt-1">
                  {isFormSF5 ? "SF5" : "SF6"}
                </p>
              </div>
              <div className="bg-white border-l-4 border-purple-500 rounded-lg p-4 shadow-sm">
                <p className="text-gray-600 text-sm font-medium">
                  Total Students
                </p>
                <p className="text-gray-900 font-bold text-lg mt-1">
                  {overallFormStats?.total_students || "—"}
                </p>
              </div>
              <div className="bg-white border-l-4 border-green-500 rounded-lg p-4 shadow-sm">
                <p className="text-gray-600 text-sm font-medium">Status</p>
                <p
                  className={`font-bold text-lg mt-1 ${
                    isFormAccessible ? "text-green-600" : "text-orange-600"
                  }`}
                >
                  {isFormAccessible ? "✓ Ready" : "⚠ Not Ready"}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Filter Section */}
        <SF5SF6FilterSection />

        {/* Missing Filters */}
        {!hasAllFilters && (
          <div className="mt-6 bg-white rounded-xl p-12 border-2 border-dashed border-gray-300 shadow-sm text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Filter className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-gray-700 font-semibold text-lg mb-2">
              Start by selecting filters
            </h3>
            <p className="text-gray-600">
              Choose an Academic Year, Section, and Form Type to view the
              corresponding report
            </p>
          </div>
        )}

        {/* API Message */}
        {formMessage && hasAllFilters && (
          <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl border-2 border-amber-200 p-6 shadow-lg mb-8">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                  <BadgeAlert className="w-6 h-6 text-amber-600" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-amber-800 mb-2">
                  {formMessage.title}
                </h3>
                <p className="text-amber-700">{formMessage.content}</p>
              </div>
            </div>
          </div>
        )}

        {/* Warning for Not Ready */}
        {formWarning && hasAllFilters && !loading && (
          <div
            className={`bg-gradient-to-br ${
              getWarningColors(formWarning.type).bg
            } rounded-xl border-2 ${
              getWarningColors(formWarning.type).border
            } p-6 shadow-lg mb-8`}
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div
                  className={`w-14 h-14 ${
                    getWarningColors(formWarning.type).iconBg
                  } rounded-full flex items-center justify-center`}
                >
                  {(() => {
                    const IconComponent = getWarningIcon(formWarning.type);
                    return (
                      <IconComponent
                        className={`w-7 h-7 ${
                          getWarningColors(formWarning.type).iconColor
                        }`}
                      />
                    );
                  })()}
                </div>
              </div>
              <div className="flex-1">
                <h3
                  className={`text-xl font-bold ${
                    getWarningColors(formWarning.type).titleColor
                  } mb-3`}
                >
                  {formWarning.title}
                </h3>
                <p
                  className={`${
                    getWarningColors(formWarning.type).textColor
                  } text-base leading-relaxed`}
                >
                  {formWarning.content}
                </p>
                {formWarning.details && (
                  <p
                    className={`${
                      getWarningColors(formWarning.type).textColor
                    } text-sm mt-2`}
                  >
                    {formWarning.details}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && hasAllFilters && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white border border-gray-200 rounded-lg p-4 animate-pulse"
                >
                  <div className="h-4 w-24 bg-gray-200 rounded mb-3"></div>
                  <div className="h-8 w-16 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-8">
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="h-12 bg-gray-200 rounded animate-pulse"
                  ></div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Conditional Rendering based on Form Type */}
        {hasAllFilters && isFormAccessible && !formWarning && !loading && (
          <>
            {isFormSF5 ? (
              <SF5FormView stats={overallFormStats} />
            ) : (
              <SF6FormView stats={overallFormStats} />
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default FormsSF5SF6;
