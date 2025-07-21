import { axiosInstance } from "../lib/axios";

export const getAttendanceCertificates = async () => {
  const response = await axiosInstance.get("/certificates/attendance");
  return response.data;
};

export const getHonorCertificates = async () => {
  const response = await axiosInstance.get("/certificates/honors");
  return response.data;
};
