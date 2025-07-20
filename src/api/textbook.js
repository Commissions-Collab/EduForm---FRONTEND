import { axiosInstance } from "../lib/axios";

export const getTextbooks = async () => {
  const response = await axiosInstance.get("/textbooks");
  return response.data;
};
