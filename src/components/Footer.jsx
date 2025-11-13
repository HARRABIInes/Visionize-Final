import React from "react";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <section className="contact">
        <a href="mailto:visionize@supcom.tn">
          <img src="src/assets/images/mailicon.svg" alt="Mail" />Mail
        </a>
        <a href="https://www.facebook.com/mostfa.rekik" target="blank">
          <img src="src/assets/images/fb.png" alt="Facebook" />Facebook
        </a>
        <a href="https://www.instagram.com/mostfa__rekik/" target="blank">
          <img src="src/assets/images/instagramicon.webp" alt="Instagram" />Instagram
        </a>
        <a href="https://www.linkedin.com/in/ines-harrabi-860329331/" target="blank">
          <img src="src/assets/images/linkedin.png" alt="LinkedIn" />LinkedIn
        </a>
        <p>© 2025 Visionize. All rights reserved.</p>
      </section>

      <div className="language-selector">
        <label htmlFor="language">Language: </label>
        <select id="language" name="language" defaultValue="English">
          <option value="English">English</option>
          <option value="French">French</option>
          <option value="Arabic">Arabic</option>
          <option value="Japanese">Japanese</option>
          <option value="Spanish">Spanish</option>
          <option value="German">German</option>
        </select>
      </div>
    </footer>
  );
}
