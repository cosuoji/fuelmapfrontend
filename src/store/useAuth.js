import { create } from "zustand";

export const useAuth = create((set) => ({
  user: null,
  token: localStorage.getItem("token") || null,

login: (user, token) => {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
  set({ user, token });
},
logout: () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  set({ user: null, token: null });
},

}));
