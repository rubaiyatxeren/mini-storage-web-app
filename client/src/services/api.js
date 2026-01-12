// src/services/api.js
import axios from "axios";

// Use proxy - no need for full URL
const API_BASE_URL = "/api"; // Just /api, vite will proxy it

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to ALL requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Export services
export const authService = {
  register: (userData) => api.post("/auth/register", userData),
  login: (credentials) => api.post("/auth/login", credentials),
  getProfile: () => api.get("/auth/profile"),
};

export const uploadService = {
  uploadFile: (formData) => {
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };
    return api.post("/upload/file", formData, config);
  },
  uploadImage: (formData) => {
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };
    return api.post("/upload/image", formData, config);
  },
  uploadVideo: (formData) => {
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };
    return api.post("/upload/video", formData, config);
  },
  getFiles: () => api.get("/upload/files"),
  deleteFile: (id) => api.delete(`/upload/file/${id}`),
};

export default api;
