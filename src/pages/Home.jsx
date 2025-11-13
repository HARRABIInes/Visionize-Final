import React, { useState } from "react";
import "./Home.css";

export default function Home() {
  const [selectedTool, setSelectedTool] = useState(null);

  const toolImages = {
    "Task List": "src/assets/images/tasklist.png",
    "Kanban Board": "src/assets/images/kn.png",
    "Gantt Chart": "src/assets/images/gantt.png",
    "Scrum Board": "src/assets/images/scrum.jpg",
    "Calendar View": "src/assets/images/calendar.webp",
    "Dashboard & Analytics": "src/assets/images/dash.png"
  };

  const toolDescriptions = {
    "Task List": "Stay organized with simple, structured lists that help you plan and follow every task from start to finish.",
    "Kanban Board": "Move your tasks across columns like “To Do”, “In Progress”, and “Done” — a modern, visual way to manage your workflow.",
    "Gantt Chart": "Visualize your project timeline, track dependencies, and ensure every milestone is met right on schedule.",
    "Scrum Board": "Plan your sprints, track progress, and monitor team velocity to deliver consistent results in Agile projects.",
    "Calendar View": "Keep deadlines visible and synchronize your team’s schedule with a clear, calendar-based overview of tasks.",
    "Dashboard & Analytics": "Get instant insights into project performance, task completion, and workload distribution — all in one place."
  };

  return (
    <main>
      {/* === Introduction Sections === */}
      <section className="introduction">
        <div className="intro-content">
          <div className="intro-text">
            <h2>What is Visionize?</h2>
            <p>
              Visionize is your all-in-one workspace for managing projects, organizing tasks, and keeping your team connected.
              Whether you’re working solo or with a team, Visionize helps you transform ideas into action through a clear, intuitive, and modern interface
            </p>
            <a href="/signin"><button className="cta-btn">Get Started</button></a>
          </div>
          <img src="src/assets/images/3.jpg" alt="Visionize" />
        </div>

        <div className="intro-content reverse">
          <div className="intro-text">
            <h2>Why Choose Visionize?</h2>
            <p>
              We believe project management should be simple, smart, and visual. 
              With Visionize, you can easily create projects, assign responsibilities, track progress, and stay aligned, all in one place. 
              Forget the chaos of scattered documents and endless emails.Visionize brings clarity to your workflow.
            </p>
          </div>
          <img src="src/assets/images/2.jpg" alt="Visionize" />
        </div>

        <div className="intro-content">
          <div className="intro-text">
            <h2>Our Mission</h2>
            <p>To empower individuals and teams to plan better, work smarter, and achieve more. 
                  Visionize isn’t just a tool, it’s your partner in productivity and collaboration.</p>
          </div>
          <img src="src/assets/images/1.jpg" alt="Visionize" />
        </div>

        <div className="intro-content reverse">
          <div className="intro-text">
            <h2>Start Your Journey Today</h2>
            <p>Join hundreds of motivated teams who turned their vision into reality.</p>
            <a href="/signin"><button className="cta-btn">Get Started</button></a>
          </div>
          <img src="src/assets/images/4.jpg" alt="Visionize" />
        </div>
      </section>

      {/* === Discover Section === */}
      <section id="discover" className="discover intro-content reverse">
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
        <img src="src/assets/images/discover.jpg" alt="Discover Visionize" />
      </section>

      {/* === Tools Section === */}
      <section id="tools" className="tools">
        <h2>Our Tools — Manage Your Way</h2>
        <p>Choose your project management style and visualize your progress with the right tools.</p>

        <div className="tools-grid">
          {Object.keys(toolImages).map((tool) => (
            <div key={tool} className="tool" onClick={() => setSelectedTool(tool)}>
              <h3>{tool}</h3>
              <p>{toolDescriptions[tool]}</p>
            </div>
          ))}
        </div>

        {selectedTool && (
          <div className="tool-image-display">
            <img src={toolImages[selectedTool]} alt={selectedTool} className="tool-image" />
          </div>
        )}
      </section>

      {/* === Tutorial Section === */}
      <section id="tutorial" className="tutorial">
        <h2>Tutorial — Learn How to Use Visionize</h2>
        <p>Watch our step-by-step tutorial to discover how to create projects, manage tasks, and collaborate efficiently.</p>
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
    </main>
  );
}
