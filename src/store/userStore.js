import { create } from "zustand";

export const useUserStore = create((set) => ({
  user: null,
  token: localStorage.getItem("adminToken") || null,
  setUser: (user, token) => {
    set({ user, token });
    localStorage.setItem("adminToken", token);
  },
  logout: () => {
    localStorage.removeItem("adminToken");
    set({ user: null, token: null });
  }
}));
