import axios from "axios";

const API_URL = "http://localhost:8080/api";

// Create axios instance with default configuration
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Include credentials for cross-origin requests
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access (token expired, etc.)
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login"; // Redirect to login
    }
    return Promise.reject(error);
  }
);

const AuthService = {
  // User endpoints
  register: async (userData) => {
    try {
      const response = await api.post("/user/register", userData);
      return response.data;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Registration failed. Please try again.";
      console.error("Registration failed:", errorMessage);
      throw new Error(errorMessage);
    }
  },

  login: async (credentials) => {
    try {
      const response = await api.post("/user/login", credentials);
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Login failed. Please check your credentials.";
      console.error("Login failed:", errorMessage);
      throw new Error(errorMessage);
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    // Optionally: return api.post('/user/logout');
  },

  getAuthToken: () => localStorage.getItem("token"),

  getCurrentUser: () => {
    try {
      const user = localStorage.getItem("user");
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error("Error parsing user data:", error);
      return null;
    }
  },

  // Candidate Profile endpoints
  /**
   * Save or update candidate profile.
   * Expects profileData to include all candidate fields and optionally file inputs (handled via FormData).
   */
  saveCandidateProfile: async (profileData) => {
    try {
      const formData = new FormData();
      // Append all profile data (both text and files)
      Object.entries(profileData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value);
        }
      });
      const response = await api.post("/candidate/profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to update candidate profile.";
      console.error("Error saving candidate profile:", errorMessage);
      throw new Error(errorMessage);
    }
  },

  /**
   * Get candidate profile for the current user.
   */
  getCandidateProfile: async () => {
    try {
      const response = await api.get("/candidate/profile");
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch candidate profile.";
      console.error("Error fetching candidate profile:", errorMessage);
      throw new Error(errorMessage);
    }
  },

  /**
   * Upload a new profile picture.
   * Expects formData containing the "profilePicture" file.
   */
  uploadProfilePicture: async (formData) => {
    try {
      const response = await api.post("/candidate/profile-picture", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to upload profile picture.";
      console.error("Error uploading profile picture:", errorMessage);
      throw new Error(errorMessage);
    }
  },

  /**
   * (Optional) Upload a resume file separately, if needed.
   * Expects formData containing the "resumeFile" file.
   */
  uploadResume: async (formData) => {
    try {
      const response = await api.post("/candidate/upload-resume", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to upload resume.";
      console.error("Error uploading resume:", errorMessage);
      throw new Error(errorMessage);
    }
  },

  // Optional: Refresh token endpoint
  refreshToken: async () => {
    try {
      const response = await api.post("/user/refresh-token");
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }
      return response.data;
    } catch (error) {
      AuthService.logout();
      throw error;
    }
  },
};

export default AuthService;
