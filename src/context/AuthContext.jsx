import React, { createContext, useState, useEffect, useContext } from "react";
import AuthService from "../services/AuthService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(AuthService.getCurrentUser());
  const [token, setToken] = useState(AuthService.getAuthToken());

  // Check for an existing user on page load
  useEffect(() => {
    const storedToken = AuthService.getAuthToken();
    if (storedToken) {
      const fetchUser = async () => {
        try {
          const userData = AuthService.getCurrentUser();
          if (userData) {
            setUser(userData); // Set user data if available
          } else {
            logout(); // Clear invalid session if no user data is found
          }
        } catch (error) {
          console.error("Error fetching user:", error);
          logout(); // Clear invalid session on error
        }
      };
      fetchUser();
    }
  }, []);

  // Login function
  const login = async (credentials) => {
    try {
      const response = await AuthService.login(credentials);
      if (response.token) {
        setToken(response.token); // Update token state
        setUser(response.user); // Update user state
        localStorage.setItem("token", response.token); // Store token in localStorage
        localStorage.setItem("user", JSON.stringify(response.user)); // Store user data in localStorage
      }
      return response; // Return response for further processing
    } catch (error) {
      console.error("Login failed:", error);
      throw error; // Propagate error to the calling component
    }
  };

  // Logout function
  const logout = () => {
    AuthService.logout(); // Clear token and user data from localStorage
    setUser(null); // Reset user state
    setToken(null); // Reset token state
  };

  // Provide auth context values
  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for accessing auth context
export const useAuth = () => useContext(AuthContext);