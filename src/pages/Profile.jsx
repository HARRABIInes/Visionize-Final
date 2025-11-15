import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Profile.css";

const STORAGE_KEY = "visionize_projects";

function loadProjects() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveProjects(projects) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}

export default function Profile() {
  const [projects, setProjects] = useState(() => loadProjects());
  const [showAdd, setShowAdd] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const [form, setForm] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    methodology: "scrum",
    members: "",
  });

  useEffect(() => {
    saveProjects(projects);
  }, [projects]);

  const counts = {
    activeProjects: projects.filter((p) => p.active !== false).length,
    upcomingTasks: projects.reduce((acc, p) => acc + (p.tasks?.filter(t => !t.done).length || 0), 0),
    teams: new Set(projects.flatMap(p => p.members || [])).size,
  };

  // compute overall advancement percentage across all tasks
  const allTasks = projects.flatMap(p => p.tasks || []);
  const advancementPercent = (() => {
    if (!allTasks || allTasks.length === 0) return 0;
    const total = allTasks.reduce((acc, t) => {
      if (typeof t.progress === 'number') return acc + Math.max(0, Math.min(100, t.progress));
      if (t.done) return acc + 100;
      return acc + 0;
    }, 0);
    return Math.round(total / allTasks.length);
  })();

  function handleOpenAdd() {
    setForm({ name: "", description: "", startDate: "", endDate: "", methodology: "scrum", members: "" });
    setShowAdd(true);
  }

  function handleSubmitAdd(e) {
    e.preventDefault();
    const members = form.members
      .split(",")
      .map(s => s.trim())
      .filter(Boolean);
    const newProject = {
      id: Date.now().toString(),
      name: form.name || "Untitled",
      description: form.description || "",
      startDate: form.startDate || null,
      endDate: form.endDate || null,
      methodology: form.methodology,
      members,
      tasks: [],
      active: true,
    };
    setProjects(prev => [newProject, ...prev]);
    setShowAdd(false);
  }

  return (
    <div className="profile-container">
      <div className="profile-inner">
        <header className="profile-header">
          <div>
            <h1>Dashboard</h1>
            <p>Bienvenue {user?.firstName ? `, ${user.firstName}` : ""} — voici un aperçu rapide de vos projets</p>
          </div>
          <div className="header-buttons">
            <button className="btn primary" onClick={handleOpenAdd}>Ajouter un projet</button>
          </div>
        </header>

        <section className="profile-stats stats-row">
          <div className="stat">
            <div className="stat-value">{counts.activeProjects}</div>
            <div className="stat-label">Projets actifs</div>
          </div>
          <div className="stat">
            <div className="stat-value">{counts.upcomingTasks}</div>
            <div className="stat-label">Tâches à venir</div>
          </div>
          <div className="stat">
            <div className="stat-value">{counts.teams}</div>
            <div className="stat-label">Équipes</div>
          </div>
          <div className="stat">
            <div className="stat-value">{advancementPercent}%</div>
            <div className="stat-label">Progression globale</div>
          </div>
        </section>

        <div className="main-grid">
          <main className="projects-column">
            <h2 className="section-title">Vos projets</h2>
            <section className="project-list">
              {projects.length === 0 && <p className="muted">Pas encore de projets. Ajoutez-en un !</p>}
              {projects.map((p) => (
                <article key={p.id} className="project-card" onClick={() => navigate(`/project/${p.id}`)}>
                  <h3>{p.name}</h3>
                  <p className="muted small">{p.description}</p>
                  <div className="meta">
                    <span>{p.methodology}</span>
                    <span>{p.members?.length || 0} membres</span>
                    <span>{p.tasks?.length || 0} tâches</span>
                  </div>
                </article>
              ))}
            </section>
          </main>

          <aside className="sidebar">
            <h3>Tâches à venir</h3>
            <ul className="upcoming-list">
              {projects.flatMap(p => p.tasks || []).slice(0,5).map(t => (
                <li key={t.id} className="upcoming-item">{t.name || 'Tâche sans titre'}</li>
              ))}
              {projects.flatMap(p => p.tasks || []).length === 0 && <li className="muted">Pas de tâches à venir</li>}
            </ul>
          </aside>
        </div>
      </div>

      {showAdd && (
        <div className="modal" onClick={() => setShowAdd(false)}>
          <div className="modal-inner" onClick={e=>e.stopPropagation()}>
            <h2>Nouveau projet</h2>
            <form onSubmit={handleSubmitAdd} className="form">
              <label>
                Nom
                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
              </label>
              <label>
                Description
                <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
              </label>
              <div className="row">
                <label>
                  Début
                  <input type="date" value={form.startDate} onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))} />
                </label>
                <label>
                  Fin
                  <input type="date" value={form.endDate} onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))} />
                </label>
              </div>
              <label>
                Méthodologie
                <select value={form.methodology} onChange={e => setForm(f => ({ ...f, methodology: e.target.value }))}>
                  <option value="waterfall">Cascade</option>
                  <option value="scrum">Scrum</option>
                  <option value="kanban">Kanban</option>
                </select>
              </label>
              <label>
                Membres (emails séparés par des virgules)
                <input value={form.members} onChange={e => setForm(f => ({ ...f, members: e.target.value }))} placeholder="a@x.com, b@y.com" />
              </label>

              <div className="actions">
                <button type="button" className="btn" onClick={() => setShowAdd(false)}>Annuler</button>
                <button type="submit" className="btn primary">Créer</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

