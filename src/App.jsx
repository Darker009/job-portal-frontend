import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import CandidateDashboard from "./components/dashboard/Candidate"; // Import CandidateDashboard
import EmployeeDashboard from "./components/dashboard/Employee"; // Import EmployeeDashboard
import ProtectedRoute from "./components/protectedRoute/ProtectedRoute";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        {/* Default route redirects to /login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes */}
        <Route
          path="/candidate-dashboard"
          element={
            <ProtectedRoute allowedRoles={["Candidate"]}>
              <CandidateDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employee-dashboard"
          element={
            <ProtectedRoute allowedRoles={["Employee"]}>
              <EmployeeDashboard />
            </ProtectedRoute>
          }
        />

        {/* Redirect any unknown routes to /login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  );
}

export default App;