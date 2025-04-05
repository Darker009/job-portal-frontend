import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import CandidateDashboard from "./components/dashboard/Candidate"; // Import CandidateDashboard
import EmployeeDashboard from "./components/dashboard/Employee"; // Import EmployeeDashboard
import ProtectedRoute from "./components/protectedRoute/ProtectedRoute";
import CandidateProfile from "./pages/profile/CandidateProfile";
import CandidateViewProfile from "./pages/profile/CandidateViewProfile";
import EmployeeProfile from "./pages/profile/EmployeeProfile";
import EmployeeViewProfile from "./pages/profile/EmployeeViewProfile";
import JobBoard from "./pages/job/JobBoard";

function App() {
  return (
    <>
    
      <Navbar />

      <Routes>

        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/candidate-dashboard"
          element={
            <ProtectedRoute allowedRoles={["Candidate"]}>
              <CandidateDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/candidate-profile"
          element={
            <ProtectedRoute allowedRoles={["Candidate"]}>
              <CandidateProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/candidate-view-profile"
          element={
            <ProtectedRoute allowedRoles={["Candidate"]}>
              <CandidateViewProfile />
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
        <Route
          path="/employee-profile"
          element={
            <ProtectedRoute allowedRoles={["Employee"]}>
              <EmployeeProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employee-view-profile"
          element={
            <ProtectedRoute allowedRoles={["Employee"]}>
              <EmployeeViewProfile />
            </ProtectedRoute>
          }

        />
        <Route 
        path="/job-board"
        element={
          <ProtectedRoute allowedRoles={["Employee"]}>
          <JobBoard/>
          </ProtectedRoute>
        }
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  );
}

export default App;