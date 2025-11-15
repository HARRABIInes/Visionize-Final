import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./SignIn.css";

const SignIn = ({ onClose, onSwitchToSignUp }) => {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Sign in:", formData);
    
    // Store user data and update auth state
    signIn({
      email: formData.email,
    });
    
    // Redirect to profile page
    if (onClose) onClose();
    navigate("/profile");
  };

  return (
    <div className="signin-modal-overlay" onClick={onClose}>
      <div className="signin-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} title="Close">&times;</button>
        
        <div className="modal-content">
          <div className="modal-header">
            <h2>Welcome Back</h2>
            <p>Sign in to your Visionize account</p>
          </div>

          <form className="signin-form" onSubmit={handleSubmit}>
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

            <div className="remember-forgot">
              <label className="remember">
                <input type="checkbox" />
                Remember me
              </label>
              <a href="#" className="forgot-password">Forgot password?</a>
            </div>

            <button type="submit" className="btn-signin">Sign In</button>

            <div className="signin-footer">
              <p>Don't have an account? <a href="#" onClick={(e) => { e.preventDefault(); onSwitchToSignUp(); }}>Sign Up</a></p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignIn;

