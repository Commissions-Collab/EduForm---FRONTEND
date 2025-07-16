import { axiosInstance } from "../lib/axios";

export const getGrades = async () => {
  const response = await axiosInstance.get("/grades");
  return response.data;
};

export const updateGrade = async (id, field, value) => {
  return axiosInstance.put(`/grades/${id}`, { field, value });
};
