import { axiosInstance } from "../lib/axios";

export const getPromotions = async () => {
  const response = await axiosInstance.get("/promotions");
  return response.data;
};
