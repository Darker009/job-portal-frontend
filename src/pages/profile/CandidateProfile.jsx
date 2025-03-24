import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../../services/AuthService";
import "./CandidateProfileView.model.css"; // Separate CSS file for profile styling

const CandidateProfile = () => {
  const [userData, setUserData] = useState({
    collegeName: "",
    degree: "",
    specialization: "",
    contactNumber: "",
    skills: "",
    dob: "",
    address: "",
    currentLocation: "",
    resumeFile: null,
  });
  const [error, setError] = useState("");
  const [resumeName, setResumeName] = useState("No file chosen");
  const navigate = useNavigate();

  // Handle text input changes
  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value.trim() });
  };

  // Handle file input change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUserData({ ...userData, resumeFile: file });
      setResumeName(file.name);
    }
  };

  // Submit the form data to save/update candidate profile
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Check that all fields are provided
    if (
      !userData.collegeName ||
      !userData.degree ||
      !userData.specialization ||
      !userData.contactNumber ||
      !userData.skills ||
      !userData.dob ||
      !userData.address ||
      !userData.currentLocation
    ) {
      setError("All fields are required");
      return;
    }

    try {
      // Call the unified endpoint that handles both profile creation and update
      const response = await AuthService.saveCandidateProfile(userData);
      console.log("Profile saved successfully", response);
      navigate("/candidate-dashboard");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="profile-container">
      <h2>Candidate Profile</h2>
      <p>Update your profile details</p>
      <form onSubmit={handleSubmit} className="profile-form">
        {error && <p className="error-message">{error}</p>}
        <input
          type="text"
          name="collegeName"
          placeholder="College Name"
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="degree"
          placeholder="Degree"
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="specialization"
          placeholder="Specialization"
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="contactNumber"
          placeholder="Contact Number"
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="skills"
          placeholder="Skills"
          onChange={handleChange}
          required
        />
        <input
          type="date"
          name="dob"
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="address"
          placeholder="Address"
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="currentLocation"
          placeholder="Current Location"
          onChange={handleChange}
          required
        />
        <div className="file-upload">
          <label htmlFor="resumeUpload" className="upload-btn">
            Upload Resume
          </label>
          <input
            type="file"
            id="resumeUpload"
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
            hidden
          />
          <span className="file-name">{resumeName}</span>
        </div>
        <button type="submit" className="save-btn">
          Save
        </button>
      </form>
    </div>
  );
};

export default CandidateProfile;
