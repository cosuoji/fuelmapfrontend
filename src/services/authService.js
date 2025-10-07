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

export const getUsers = async () => {
  const { data } = await API.get("/admin/users");
  return data;
};

export const addBadge = async (userId, badge) => {
  const { data } = await API.post(`/admin/users/${userId}/badges`, { badge });
  return data;
};

export const removeBadge = async (userId, badge) => {
  const { data } = await API.delete(`/admin/users/${userId}/badges`, { data: { badge } });
  return data;
};


// Stations
export const getStations = async () => {
  const res = await API.get("/stations");
  return res.data;
};

export const addStation = async (station) => {
  const res = await API.post("/stations", station);
  return res.data;
};

export const deleteStation = async (id) => {
  const res = await API.delete(`/stations/${id}`);
  return res.data;
};
