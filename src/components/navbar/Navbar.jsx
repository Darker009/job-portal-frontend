import React, { useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const navbarRef = useRef(null); // Ref for the navbar

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate("/login");
    closeNavbar();
  };

  // Function to close navbar
  const closeNavbar = () => {
    const navbarToggler = document.querySelector(".navbar-toggler");
    const navbarCollapse = document.querySelector(".navbar-collapse");
    if (navbarCollapse?.classList.contains("show")) {
      navbarToggler?.click(); // Close the navbar if it's open
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navbarRef.current && !navbarRef.current.contains(event.target)) {
        closeNavbar();
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-info" ref={navbarRef}>
      <div className="container-fluid">
        <Link to="/" className="navbar-brand" onClick={closeNavbar}>
          Job Portal
        </Link>

        {/* Hamburger Menu Button */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <div className="navbar-nav ms-auto">
            
            {user ? (
              <>
                {user.role === "Candidate" && (
                  <Link to="/candidate-dashboard" className="nav-link" onClick={closeNavbar}>
                    Candidate Dashboard
                  </Link>
                )}
                {user.role === "Employee" && (
                  <Link to="/employee-dashboard" className="nav-link" onClick={closeNavbar}>
                    Employee Dashboard
                  </Link>
                )}
                <button className="nav-link btn btn-link text-light" onClick={handleLogout}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="nav-link" onClick={closeNavbar}>
                  Login
                </Link>
                <Link to="/register" className="nav-link" onClick={closeNavbar}>
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;