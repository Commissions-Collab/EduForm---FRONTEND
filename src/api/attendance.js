import axios from "axios";

export const getAttendanceRecords = async () => {
  const response = await axios.get("/api/attendance");
  return response.data;
};

export const updateAttendanceStatus = async (id, status) => {
  return axios.put(`/api/attendance/${id}`, { status });
};

export const updateAttendanceReason = async (id, reason) => {
  return axios.put(`/api/attendance/${id}`, { reason });
};
