// constants/index.js (Add these new constants)

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
  LuTriangleAlert,
  LuCircleCheck,
  LuHourglass,
  LuUser,
  LuStar,
  LuCircleAlert,
  LuFileChartLine, // Add this for notification
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
    url: "/monthlySummary",
  },
  {
    name: "Academic Records (SF9)",
    icon: LuClipboardList,
    url: "/grades",
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
    name: "Grade",
    icon: LuGraduationCap,
    url: "/grade",
  },
  {
    name: "Attendance",
    icon: LuCalendarDays,
    url: "/userAttendance",
  },
  {
    name: "Health Profile",
    icon: LuHeart,
    url: "/health-profile",
  },
  {
    name: "Textbooks",
    icon: LuBookOpen,
    url: "/text-books",
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

export const systemAlerts = [
  {
    message: "SF5 discrepancies detected in Grade 10-A",
    time: "10 minutes ago",
    icon: LuTriangleAlert,
    iconColor: "text-red-500",
  },
  {
    message: "Daily backup completed successfully",
    time: "1 hour ago",
    icon: LuCircleCheck,
    iconColor: "text-green-500",
  },
  {
    message: "Pending grade submissions for Grade 8",
    time: "2 hours ago",
    icon: LuHourglass,
    iconColor: "text-orange-500",
  },
];

export const recentActivity = [
  {
    user: "Maria Santos",
    action: "uploaded SF2 attendance records",
    time: "Just now",
    icon: LuUser, // Generic user icon, replace if specific user icons are available
  },
  {
    user: "John Cruz",
    action: "modified Grade 9 class list",
    time: "30 minutes ago",
    icon: LuUser,
  },
  {
    user: "Sarah Garcia",
    action: "generated quarterly report",
    time: "1 hour ago",
    icon: LuUser,
  },
];

export const sampleUsers = [
  {
    id: 1,
    name: "Maria Santos",
    email: "msantos@eduform.edu",
    role: "Teacher",
    department: "Mathematics",
    status: "Active",
    permissions: ["SF2", "SF9"],
    lastActive: "2 hours ago",
  },
  {
    id: 2,
    name: "John Cruz",
    email: "jcruz@eduform.edu",
    role: "Principal",
    department: "Administration",
    status: "Active",
    permissions: ["SF1", "SF2", "SF9", "SF10"],
    lastActive: "5 minutes ago",
  },
  {
    id: 3,
    name: "Sarah Garcia",
    email: "sgarcia@eduform.edu",
    role: "Health Officer",
    department: "Health Services",
    status: "Active",
    permissions: ["SF8"],
    lastActive: "1 day ago",
  },
  {
    id: 4,
    name: "Robert Lim",
    email: "rlim@eduform.edu",
    role: "Records Officer",
    department: "Administration",
    status: "Inactive",
    permissions: ["SF3", "SF5", "SF6"],
    lastActive: "1 week ago",
  },
];

//Admin Constants
export const adminCards = [
  {
    id: 1,
    title: "Today's Attendance",
    type: "attendance",
    data: {
      present: { count: 87, percent: 75 },
      absent: { count: 5, percent: 15 },
      late: { count: 8, percent: 10 },
    },
  },
  {
    id: 2,
    title: "Academic Status",
    type: "academic",
    data: {
      reportsIssued: 135,
      honorEligible: 23,
    },
  },
  {
    id: 3,
    title: "Resources & Calendar",
    type: "resources",
    data: {
      textbookOverdues: 12,
      pendingReturns: 7,
      upcomingEvents: [
        { name: "Sports Meet", date: "2025-07-10" },
        { name: "Parents’ Assembly", date: "2025-07-15" },
        { name: "Exam Week", date: "2025-07-20" },
      ],
    },
  },
];

export const reasons = [
  "Sick",
  "Family Emergency",
  "Personal",
  "Transportation",
  "Other",
];

export const studentsData = [
  {
    id: 1,
    name: "Robert Lim",
    math: "",
    science: "",
    english: "",
    filipino: "",
    history: "",
    status: "",
    reason: "",
  },
  {
    id: 2,
    name: "Jane Cruz",
    math: "",
    science: "",
    english: "",
    filipino: "",
    history: "",
    status: "",
    reason: "",
  },
  {
    id: 3,
    name: "Mark Tan",
    math: "",
    science: "",
    english: "",
    filipino: "",
    history: "",
    status: "",
    reason: "",
  },
  {
    id: 4,
    name: "Anna Reyes",
    math: "",
    science: "",
    english: "",
    filipino: "",
    history: "",
    status: "",
    reason: "",
  },
  {
    id: 5,
    name: "Renz",
    math: "",
    science: "",
    english: "",
    filipino: "",
    history: "",
    status: "",
    reason: "",
  },
  {
    id: 6,
    name: "RRenz",
    math: "",
    science: "",
    english: "",
    filipino: "",
    history: "",
    status: "",
    reason: "",
  },
  {
    id: 7,
    name: "Renzzz",
    math: "",
    science: "",
    english: "",
    filipino: "",
    history: "",
    status: "",
    reason: "",
  },
  {
    id: 8,
    name: "RenzEryll",
    math: "",
    science: "",
    english: "",
    filipino: "",
    history: "",
    status: "",
    reason: "",
  },
  {
    id: 9,
    name: "Ren",
    math: "",
    science: "",
    english: "",
    filipino: "",
    history: "",
    status: "",
    reason: "",
  },
  {
    id: 10,
    name: "Renz Eryll",
    math: "",
    science: "",
    english: "",
    filipino: "",
    history: "",
    status: "",
    reason: "",
  },
];

export const promotionCards = [
  {
    label: "Total Students",
    value: "8",
    icon: LuUser,
    iconColor: "text-gray-700",
    change: "",
  },
  {
    label: "Passing",
    value: "7",
    icon: LuCircleCheck,
    iconColor: "text-green-600",
    change: "88% of class",
  },
  {
    label: "With Honors",
    value: "3",
    icon: LuStar,
    iconColor: "text-blue-600",
    change: "38% of class",
  },
  {
    label: "Discrepancies",
    value: "1",
    icon: LuTriangleAlert,
    iconColor: "text-yellow-600",
    change: "Require review",
  },
];

export const sampleStudentRecord = [
  {
    id: "S2023-0001",
    lrn: "123456789012",
    name: "Juan Dela Cruz",
    grade: "Grade 10",
    section: "Section A",
    status: "Enrolled",
    gwa: "92.5",
    attendance: "98%",
    records: ["SF1", "SF2", "SF9", "SF10"],
  },
  {
    id: "S2023-0002",
    lrn: "123456789013",
    name: "Maria Santos",
    grade: "Grade 10",
    section: "Section A",
    status: "Enrolled",
    gwa: "95.8",
    attendance: "100%",
    records: ["SF1", "SF2", "SF8", "SF9", "SF10"],
  },
  {
    id: "S2023-0003",
    lrn: "123456789014",
    name: "Pedro Reyes",
    grade: "Grade 10",
    section: "Section B",
    status: "Enrolled",
    gwa: "88.3",
    attendance: "95%",
    records: ["SF1", "SF2", "SF9", "SF10"],
  },
  {
    id: "S2023-0004",
    lrn: "123456789015",
    name: "Ana Lim",
    grade: "Grade 9",
    section: "Section C",
    status: "Transferred",
    gwa: "90.1",
    attendance: "93%",
    records: ["SF1", "SF2", "SF4", "SF9", "SF10"],
  },
];

export const parentStudents = [
  {
    name: "Miguel Santos",
    guardian: "Gloria Santos",
    status: "At Risk",
    color: "bg-red-100 text-red-700",
  },
  {
    name: "Maria Lopez",
    guardian: "Roberto Lopez",
    status: "At Risk",
    color: "bg-red-100 text-red-700",
  },
  {
    name: "Juan Cruz",
    guardian: "Elena Cruz",
    status: "Good Standing",
    color: "bg-blue-100 text-blue-700",
  },
  {
    name: "Ana Reyes",
    guardian: "Miguel Reyes",
    status: "Excellent",
    color: "bg-green-100 text-green-700",
  },
];

// New student dashboard constants
export const studentNotifications = [
  {
    type: "alert",
    message: "Science 78% - Below class average",
    suggestion: "Consider scheduling time with a tutor. View referrals",
  },
  {
    type: "clock",
    message: "Algebra II textbook due in 5 days",
    returnDate: "June 15",
    fine: "50",
  },
  {
    type: "award",
    message: "With High Honors eligibility confirmed",
    suggestion: "Maintain your grades to secure recognition.",
  },
];

export const studentDashboardStats = [
  {
    title: "QUARTERLY AVERAGE",
    value: "89.4%",
    change: "+2.1%",
    progress: true,
  },
  {
    title: "ATTENDANCE RATE",
    value: "92%",
    subText: "3 late arrivals",
    progress: true,
  },
  {
    title: "RESOURCES",
    value: "2 Books Borrowed", // No primary value, as it's a list
    resources: ["1 book due within a week"],
  },
];

export const workloadCards = [
  {
    label: "Total Students",
    value: "97",
    icon: LuUsers,
    iconColor: "text-blue-600",
    iconBg: "bg-blue-100",
  },
  {
    label: "Subject Areas",
    value: "3",
    icon: LuBookOpen,
    iconColor: "text-green-600",
    iconBg: "bg-green-100",
  },

  {
    label: "Class Sections",
    value: "3",
    icon: LuUser,
    iconColor: "text-red-600",
    iconBg: "bg-red-100",
  },

  {
    label: "Advisory Duties",
    value: "1",
    icon: LuClipboardList,
    iconColor: "text-purple-600",
    iconBg: "bg-purple-100",
  },
  {
    label: "Hours per Week",
    value: "26",
    icon: LuFileChartLine,
    iconColor: "text-yellow-600",
    iconBg: "bg-yellow-100",
  },
];
