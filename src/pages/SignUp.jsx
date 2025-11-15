import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./SignUp.css";

function SignUp({ onClose, onSwitchToSignIn }) {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    profession: "",
    birthDate: "",
    password: "",
    verifyPassword: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add validation logic here
    console.log("Form submitted:", formData);
    
    // Store user data and update auth state
    signUp({
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      profession: formData.profession,
      birthDate: formData.birthDate,
    });
    
    // Redirect to profile page
    if (onClose) onClose();
    navigate("/profile");
  };

  return (
    <div className="signup-modal-overlay" onClick={onClose}>
      <div className="signup-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} title="Close">&times;</button>
        
        <div className="modal-content">
          <div className="modal-header">
            <h2>Create Your Account</h2>
            <p>Join thousands of teams already managing projects with Visionize</p>
          </div>

          <form className="signup-form" onSubmit={handleSubmit}>
            <div className="form-group-row">
              <div className="form-group">
                <label>First Name</label>
                <input
                  type="text"
                  name="firstName"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Profession</label>
              <input
                type="text"
                name="profession"
                placeholder="Project Manager"
                value={formData.profession}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Birth Date</label>
              <input
                type="date"
                name="birthDate"
                value={formData.birthDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group-row">
              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Confirm Password</label>
                <input
                  type="password"
                  name="verifyPassword"
                  placeholder="••••••••"
                  value={formData.verifyPassword}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="terms">
              <input type="checkbox" id="terms" required />
              <label htmlFor="terms">
                I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
              </label>
            </div>

            <button type="submit" className="btn-signup">Create Account</button>

            <div className="form-footer">
              <p>Already have an account? <a href="#" onClick={(e) => { e.preventDefault(); onSwitchToSignIn(); }}>Sign In</a></p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
