import { axiosInstance } from "../lib/axios";

export const getAttendanceRecords = async ({ date, section }) => {
  const response = await axiosInstance.get("/attendance", {
    params: {
      date,
      section,
    },
  });
  return response.data;
};

export const updateAttendanceStatus = async (id, status) => {
  return axiosInstance.put(`/attendance/${id}/status`, { status });
};

export const updateAttendanceReason = async (id, reason) => {
  return axiosInstance.put(`/attendance/${id}/reason`, { reason });
};
