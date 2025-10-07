import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // change when deploying
});

// Attach token if available
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


export const loginUser = async (credentials) => {
  const res = await API.post("/auth/login", credentials);
  return res.data;
};

export const getProfile = async () => {
  const res = await API.get("/auth/profile");
  return res.data;
};

export const registerUser = async (data) => {
  const res = await API.post("/auth/register", data);
  return res.data;
};

// getUsers
export const getUsers = async () => {
  const { data } = await API.get("/admin/users");
  return data;
};

// addBadge
export const addBadge = async (userId, badge) => {
  const { data } = await API.post(`/admin/users/${userId}/badges`, badge);
  return data;
};

// removeBadge
export const removeBadge = async (userId, badgeKey) => {
  const { data } = await API.delete(`/admin/users/${userId}/badges/${badgeKey}`);
  return data;
};


