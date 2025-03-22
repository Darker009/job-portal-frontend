import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import AuthService from "../../services/AuthService";
import "./LoginStyle.model.css";

const Register = () => {
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "", // Add role to the state
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate all fields
    if (!userData.firstName || !userData.lastName || !userData.email || !userData.password || !userData.confirmPassword || !userData.role) {
      setError("All fields are required.");
      return;
    }

    // Validate password match
    if (userData.password !== userData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    // Validate role
    if (userData.role !== "Candidate" && userData.role !== "Employee") {
      setError("Invalid role. Please select either Candidate or Employee.");
      return;
    }

    try {
      const response = await AuthService.register({
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        password: userData.password,
        role: userData.role, // Include role in the registration payload
      });

      // Check for errors in the response
      if (response?.error) {
        setError(response.error);
      } else {
        console.log("Registration successful, navigating to /login");
        navigate("/login"); // Navigate to login page after successful registration
      }
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Try again.");
    }
  };

  return (
    <div className="auth-container">
      <h2>Register</h2>
      {error && <p className="error-message">{error}</p>}
      <form className="auth-form" onSubmit={handleSubmit}>
        <input type="text" name="firstName" placeholder="First Name" value={userData.firstName} onChange={handleChange} required />
        <input type="text" name="lastName" placeholder="Last Name" value={userData.lastName} onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" value={userData.email} onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" value={userData.password} onChange={handleChange} required />
        <input type="password" name="confirmPassword" placeholder="Confirm Password" value={userData.confirmPassword} onChange={handleChange} required />
        <select name="role" value={userData.role} onChange={handleChange} required>
          <option value="">Select Role</option>
          <option value="Candidate">Candidate</option>
          <option value="Employee">Employee</option>
        </select>
        <button type="submit">Register</button>
      </form>
      <p className="switch-auth">
        Already have an account?{" "}
        <Link to="/login" className="link-button">Login</Link>
      </p>
    </div>
  );
};

export default Register;