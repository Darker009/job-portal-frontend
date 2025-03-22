import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; // Ensure the path is correct
import "./LoginStyle.model.css";

const Login = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { login } = useAuth(); // Ensure useAuth is properly defined

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Reset error state

    try {
      await login(credentials);
      const user = JSON.parse(localStorage.getItem("user"));
      if (user.role === "Candidate") {
        navigate("/candidate-dashboard");
      } else if (user.role === "Employee") {
        navigate("/employee-dashboard");

      }
    } catch (err) {
      setError(err.message || "Invalid credentials"); // Display error message
    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      {error && <p className="error-message">{error}</p>}
      <form className="auth-form" onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={credentials.email}
          onChange={handleChange}
          autoComplete="email"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={credentials.password}
          onChange={handleChange}
          autoComplete="current-password"
          required
        />
        <button type="submit">Login</button>
      </form>
      <p className="switch-auth">
        Don't have an account?{" "}
        <Link to="/register" className="link-button">Register</Link>
      </p>

    </div>
  );
};

export default Login;