import axios from "axios";

const API_URL = "http://localhost:8080/api";
const TOKEN_KEY = "token";
const USER_KEY = "user";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// --- AuthService placeholder used in interceptors ---
let AuthService = null;

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (config.data instanceof FormData) {
      config.headers["Content-Type"] = "multipart/form-data";
    } else {
      config.headers["Content-Type"] = "application/json";
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response?.status;
    const originalRequest = error.config;
    const message = error.response?.data?.message || error.message;

    if (status === 401) {
      if (!originalRequest._retry && error.response?.data?.shouldRefresh) {
        originalRequest._retry = true;
        try {
          await AuthService.refreshToken();
          return api(originalRequest);
        } catch {
          AuthService.logout();
          window.location.href = "/login?error=session_expired";
          return Promise.reject(error);
        }
      }
      AuthService.logout();
      window.location.href = "/login?error=unauthorized";
    } else if (status === 403) {
      window.location.href = "/unauthorized";
    } else if (status === 500) {
      console.error("Server error:", message);
    }

    return Promise.reject({
      status,
      message,
      data: error.response?.data,
    });
  }
);

// AuthService Definition
AuthService = {
  register: async (userData) => {
    const res = await api.post("/user/register", userData);
    return res.data;
  },

  login: async (credentials) => {
    const res = await api.post("/user/login", credentials);
    const { token, user } = res.data;

    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    }

    return res.data;
  },

  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    return api.post("/user/logout").catch(() => {});
  },

  getAuthToken: () => localStorage.getItem(TOKEN_KEY),

  getCurrentUser: () => {
    try {
      const user = localStorage.getItem(USER_KEY);
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  },

  // Candidate Profile
  saveCandidateProfile: async (profileData) => {
    const formData = new FormData();
    Object.entries(profileData).forEach(([k, v]) => v && formData.append(k, v));
    const res = await api.post("/candidate/profile", formData);
    return res.data;
  },

  getCandidateProfile: async () => {
    const res = await api.get("/candidate/profile");
    return res.data;
  },

  uploadProfilePicture: async (formData) => {
    const res = await api.post("/candidate/profile/picture", formData);
    return res.data;
  },

  uploadResume: async (formData) => {
    const res = await api.post("/candidate/upload-resume", formData);
    return res.data;
  },

  // Employee Profile
  saveEmployeeProfile: async (profileData) => {
    const formData = new FormData();
    Object.entries(profileData).forEach(([k, v]) => v && formData.append(k, v));
    const res = await api.post("/employee/profile", formData);
    return res.data;
  },

  getEmployeeProfile: async () => {
    const res = await api.get("/employee/profile");
    return res.data;
  },

  uploadEmployeeProfilePicture: async (formData) => {
    const res = await api.post("/employee/profile/picture", formData);
    return res.data;
  },

  uploadExpDoc: async (formData) => {
    const res = await api.post("/employee/upload-resume", formData);
    return res.data;
  },

  refreshToken: async () => {
    const res = await api.post("/user/refresh-token");
    if (res.data.token) {
      localStorage.setItem(TOKEN_KEY, res.data.token);
    }
    return res.data;
  },

  verifyRole: (requiredRole) => {
    const user = AuthService.getCurrentUser();
    return user?.role === requiredRole;
  },
};

export default AuthService;
