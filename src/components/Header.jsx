import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import SignIn from "../pages/SignIn";
import SignUp from "../pages/SignUp";
import "./Header.css";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isSignedIn, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);

  // Show profile dropdown only on profile and project pages
  const showProfileDropdown = isSignedIn && (location.pathname === "/profile" || location.pathname.startsWith("/project/") || location.pathname === "/edit-profile");

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
    navigate("/");
  };

  const handleEditProfile = () => {
    setShowDropdown(false);
    navigate("/edit-profile");
  };

  const handleNavigation = (sectionId) => {
    // Navigate to home first if not already there
    navigate("/", { state: { scrollTo: sectionId } });
  };

  return (
    <>
      <header className="header">
        <div className="logo-container">
          <Link to="/">
          <img src="src/assets/images/logo.png" width="200" alt="Visionize logo" />
          </Link>
          <h1 className="site-title">Visionize</h1>
         
        </div>

        <nav className="navbar">
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><button className="nav-link-btn" onClick={() => handleNavigation("discover")}>Discover</button></li>
            <li><button className="nav-link-btn" onClick={() => handleNavigation("tools")}>Tools</button></li>
            <li><button className="nav-link-btn" onClick={() => handleNavigation("tutorial")}>Tutorial</button></li>
            {isSignedIn && !showProfileDropdown && (
              <li><Link to="/profile" className="nav-link-btn" style={{textDecoration: 'none'}}>Profile</Link></li>
            )}
            {showProfileDropdown && (
              <li className="profile-dropdown">
                <button 
                  className="profile-btn"
                  onClick={() => setShowDropdown(!showDropdown)}
                >
                  Profile ▼
                </button>
                {showDropdown && (
                  <div className="dropdown-menu">
                    <button onClick={handleEditProfile} className="dropdown-item">
                      Edit Profile
                    </button>
                    <button onClick={handleLogout} className="dropdown-item logout-item">
                      Logout
                    </button>
                  </div>
                )}
              </li>
            )}
          </ul>
        </nav>

        {!isSignedIn && (
          <div className="navbar-actions">
            <button onClick={() => setShowSignIn(true)} className="navbar-ghost">
              Log in
            </button>
            <button onClick={() => setShowSignUp(true)} className="navbar-cta">
              Get Started
            </button>
          </div>
        )}
      </header>

      {showSignIn && <SignIn onClose={() => setShowSignIn(false)} onSwitchToSignUp={() => { setShowSignIn(false); setShowSignUp(true); }} />}
      {showSignUp && <SignUp onClose={() => setShowSignUp(false)} onSwitchToSignIn={() => { setShowSignUp(false); setShowSignIn(true); }} />}
    </>
  );
}
