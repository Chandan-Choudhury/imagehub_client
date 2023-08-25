import create from "zustand";

export const useStore = create((set) => ({
  token: sessionStorage.getItem("token"),
  setToken: (token) => set((state) => ({ token: token })),
}));
