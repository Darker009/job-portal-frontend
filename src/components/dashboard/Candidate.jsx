import React from "react";
import { Link } from "react-router-dom";
import "./DashBoardStyle.model.css";

const Candidate = () => {
  return (
    <div className="profile">
      <h1>Welcome, Candidate!</h1>
      <p>This is your dashboard. You can update or view your profile.</p>
      <div className="profile-actions">
        <Link to="/candidate-profile" className="link-button">
          Update Profile
        </Link>
        <Link to="/candidate-view-profile" className="link-button secondary">
          View Profile
        </Link>
      </div>
    </div>
  );
};

export default Candidate;
