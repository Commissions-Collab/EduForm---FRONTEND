import { create } from "zustand";
import axios from "axios";
import { getItem, setItem, removeItem } from "../utils/storage";

export const useAuthStore = create((set) => ({
  user: getItem("user"),
  token: getItem("token", false),

  login: async ({ email, password }) => {
    try {
      const res = await axios.post("http://127.0.0.1:8000/api/login", {
        email,
        password,
      });

      const { user, token } = res.data;

      setItem("user", user);
      setItem("token", token);

      set({ user, token });

      return { success: true, user };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "Login failed",
      };
    }
  },

  logout: () => {
    removeItem("user");
    removeItem("token");
    set({ user: null, token: null });
  },

  getUserRole: () => {
    const user = getItem("user");
    return user?.role || null;
  },
}));
