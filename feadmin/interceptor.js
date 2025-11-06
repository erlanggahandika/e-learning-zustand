"use client";
import axios from "axios";
import BASE_URL, { ENDPOINTS } from "./endpoint.js";
import { useRouter } from "next/navigation.js";



export const api = axios.create({
  baseURL: BASE_URL,
});

// Request interceptor
api.interceptors.request.use((config) => {
  
  const token = localStorage.getItem("accesToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  config.headers["ngrok-skip-browser-warning"] = "true";

  return config;
});

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    // Jika token expired (401) dan belum dicoba refresh
    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const router = useRouter();

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) throw new Error("No refresh token");

        await axios.post(
          ENDPOINTS.REFRESH,
          { token: refreshToken },
          { headers: { "ngrok-skip-browser-warning": "true" } }
        );

        return api(originalRequest);
      } catch (err) {
        console.log("Refresh token gagal:", err);
        // Arahkan ke halaman login admin
         window.location.href = "/admin";
        return Promise.reject(err);
      }
    }

    // Kalau 403 Forbidden, langsung arahkan ke login juga
    if (status === 403) {
       window.location.href = "/admin";
    }

    return Promise.reject(error);
  }
);

export default api;
