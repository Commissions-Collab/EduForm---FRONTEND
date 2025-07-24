// src/store/useAuthStore.js
import { create } from "zustand";

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
  user: JSON.parse(localStorage.getItem("user")) || null,

  login: ({ email, password }) => {
    const account = dummyAccounts.find(
      (u) => u.email === email && u.password === password
    );
    if (account) {
      localStorage.setItem("user", JSON.stringify(account));
      set({ user: account });
      return { success: true, user: account };
    } else {
      return { success: false, message: "Invalid credentials" };
    }
  },

  logout: () => {
    localStorage.removeItem("user");
    set({ user: null });
  },

  getUserRole: () => {
    const user = JSON.parse(localStorage.getItem("user"));
    return user?.role || null;
  },
}));
