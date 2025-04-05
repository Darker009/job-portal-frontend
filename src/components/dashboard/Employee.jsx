import React from "react";
import {Link} from "react-router-dom";
import "./DashBoardStyle.model.css";
const Employee = () => {


    return (
        <div className="profile">
            <h1>Welcome, Employee!</h1>
            <p>This is your dashboard. You can manage job posting here.</p>
            <div className="profile-actions">
                <Link to="/employee-profile" className="link-button">
                    Update Profile
                </Link>
                <Link to="/employee-view-profile" className="link-button">
                    View Profile
                </Link>
                <Link to="/job-board" className="link-button">
                Job Board
                </Link>
            </div>
        </div>
    );
};

export default Employee;