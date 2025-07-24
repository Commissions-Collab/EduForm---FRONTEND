// src/store/useAuthStore.js
import { create } from "zustand";
import axios from "axios";

const dummyAccounts = [
  {
    id: 1,
    name: "Super Admin A",
    role: "superadmin",
    email: "superadmin@gmail.com",
    password: "password",
  },
  {
    id: 2,
    name: "Admin A",
    role: "admin",
    email: "admin@gmail.com",
    password: "password",
  },
  {
    id: 3,
    name: "Student A",
    role: "student",
    email: "student@gmail.com",
    password: "password",
  },
];

export const useAuthStore = create((set) => ({
  user: null,
  token: null,

  login: async ({ email, password }) => {
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/login", {
        email,
        password,
      });

      const { user, token } = response.data;

      // Save to localStorage
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);

      // Update Zustand state
      set({ user, token });

      return { success: true, user };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
      };
    }
  },

  logout: () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    set({ user: null, token: null });
  },

  // user: JSON.parse(localStorage.getItem("user")) || null,

  // login: ({ email, password }) => {
  //   const account = dummyAccounts.find(
  //     (u) => u.email === email && u.password === password
  //   );
  //   if (account) {
  //     localStorage.setItem("user", JSON.stringify(account));
  //     set({ user: account });
  //     return { success: true, user: account };
  //   } else {
  //     return { success: false, message: "Invalid credentials" };
  //   }
  // },

  // logout: () => {
  //   localStorage.removeItem("user");
  //   set({ user: null });
  // },

  getUserRole: () => {
    const user = JSON.parse(localStorage.getItem("user"));
    return user?.role || null;
  },
}));
