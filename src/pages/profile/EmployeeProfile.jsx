import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../../services/AuthService";
import "./ProfileStyle.model.css";

const EmployeeProfile = () => {
  const [userData, setUserData] = useState({
    companyName: "",
    designation: "",
    workExperience: "", // we'll use number input to enforce numeric values
    contactNumber: "",
    dob: "",
    address: "",
    currentLocation: "",
    expUrl: null,
  });
  const [error, setError] = useState("");
  const [expDoc, setExpDoc] = useState("No file chosen");
  const navigate = useNavigate();

  const handleChange = (e) => {
    // Use e.target.value directly; trim if you want
    setUserData({ ...userData, [e.target.name]: e.target.value.trim() });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUserData({ ...userData, expUrl: file });
      setExpDoc(file.name);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Ensure all fields are provided
    if (
      !userData.companyName ||
      !userData.designation ||
      !userData.workExperience ||
      !userData.contactNumber ||
      !userData.dob ||
      !userData.address ||
      !userData.currentLocation ||
      !userData.expUrl
    ) {
      setError("All fields are required");
      return;
    }
    try {
      // Optionally, you could parse numeric fields before sending
      const profileToSend = {
        ...userData,
        // Convert these to numbers (they will be sent as strings in FormData anyway)
        workExperience: userData.workExperience,
        contactNumber: userData.contactNumber,
      };
      const response = await AuthService.saveEmployeeProfile(profileToSend);
      console.log("Profile saved successfully", response);
      navigate("/employee-dashboard");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="profile-container">
      <h2>Employee Profile</h2>
      <p>Update your profile details</p>
      <form onSubmit={handleSubmit} className="profile-form">
        {error && <p className="error-message">{error}</p>}
        <input
          type="text"
          name="companyName"
          placeholder="Company Name"
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="designation"
          placeholder="Designation"
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="workExperience"
          placeholder="Work Experience (years)"
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="contactNumber"
          placeholder="Contact Number"
          onChange={handleChange}
          required
        />
        <input
          type="date"
          name="dob"
          placeholder="Date of Birth"
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
          <label htmlFor="expDocUpload" className="upload-btn">
            Upload Doc
          </label>
          <input
            type="file"
            id="expDocUpload"
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
            hidden
          />
          <span className="file-name">{expDoc}</span>
        </div>
        <button type="submit" className="save-btn">
          Save
        </button>
      </form>
    </div>
  );
};

export default EmployeeProfile;
