import React, { useState } from "react";
import "./Profile.css";

export default function Profile() {
  const [activeTab, setActiveTab] = useState("projects");

  // Mock data - replace with real API calls later
  const [userProjects] = useState([
    {
      id: 1,
      name: "Website Redesign",
      description: "Redesign the company website",
      status: "In Progress",
      progress: 65,
      team: "Design Team",
      dueDate: "2025-12-15",
    },
    {
      id: 2,
      name: "Mobile App Development",
      description: "Build a new mobile application",
      status: "Active",
      progress: 40,
      team: "Dev Team",
      dueDate: "2026-01-30",
    },
    {
      id: 3,
      name: "Marketing Campaign",
      description: "Q4 marketing campaign planning",
      status: "Planning",
      progress: 20,
      team: "Marketing",
      dueDate: "2025-11-30",
    },
  ]);

  const [userTasks] = useState([
    {
      id: 1,
      title: "Create wireframes",
      project: "Website Redesign",
      status: "In Progress",
      priority: "High",
      dueDate: "2025-11-20",
      assigned: "You",
    },
    {
      id: 2,
      title: "API Integration",
      project: "Mobile App Development",
      status: "To Do",
      priority: "High",
      dueDate: "2025-11-25",
      assigned: "You",
    },
    {
      id: 3,
      title: "Brand guidelines review",
      project: "Marketing Campaign",
      status: "To Do",
      priority: "Medium",
      dueDate: "2025-11-22",
      assigned: "You",
    },
    {
      id: 4,
      title: "Testing & QA",
      project: "Website Redesign",
      status: "Done",
      priority: "Medium",
      dueDate: "2025-11-18",
      assigned: "You",
    },
  ]);

  const [userTeams] = useState([
    {
      id: 1,
      name: "Design Team",
      description: "UI/UX Design Team",
      members: 5,
      role: "Lead",
      projects: 3,
    },
    {
      id: 2,
      name: "Dev Team",
      description: "Full Stack Development",
      members: 8,
      role: "Member",
      projects: 4,
    },
    {
      id: 3,
      name: "Marketing",
      description: "Marketing & Growth",
      members: 4,
      role: "Member",
      projects: 2,
    },
  ]);

  return (
    <div className="profile-container">
      {/* === PROFILE HEADER === */}
      <div className="profile-header">
        <div className="profile-avatar">
          <img src="/assets/images/logo.png" alt="Profile Avatar" />
        </div>
        <div className="profile-info">
          <h1>John Doe</h1>
          <p className="profile-email">john.doe@visionize.com</p>
          <p className="profile-bio">Project Manager | Full Stack Developer</p>
        </div>
        <button className="profile-edit-btn">Edit Profile</button>
      </div>

      {/* === STATS OVERVIEW === */}
      <div className="profile-stats">
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <span className="stat-value">{userProjects.length}</span>
            <span className="stat-label">Active Projects</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✓</div>
          <div className="stat-content">
            <span className="stat-value">
              {userTasks.filter((t) => t.status === "Done").length}
            </span>
            <span className="stat-label">Completed Tasks</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <span className="stat-value">{userTeams.length}</span>
            <span className="stat-label">Teams</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⏳</div>
          <div className="stat-content">
            <span className="stat-value">
              {userTasks.filter((t) => t.status === "In Progress").length}
            </span>
            <span className="stat-label">In Progress</span>
          </div>
        </div>
      </div>

      {/* === TABS === */}
      <div className="profile-tabs">
        <button
          className={`tab-btn ${activeTab === "projects" ? "active" : ""}`}
          onClick={() => setActiveTab("projects")}
        >
          Projects
        </button>
        <button
          className={`tab-btn ${activeTab === "tasks" ? "active" : ""}`}
          onClick={() => setActiveTab("tasks")}
        >
          Tasks
        </button>
        <button
          className={`tab-btn ${activeTab === "teams" ? "active" : ""}`}
          onClick={() => setActiveTab("teams")}
        >
          Teams
        </button>
      </div>

      {/* === PROJECTS TAB === */}
      {activeTab === "projects" && (
        <div className="tab-content projects-content">
          <div className="content-header">
            <h2>Your Projects</h2>
            <button className="btn-primary">+ New Project</button>
          </div>
          <div className="projects-grid">
            {userProjects.map((project) => (
              <div key={project.id} className="project-card">
                <div className="project-card-header">
                  <h3>{project.name}</h3>
                  <span className={`status-badge status-${project.status.toLowerCase().replace(" ", "-")}`}>
                    {project.status}
                  </span>
                </div>
                <p className="project-description">{project.description}</p>
                <div className="project-progress">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${project.progress}%` }}></div>
                  </div>
                  <span className="progress-text">{project.progress}%</span>
                </div>
                <div className="project-meta">
                  <span className="meta-item">👥 {project.team}</span>
                  <span className="meta-item">📅 {project.dueDate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* === TASKS TAB === */}
      {activeTab === "tasks" && (
        <div className="tab-content tasks-content">
          <div className="content-header">
            <h2>Your Tasks</h2>
            <button className="btn-primary">+ New Task</button>
          </div>
          <div className="tasks-list">
            {userTasks.map((task) => (
              <div key={task.id} className="task-item">
                <div className="task-checkbox">
                  <input type="checkbox" id={`task-${task.id}`} />
                  <label htmlFor={`task-${task.id}`}></label>
                </div>
                <div className="task-info">
                  <h4>{task.title}</h4>
                  <p className="task-project">{task.project}</p>
                </div>
                <div className="task-meta">
                  <span className={`priority-badge priority-${task.priority.toLowerCase()}`}>
                    {task.priority}
                  </span>
                  <span className={`task-status status-${task.status.toLowerCase().replace(" ", "-")}`}>
                    {task.status}
                  </span>
                  <span className="task-due">📅 {task.dueDate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* === TEAMS TAB === */}
      {activeTab === "teams" && (
        <div className="tab-content teams-content">
          <div className="content-header">
            <h2>Your Teams</h2>
            <button className="btn-primary">+ Create Team</button>
          </div>
          <div className="teams-grid">
            {userTeams.map((team) => (
              <div key={team.id} className="team-card">
                <div className="team-header">
                  <h3>{team.name}</h3>
                  <span className="role-badge">{team.role}</span>
                </div>
                <p className="team-description">{team.description}</p>
                <div className="team-stats">
                  <div className="team-stat">
                    <span className="stat-value">{team.members}</span>
                    <span className="stat-label">Members</span>
                  </div>
                  <div className="team-stat">
                    <span className="stat-value">{team.projects}</span>
                    <span className="stat-label">Projects</span>
                  </div>
                </div>
                <button className="team-action-btn">View Team</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
