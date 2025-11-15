import React, { useState, useEffect } from "react";
import "./Home.css";
import SignIn from "./SignIn";
import SignUp from "./SignUp";

export default function Home() {
  const [selectedTool, setSelectedTool] = useState(null);
  const [showSignIn, setShowSignIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);

  const toolImages = {
    "Task List": "/assets/images/tasklist.png",
    "Kanban Board": "/assets/images/kn.png",
    "Gantt Chart": "/assets/images/gantt.png",
    "Scrum Board": "/assets/images/scrum.jpg",
    "Calendar View": "/assets/images/calendar.webp",
    "Dashboard & Analytics": "/assets/images/dash.png",
  };

  const toolDescriptions = {
    "Task List":
      "Stay organized with simple, structured lists that help you plan and follow every task from start to finish.",
    "Kanban Board":
      "Move your tasks across columns like “To Do”, “In Progress”, and “Done” — a modern, visual way to manage your workflow.",
    "Gantt Chart":
      "Visualize your project timeline, track dependencies, and ensure every milestone is met right on schedule.",
    "Scrum Board":
      "Plan your sprints, track progress, and monitor team velocity to deliver consistent results in Agile projects.",
    "Calendar View":
      "Keep deadlines visible and synchronize your team’s schedule with a clear, calendar-based overview of tasks.",
    "Dashboard & Analytics":
      "Get instant insights into project performance, task completion, and workload distribution — all in one place."
  };

  // Scroll reveal on sections
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    const revealElements = document.querySelectorAll(".reveal-on-scroll");
    revealElements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  // Navbar + background blobs parallax
  useEffect(() => {
    const handleScroll = () => {
      const navbar = document.querySelector(".navbar");
      if (navbar) {
        if (window.scrollY > 20) {
          navbar.classList.add("scrolled");
        } else {
          navbar.classList.remove("scrolled");
        }
      }

      const blobs = document.querySelectorAll(".bg-blob");
      blobs.forEach(blob => {
        const speed = parseFloat(blob.dataset.speed || "0.15");
        const offset = window.scrollY * speed;
        blob.style.transform = `translateY(${offset}px)`;
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* === NAVBAR === */}
      <header className="navbar">
        <div className="navbar-left">
          <div className="navbar-logo">Visionize</div>
          <a href="logo.png" className="navbar-logo-image">
            <img src="/assets/images/logo.png" alt="Visionize Logo" />
          </a>
        </div>
        <nav className="navbar-links">
          <a href="#top">Home</a>
          <a href="#discover">Discover</a>
          <a href="#tools">Tools</a>
          <a href="#tutorial">Tutorial</a>
        </nav>
        <div className="navbar-actions">
          <button onClick={() => setShowSignIn(true)} className="navbar-ghost">
            Log in
          </button>
          <button onClick={() => setShowSignUp(true)} className="navbar-cta">
            Get Started
          </button>
        </div>
      </header>

      <main>
        {/* === HERO SECTION === */}
        <section id="top" className="hero reveal-on-scroll">
          <div className="hero-bg-blobs">
            <div className="bg-blob blob-1" data-speed="0.08" />
            <div className="bg-blob blob-2" data-speed="0.14" />
            <div className="bg-blob blob-3" data-speed="0.1" />
          </div>

          <div className="hero-text">
            <p className="hero-eyebrow">Project Management · Collaboration · Clarity</p>
            <h1>Turn your team’s vision into a structured, achievable plan.</h1>
            <p className="hero-subtitle">
              Visionize brings tasks, timelines, and teams into one visual workspace so you can stay
              focused on what really matters: delivering great work together.
            </p>

            <div className="hero-cta-row">
              <button onClick={() => setShowSignUp(true)} className="hero-cta-primary">
                Start for free
              </button>
              <a href="#tutorial" className="hero-cta-secondary">
                Watch tutorial
              </a>
            </div>

            <div className="hero-stats">
              <div className="stat">
                <span className="stat-number">+120</span>
                <span className="stat-label">Projects managed</span>
              </div>
              <div className="stat">
                <span className="stat-number">+30%</span>
                <span className="stat-label">Faster delivery</span>
              </div>
              <div className="stat">
                <span className="stat-number">24/7</span>
                <span className="stat-label">Access anywhere</span>
              </div>
            </div>
          </div>

          <div className="hero-figure">
            <div className="hero-card">
              <div className="hero-card-header">
                <span className="hero-dot dot-1" />
                <span className="hero-dot dot-2" />
                <span className="hero-dot dot-3" />
              </div>
              <div className="hero-card-body">
                <div className="hero-card-row">
                  <span className="hero-pill">Sprint Board</span>
                  <span className="hero-pill soft">Team Vision</span>
                </div>
                <div className="hero-mini-grid">
                  <div className="mini-card">
                    <p>To Do</p>
                    <span>12 tasks</span>
                  </div>
                  <div className="mini-card">
                    <p>In Progress</p>
                    <span>7 tasks</span>
                  </div>
                  <div className="mini-card">
                    <p>Done</p>
                    <span>28 tasks</span>
                  </div>
                </div>
              </div>
            </div>
            <img
              src="/assets/images/3.jpg"
              alt="Visionize Preview"
              className="hero-illustration"
            />
          </div>
        </section>

        {/* === INTRODUCTION SECTIONS === */}
        <section className="introduction">
          <div className="intro-content reveal-on-scroll">
            <div className="intro-text">
              <h2>What is Visionize?</h2>
              <p>
                Visionize is your all-in-one workspace for managing projects, organizing tasks,
                and keeping your team connected. Whether you're working solo or with a team,
                Visionize helps you transform ideas into action through a clear, intuitive,
                and modern interface.
              </p>
              <button onClick={() => setShowSignUp(true)} className="cta-btn">Get Started</button>
            </div>
            <img src="/assets/images/3.jpg" alt="Visionize" />
          </div>

          <div className="intro-content reverse reveal-on-scroll">
            <div className="intro-text">
              <h2>Why Choose Visionize?</h2>
              <p>
                We believe project management should be simple, smart, and visual. With Visionize,
                you can easily create projects, assign responsibilities, track progress, and stay
                aligned, all in one place. Forget the chaos of scattered documents and endless
                emails. Visionize brings clarity to your workflow.
              </p>
            </div>
            <img src="/assets/images/2.jpg" alt="Visionize" />
          </div>

          <div className="intro-content reveal-on-scroll">
            <div className="intro-text">
              <h2>Our Mission</h2>
              <p>
                To empower individuals and teams to plan better, work smarter, and achieve more.
                Visionize isn’t just a tool, it’s your partner in productivity and collaboration.
              </p>
            </div>
            <img src="/assets/images/1.jpg" alt="Visionize" />
          </div>

          <div className="intro-content reverse reveal-on-scroll">
            <div className="intro-text">
              <h2>Start Your Journey Today</h2>
              <p>Join motivated teams who turned their vision into reality.</p>
              <button onClick={() => setShowSignUp(true)} className="cta-btn">Get Started</button>
            </div>
            <img src="/assets/images/4.jpg" alt="Visionize" />
          </div>
        </section>

        {/* === DISCOVER SECTION === */}
        <section id="discover" className="discover intro-content reverse reveal-on-scroll">
          <div className="intro-text">
            <h2>Discover Visionize</h2>
            <p>Visionize provides all the tools you need to manage your projects efficiently:</p>
            <ul>
              <li>Create new projects and organize your work in structured spaces</li>
              <li>Add tasks inside each project and assign responsible members</li>
              <li>Build teams, invite members, and collaborate seamlessly</li>
              <li>Choose your preferred project management method: Waterfall, Scrum, or Kanban</li>
              <li>Access your personal profile to view all your projects, teams, and progress</li>
            </ul>
          </div>
          <img src="/assets/images/discover.jpg" alt="Discover Visionize" />
        </section>

        {/* === TOOLS SECTION === */}
        <section id="tools" className="tools reveal-on-scroll">
          <h2>Our Tools — Manage Your Way</h2>
          <p>
            Choose your project management style and visualize your progress with the right tools.
          </p>

          <div className="tools-grid">
            {Object.keys(toolImages).map(tool => (
              <div
                key={tool}
                className={`tool ${selectedTool === tool ? "tool-active" : ""}`}
                onClick={() => setSelectedTool(tool)}
              >
                <h3>{tool}</h3>
                <p>{toolDescriptions[tool]}</p>
                <span className="tool-more">Click to preview</span>
              </div>
            ))}
          </div>

          {selectedTool && (
            <div className="tool-image-display" key={selectedTool}>
              <p className="tool-selected-label">
                Showing: <strong>{selectedTool}</strong>
              </p>
              <img
                key={selectedTool}
                src={toolImages[selectedTool]}
                alt={selectedTool}
                className="tool-image"
              />
            </div>
          )}
        </section>

        {/* === TUTORIAL SECTION === */}
        <section id="tutorial" className="tutorial reveal-on-scroll">
          <h2>Tutorial — Learn How to Use Visionize</h2>
          <p>
            Watch our step-by-step tutorial to discover how to create projects, manage tasks,
            and collaborate efficiently.
          </p>
          <div className="video-container">
            <iframe
              width="560"
              height="315"
              src="https://www.youtube.com/embed/9tMPay7V0Dg"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            ></iframe>
          </div>
        </section>

        {/* === FOOTER === */}
        <footer className="footer reveal-on-scroll">
          <div className="footer-top">
            <div className="footer-brand">
              <h3>Visionize</h3>
              <p>
                A modern workspace where your projects, tasks, and teams stay aligned and
                focused on what matters.
              </p>
            </div>
            <div className="footer-columns">
              <div className="footer-col">
                <h4>Product</h4>
                <a href="#discover">Overview</a>
                <a href="#tools">Tools</a>
                <a href="#tutorial">Tutorial</a>
              </div>
              <div className="footer-col">
                <h4>For Teams</h4>
                <span>Agile squads</span>
                <span>Academic projects</span>
                <span>Remote collaboration</span>
              </div>
              <div className="footer-col">
                <h4>Contact</h4>
                <span>contact@visionize.app</span>
                <span>Support center</span>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© {new Date().getFullYear()} Visionize. All rights reserved.</span>
            <div className="footer-bottom-links">
              <span>Privacy</span>
              <span>Terms</span>
            </div>
          </div>
        </footer>
      </main>

      {/* === SIGNIN MODAL === */}
      {showSignIn && <SignIn onClose={() => setShowSignIn(false)} onSwitchToSignUp={() => { setShowSignIn(false); setShowSignUp(true); }} />}

      {/* === SIGNUP MODAL === */}
      {showSignUp && <SignUp onClose={() => setShowSignUp(false)} onSwitchToSignIn={() => { setShowSignUp(false); setShowSignIn(true); }} />}
    </>
  );
}
