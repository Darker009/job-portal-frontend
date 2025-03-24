import React, { useState, useEffect, useRef } from "react";
import AuthService from "../../services/AuthService";
import "./ProfileStyle.model.css";
import { FiRefreshCw, FiUser, FiCamera } from "react-icons/fi";

const CandidateViewProfile = () => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const fileInputRef = useRef(null);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await AuthService.getCandidateProfile();
      console.log("Fetched profile:", data);

      // Ensure profile picture URL is complete
      if (data.profilePicture) {
        data.profilePicture = data.profilePicture.startsWith("http")
          ? data.profilePicture
          : `${API_BASE_URL}${data.profilePicture.startsWith("/") ? "" : "/"}${data.profilePicture}`;
      }
      // Similarly, ensure resume URL is complete if available
      if (data.resumeUrl) {
        data.resumeUrl = data.resumeUrl.startsWith("http")
          ? data.resumeUrl
          : `${API_BASE_URL}${data.resumeUrl.startsWith("/") ? "" : "/"}${data.resumeUrl}`;
      }

      setProfile(data);
    } catch (err) {
      console.error("Profile fetch error:", err);
      if (retryCount < 2) {
        setRetryCount(prev => prev + 1);
        return;
      }
      setError(err.message || "Failed to load profile. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [retryCount]);

  const handleProfilePictureClick = () => {
    fileInputRef.current.click();
  };

  const handleProfilePictureUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append("profilePicture", file);

      const updatedProfile = await AuthService.uploadProfilePicture(formData);
      console.log("Uploaded profile picture response:", updatedProfile);

      const updatedUrl = updatedProfile.profilePicture.startsWith("http")
        ? updatedProfile.profilePicture
        : `${API_BASE_URL}${updatedProfile.profilePicture}`;
      console.log("New profile picture URL:", updatedUrl);

      setProfile(prev => ({
        ...prev,
        profilePicture: updatedUrl,
      }));
    } catch (error) {
      console.error("Profile picture upload error:", error);
      alert("Failed to update profile picture. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading your profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h3>Error Loading Profile</h3>
        <p>{error}</p>
        <button className="retry-button" onClick={fetchProfile}>
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <header className="profile-header">
        <div className="profile-title">
          <h1>My Profile</h1>
          <button className="refresh-button" onClick={fetchProfile}>
            <FiRefreshCw />
            Refresh
          </button>
        </div>

        <div className="profile-picture-container" onClick={handleProfilePictureClick}>
          {profile.profilePicture ? (
            <img
              src={profile.profilePicture}
              alt="Profile"
              className="profile-picture"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "default-profile.png";
              }}
            />
          ) : (
            <div className="profile-picture-placeholder">
              <FiUser size={24} />
            </div>
          )}
          <div className="profile-edit-icon">
            <FiCamera size={18} />
          </div>
        </div>
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          accept="image/*"
          onChange={handleProfilePictureUpload}
        />
      </header>

      <div className="profile-details">
        <ProfileField label="College Name" value={profile.collegeName} />
        <ProfileField label="Degree" value={profile.degree} />
        <ProfileField label="Specialization" value={profile.specialization} />
        <ProfileField label="Contact Number" value={profile.contactNumber} />
        <ProfileField label="Skills" value={profile.skills} />
        <ProfileField
          label="Date of Birth"
          value={profile.dob ? new Date(profile.dob).toLocaleDateString() : null}
        />
        <ProfileField label="Address" value={profile.address} />
        <ProfileField label="Current Location" value={profile.currentLocation} />
        <div className="profile-field">
          <strong>Resume:</strong>{" "}
          {profile.resumeUrl ? (
            <a href={profile.resumeUrl} target="_blank" rel="noopener noreferrer">
              View Resume ↗
            </a>
          ) : (
            <em>No resume uploaded</em>
          )}
        </div>
      </div>
    </div>
  );
};

const ProfileField = ({ label, value }) => (
  <div className="profile-field">
    <strong>{label}:</strong>{" "}
    <span>{value || <em>Not specified</em>}</span>
  </div>
);

export default CandidateViewProfile;
