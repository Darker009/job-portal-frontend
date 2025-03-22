import axios from "axios";

const API_URL = "http://localhost:8080/api/user";

const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

const AuthService = {

  register: async (userData) => {
    try {
      const response = await api.post("/register", userData);
      return response.data; // Return the response data on success
    } catch (err) {
      console.error("Registration failed:", err.response?.data || err.message);
      throw new Error(err.response?.data?.message || "Registration failed. Please try again.");
    }
  },

  login: async (credentials) => {
    try {
      const response = await api.post("/login", credentials);
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (err) {
      console.error("Login failed:", err.response?.data || err.message);
      throw new Error(err.response?.data?.message || "Login failed. Please check your credentials.");
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  getAuthToken: () => localStorage.getItem("token"),

  getCurrentUser: () => {
    return JSON.parse(localStorage.getItem("user")) || null;
  },
};

export default AuthService;