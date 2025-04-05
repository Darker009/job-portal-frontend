import { useEffect, useRef, useState } from "react";
import AuthService from "../../services/AuthService";
import "./ProfileStyle.model.css";
import { FiRefreshCcw, FiUser, FiCamera } from "react-icons/fi";

const EmployeeViewProfile = () => {
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
      const data = await AuthService.getEmployeeProfile();
      console.log("Fetched profile:", data);

      if (data.profilePicture) {
        data.profilePicture = data.profilePicture.startsWith("http")
          ? data.profilePicture
          : `${API_BASE_URL}${data.profilePicture.startsWith("/") ? "" : "/"}${data.profilePicture}`;
      }
      if (data.expUrl) {
        data.expUrl = data.expUrl.startsWith("http")
          ? data.expUrl
          : `${API_BASE_URL}${data.expUrl.startsWith("/") ? "" : "/"}${data.expUrl}`;
      }

      setProfile(data);
    } catch (err) {
      console.error("Profile fetch error:", err);
      if (retryCount < 2) {
        setRetryCount((prev) => prev + 1);
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

      const response = await AuthService.uploadEmployeeProfilePicture(formData);
      console.log("Upload response:", response);

      const pictureUrl = response.profilePicture;

      if (!pictureUrl) {
        throw new Error("Profile picture URL not found in response");
      }
      const updatedUrl = pictureUrl.startsWith("http")
        ? pictureUrl
        : `${API_BASE_URL}${pictureUrl.startsWith("/") ? "" : "/"}${pictureUrl}`;

      setProfile((prev) => ({
        ...prev,
        profilePicture: updatedUrl,
      }));
      alert("Profile picture updated successfully!");
    } catch (error) {
      console.error("Profile picture upload error:", error);
      alert(`Failed to update profile picture: ${error.message}`);
    } finally {
      event.target.value = "";
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
            <FiRefreshCcw />
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
        <ProfileField label="Company Name" value={profile.companyName} />
        <ProfileField label="Designation" value={profile.designation} />
        <ProfileField label="Work Experience" value={profile.workExperience} />
        <ProfileField label="Contact Number" value={profile.contactNumber} />
        <ProfileField
          label="Date of Birth"
          value={profile.dob ? new Date(profile.dob).toLocaleDateString() : null}
        />
        <ProfileField label="Address" value={profile.address} />
        <ProfileField label="Current Location" value={profile.currentLocation} />
        <div className="profile-field">
          <strong>Work Doc:</strong>{" "}
          {profile.expUrl ? (
            <a href={profile.expUrl} target="_blank" rel="noopener noreferrer">
              View Document ↗
            </a>
          ) : (
            <em>No resume uploaded</em>
          )}
        </div>
      </div>
    </div>
  );
};

// Define ProfileField component locally so it's available in this file
const ProfileField = ({ label, value }) => (
  <div className="profile-field">
    <strong>{label}:</strong>{" "}
    <span>{value || <em>Not specified</em>}</span>
  </div>
);

export default EmployeeViewProfile;
