import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { listProjects, createProject, deleteProject } from "../services/projects";
import { listTasks } from "../services/tasks";
import "./Profile.css";

export default function Profile() {
  const [projects, setProjects] = useState([]);
  const [tasksByProject, setTasksByProject] = useState({});
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth();
  const [form, setForm] = useState({
    name: "",
    description: "",
    managementMethod: "Kanban",
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    const load = async () => {
      try {
        setError(null);
        const data = await listProjects();
        setProjects(data);
        // Fetch tasks for each project to display counts
        const entries = await Promise.all(
          data.map(async (p) => {
            const tasks = await listTasks(p._id);
            return [p._id, tasks];
          })
        );
        setTasksByProject(Object.fromEntries(entries));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const counts = {
    activeProjects: projects.length,
    // Accept both English and French 'Completed' statuses to be robust
    upcomingTasks: Object.values(tasksByProject)
      .flat()
      .filter(t => t.status !== "Completed" && t.status !== "Terminé")
      .length,
    teams: new Set(projects.flatMap(p => p.members || [])).size,
  };

  const allTasks = Object.values(tasksByProject).flat();
  const advancementPercent = (() => {
    if (!allTasks || allTasks.length === 0) return 0;
    const total = allTasks.reduce((acc, t) => {
      if (typeof t.progress === "number") return acc + Math.max(0, Math.min(100, t.progress));
      return acc + 0;
    }, 0);
    return Math.round(total / allTasks.length);
  })();

  function handleOpenAdd() {
    setForm({ name: "", description: "", managementMethod: "Kanban", startDate: "", endDate: "" });
    setShowAdd(true);
  }

  async function handleSubmitAdd(e) {
    e.preventDefault();
    try {
      setError(null);
      console.log('[Profile] creating project with managementMethod:', form.managementMethod);
      const created = await createProject({ 
        title: form.name, 
        description: form.description, 
        managementMethod: form.managementMethod,
        startDate: form.startDate,
        endDate: form.endDate
      });
      console.log('[Profile] created project:', created);
      setProjects(prev => [created, ...prev]);
      setShowAdd(false);
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDeleteProject(projectId, e) {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        setError(null);
        await deleteProject(projectId);
        setProjects(prev => prev.filter(p => p._id !== projectId));
      } catch (err) {
        setError(err.message);
      }
    }
  }

  return (
    <div className="profile-container">
      <div className="profile-inner">
        <header className="profile-header">
          <div>
            <h1>Dashboard</h1>
            <p>Welcome{user?.firstName ? `, ${user.firstName}` : ""} — here's a quick overview of your projects</p>
          </div>
          <div className="header-buttons">
            <button className="btn primary" onClick={handleOpenAdd}>Add project</button>
          </div>
        </header>

        {error && <p className="muted" style={{ color: "red" }}>{error}</p>}
        {loading && <p className="muted">Loading...</p>}

        <section className="profile-stats stats-row">
          <div className="stat">
            <div className="stat-value">{counts.activeProjects}</div>
            <div className="stat-label">Active projects</div>
          </div>
          <div className="stat">
            <div className="stat-value">{counts.upcomingTasks}</div>
            <div className="stat-label">Upcoming tasks</div>
          </div>
          <div className="stat">
            <div className="stat-value">{counts.teams}</div>
            <div className="stat-label">Teams</div>
          </div>
          <div className="stat">
            <div className="stat-value">{advancementPercent}%</div>
            <div className="stat-label">Overall progress</div>
          </div>
        </section>

        <div className="main-grid">
          <main className="projects-column">
            <h2 className="section-title">Your projects</h2>
            <section className="project-list">
              {projects.length === 0 && <p className="muted">No projects yet. Add one!</p>}
              {projects.map((p) => (
                <article key={p._id} className="project-card" onClick={() => navigate(`/project/${p._id}`)}>
                  <div className="card-header">
                    <div>
                      <h3>{p.title}</h3>
                      <p className="muted small">{p.description}</p>
                      <p className="muted small">Method: <strong>{p.managementMethod || 'Kanban'}</strong></p>
                    </div>
                    <button 
                      className="btn-card-delete"
                      onClick={(e) => handleDeleteProject(p._id, e)}
                      title="Delete project"
                    >
                      Delete
                    </button>
                  </div>
                  <div className="meta">
                    <span>{p.members?.length || 0} members</span>
                    <span>{(tasksByProject[p._id] || []).length} tasks</span>
                  </div>
                </article>
              ))}
            </section>
          </main>

          <aside className="sidebar">
            <h3>Upcoming Tasks</h3>
            <ul className="upcoming-list">
              {Object.values(tasksByProject).flat().slice(0,5).map(t => (
                <li key={t._id} className="upcoming-item">{t.title || 'Untitled task'}</li>
              ))}
              {Object.values(tasksByProject).flat().length === 0 && <li className="muted">No upcoming tasks</li>}
            </ul>
          </aside>
        </div>
      </div>

      {showAdd && (
        <div className="modal" onClick={() => setShowAdd(false)}>
          <div className="modal-inner" onClick={e=>e.stopPropagation()}>
            <h2>New Project</h2>
            <form onSubmit={handleSubmitAdd} className="form">
              <label>
                Name
                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
              </label>
              <label>
                Description
                <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
              </label>
              <label>
                Management method
                <select value={form.managementMethod} onChange={e => setForm(f => ({ ...f, managementMethod: e.target.value }))}>
                  <option value="Kanban">Kanban</option>
                  <option value="Scrum">Scrum</option>
                  <option value="Waterfall">Waterfall</option>
                </select>
              </label>
              
              <label>
                Start date
                <input 
                  type="date" 
                  value={form.startDate} 
                  onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))} 
                />
              </label>
              
              <label>
                End date
                <input 
                  type="date" 
                  value={form.endDate} 
                  onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))} 
                />
              </label>

              <div className="actions">
                <button type="button" className="btn" onClick={() => setShowAdd(false)}>Cancel</button>
                <button type="submit" className="btn primary">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

