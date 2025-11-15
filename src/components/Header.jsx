import React from "react";
import { Link } from "react-router-dom";
import "./Header.css";

export default function Header() {
  return (
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
          <li><a href="#discover">Discover</a></li>
          <li><a href="#tools">Tools</a></li>
          <li><a href="#tutorial">Tutorial</a></li>
        </ul>
      </nav>
    </header>
  );
}
