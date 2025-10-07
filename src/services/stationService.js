// src/services/stationService.js
import axios from "axios";

const API = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/stations`, 
  withCredentials: true,
});


// ✅ Add token automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  config.headers["Content-Type"] = "application/json"; // ✅ Add this
  return config;
});

/**
 * Submit / update price
 * @param {FormData} formData { stationId?, name?, lng?, lat?, fuelType, price, queueStatus, image? }
 */
export const addPrice = async (data) => {
  const res = await API.post("/add-price", data); // send as JSON
  return res.data;
};


/**
 * Get nearby stations
 * @param {number} lng longitude
 * @param {number} lat latitude
 * @param {number} maxDistance meters (default 5000)
 */
export const getNearbyStations = async (lng, lat, maxDistance = 5000) => {
  const res = await API.get("/nearby", { params: { lng, lat, maxDistance } });
  return res.data;
};

/**
 * Admin: fetch pending stations/prices
 */
export const getPendingStations = async () => {
  const res = await API.get("/admin/pending");
  return res.data;
};

/**
 * Admin: review price update
 * @param {string} stationId 
 * @param {string} priceId 
 * @param {"approve"|"reject"} action 
 */
export const reviewPrice = async ({ stationId, priceId, action }) => {
  const res = await API.post("/admin/review", { stationId, priceId, action });
  return res.data;
};

/**
 * Report suspicious price (user action)
 * @param {string} stationId 
 * @param {string} priceId 
 */
export const reportPrice = async ({ stationId, priceId }) => {
  const res = await API.post("/report-price", { stationId, priceId });
  return res.data;
};


/**
 * Get all stations with pagination + filters
 * @param {object} params { page, limit, fuelType, minPrice, maxPrice, name }
 */

export const getAllStations = async (params = {}) => {
  const cacheKey = `stations-cache-${JSON.stringify(params)}`;

  try {
    // Attempt to fetch from the API
    const res = await API.get("/all", { params });
    const data = res.data;

    // Save the response in cache
    localStorage.setItem(cacheKey, JSON.stringify({
      data,
      timestamp: Date.now()
    }));

    return data;
  } catch (error) {
    console.warn("⚠️ Network error, loading from cache:", error);

    // If offline or fetch fails, return cached data (if exists)
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      const { data } = JSON.parse(cached);
      return data;
    }

    // No cache available
    throw new Error("Unable to fetch stations and no cached data found");
  }
};


export const searchStations = async (name, address) => {
  const res = await API.get("/search", { params: { q: name, address } });
  return res.data;
};