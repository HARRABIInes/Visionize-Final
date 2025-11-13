import React from "react";
import "./SignIn.css";

const SignIn = () => {
  return (
    <div className="signin-page">
      <form className="signin-form">
        <h2>Sign In</h2>
        <input type="email" placeholder="Email" required />
        <input type="password" placeholder="Password" required />
        <button type="submit" className="signin-submit">Login</button>

        <div className="signin-footer-links">
          <button type="button" className="link-button">Forgot password?</button>
          <p className="no-account">
            Don't have an account?{" "}
            <a href="/signup" className="signup-link">Sign up</a>
          </p>
        </div>
      </form>
    </div>
  );
};

export default SignIn;

