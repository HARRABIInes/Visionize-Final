import React from "react";
import "./SignUp.css";

function SignUp() {
  return (
    <div className="signup-container">
      <form className="signup-form">
        <h2>Create Your Account</h2>

        <input type="text" placeholder="Name" required />
        <input type="text" placeholder="Family Name" required />
        <input type="email" placeholder="Email" required />
        <input type="text" placeholder="Profession" required />
        <input type="date" placeholder="Birth Date" required />
        <input type="password" placeholder="Password" required />
        <input type="password" placeholder="Verify Password" required />

        <button type="submit">Sign Up</button>

        <div className="links">
          <p>Already have an account? <a href="/signin">Sign In</a></p>
        </div>
      </form>
    </div>
  );
}

export default SignUp;
