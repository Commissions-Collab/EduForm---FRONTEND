import React from "react";
import {
  Users,
  CheckCircle,
  XCircle,
  Award,
  AlertCircle,
  TrendingUp,
} from "lucide-react";

const SF5SF6Cards = ({ stats }) => {
  if (!stats) return null;

  const cards = [
    {
      title: "Total Students",
      value: stats.total_students,
      icon: Users,
      color: "blue",
      subtitle: "Enrolled students",
    },
    {
      title: "Passing",
      value: stats.passing_students,
      icon: CheckCircle,
      color: "green",
      subtitle: `${
        Math.round((stats.passing_students / stats.total_students) * 100) || 0
      }% pass rate`,
    },
    {
      title: "Failing",
      value: stats.failing_students,
      icon: XCircle,
      color: "red",
      subtitle: `${
        Math.round((stats.failing_students / stats.total_students) * 100) || 0
      }% fail rate`,
    },
    {
      title: "With Honors",
      value: stats.with_honors + stats.high_honors + stats.highest_honors,
      icon: Award,
      color: "purple",
      subtitle: "Including all honor levels",
    },
    {
      title: "Attendance Issues",
      value: stats.attendance_issues,
      icon: AlertCircle,
      color: "orange",
      subtitle: "Below 75%",
    },
    {
      title: "Incomplete Grades",
      value: stats.incomplete_grades,
      icon: TrendingUp,
      color: "yellow",
      subtitle: "Not yet finalized",
    },
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: {
        bg: "bg-blue-50",
        border: "border-blue-200",
        icon: "text-blue-600",
        text: "text-blue-900",
      },
      green: {
        bg: "bg-green-50",
        border: "border-green-200",
        icon: "text-green-600",
        text: "text-green-900",
      },
      red: {
        bg: "bg-red-50",
        border: "border-red-200",
        icon: "text-red-600",
        text: "text-red-900",
      },
      purple: {
        bg: "bg-purple-50",
        border: "border-purple-200",
        icon: "text-purple-600",
        text: "text-purple-900",
      },
      orange: {
        bg: "bg-orange-50",
        border: "border-orange-200",
        icon: "text-orange-600",
        text: "text-orange-900",
      },
      yellow: {
        bg: "bg-yellow-50",
        border: "border-yellow-200",
        icon: "text-yellow-600",
        text: "text-yellow-900",
      },
    };
    return colors[color];
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {cards.map((card, idx) => {
        const colors = getColorClasses(card.color);
        const Icon = card.icon;

        return (
          <div
            key={idx}
            className={`${colors.bg} border-2 ${colors.border} rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow`}
          >
            <div className="flex items-start justify-between mb-4">
              <div
                className={`w-12 h-12 ${colors.bg} rounded-lg flex items-center justify-center`}
              >
                <Icon className={`w-6 h-6 ${colors.icon}`} />
              </div>
              <div className="text-right">
                <p className={`text-3xl font-bold ${colors.text}`}>
                  {card.value}
                </p>
              </div>
            </div>
            <div>
              <p className={`text-sm font-semibold ${colors.text}`}>
                {card.title}
              </p>
              <p className={`text-xs ${colors.icon} mt-1`}>{card.subtitle}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SF5SF6Cards;
