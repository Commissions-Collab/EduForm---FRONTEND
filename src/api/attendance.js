import { axiosInstance } from "../lib/axios";

export const getAttendanceRecords = async () => {
  const response = await axiosInstance.get("/attendance");
  return response.data;
};

export const updateAttendanceStatus = async (id, status) => {
  return axiosInstance.put(`/attendance/${id}`, { status });
};

export const updateAttendanceReason = async (id, reason) => {
  return axiosInstance.put(`/attendance/${id}`, { reason });
};
