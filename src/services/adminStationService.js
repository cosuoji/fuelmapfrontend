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

// ✅ Add a new station
//ADMIN STATION ROUTES 
// ✅ Get all stations (admin)
export const getStations = async () => {
  const { data } = await API.get("/admin/stations");
  return data;
};


export const addStation = async (station) => {
  const { data } = await API.post("/admin/stations", station);
  return data;
};

// ✅ Delete a station
export const deleteStation = async (id) => {
  const { data } = await API.delete(`/admin/stations/${id}`);
  return data;
};

// ✅ Optional: Get flagged stations
export const getFlaggedStations = async () => {
  const { data } = await API.get("/admin/stations/flagged");
  return data;
};

// ✅ Optional: Update a price manually
export const updateStationPrice = async (id, payload) => {
  const { data } = await API.patch(`/admin/stations/${id}/price`, payload);
  return data;
};