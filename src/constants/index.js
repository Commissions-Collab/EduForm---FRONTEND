import { MdOutlineSpaceDashboard, MdOutlineWorkOutline } from "react-icons/md";
import {
  LuUsers,
  LuFileText,
  LuClipboardList,
  LuSettings,
  LuGraduationCap,
  LuCalendarDays,
  LuHeart,
  LuBookOpen,
  LuAward,
  LuCalendarCheck,
  LuBookText,
  LuSignalHigh,
  LuActivity,
  LuClock,
} from "react-icons/lu";

export const superAdminNav = [
  {
    name: "Dashboard",
    icon: MdOutlineSpaceDashboard,
    url: "/superadmin/dashboard",
  },
  {
    name: "Users",
    icon: LuUsers,
    url: "/users",
  },
  {
    name: "Forms",
    icon: LuFileText,
    url: "/forms",
  },
  {
    name: "Records",
    icon: LuClipboardList,
    url: "/records",
  },
  {
    name: "Calendar",
    icon: LuCalendarDays,
    url: "/calendar",
  },
];

export const adminNav = [
  {
    name: "Dashboard",
    icon: MdOutlineSpaceDashboard,
    url: "/admin/dashboard",
  },
  {
    name: "Daily Attendance (SF2)",
    icon: LuCalendarCheck,
    url: "/attendance",
  },
  {
    name: "Monthly Summary (SF4)",
    icon: LuCalendarDays,
    url: "/summary",
  },
  {
    name: "Academic Records (SF9)",
    icon: LuClipboardList,
    url: "/records",
  },
  {
    name: "Promotion Reports (SF5)",
    icon: LuSignalHigh,
    url: "/promotionReports",
  },
  {
    name: "Certificates",
    icon: LuAward,
    url: "/certificates",
  },
  {
    name: "Parent Conference",
    icon: LuUsers,
    url: "/parentConference",
  },
  {
    name: "Textbooks (SF3)",
    icon: LuBookText,
    url: "/textbook",
  },

  {
    name: "Workload (SF7)",
    icon: MdOutlineWorkOutline,
    url: "/workload",
  },
];

export const studentNav = [
  {
    name: "Dashboard",
    icon: MdOutlineSpaceDashboard,
    url: "/student/dashboard",
  },
  {
    name: "Grades",
    icon: LuGraduationCap,
    url: "/grades",
  },
  {
    name: "Attendance",
    icon: LuCalendarDays,
    url: "/attendance",
  },
  {
    name: "Health Profile",
    icon: LuHeart,
    url: "/healthProfile",
  },
  {
    name: "Resources",
    icon: LuBookOpen,
    url: "/resources",
  },

  {
    name: "Achievements",
    icon: LuAward,
    url: "/achievements",
  },
];


//superAdmin Constants
export const dashboardStats = [
  {
    label: "Active Users",
    value: "247",
    change: "+12%",
    changeColor: "text-green-500",
    icon: LuUsers,
    iconColor: "text-blue-500",
  },
  {
    label: "Forms Processed",
    value: "1,234",
    change: "+5%",
    changeColor: "text-green-500",
    icon: LuFileText,
    iconColor: "text-green-500",
  },
  {
    label: "System Health",
    value: "98%",
    change: "Optimal",
    changeColor: "text-gray-500",
    icon: LuActivity,
    iconColor: "text-purple-500",
  },
  {
    label: "Pending Actions",
    value: "23",
    link: { text: "View All", href: "#" },
    icon: LuClock,
    iconColor: "text-orange-500",
  },
];