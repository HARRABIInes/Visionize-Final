import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./Project.css";

const STORAGE_KEY = "visionize_projects";
const DAY_MS = 1000 * 60 * 60 * 24;
const STATUS_COLORS = {
  "Non démarré": "#9ca3af",
  "En cours": "#2563eb",
  "Terminé": "#10b981",
  "Annulé": "#dc2626",
  "Signalé": "#f97316"
};

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

export default function Project() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [projects, setProjects] = useState(() => loadProjects());
  const [project, setProject] = useState(() => projects.find(p => p.id === id));
  const [showTask, setShowTask] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editTaskForm, setEditTaskForm] = useState(null);
  const [taskForm, setTaskForm] = useState({ name: "", description: "", startDate: "", endDate: "", duration: "", responsible: "" });
  const [inviteEmail, setInviteEmail] = useState("");
  const [diagram, setDiagram] = useState("gantt");
  const [showProjectEdit, setShowProjectEdit] = useState(false);
  const [projectForm, setProjectForm] = useState({ name: "", description: "", startDate: "", endDate: "", methodology: project?.methodology || 'scrum' });

  function updateTaskStatus(taskId, status) {
    // If user sets status to 'Terminé', confirm and optionally set progress to 100%
    const updated = projects.map(p => {
      if (p.id !== project.id) return p;
      return {
        ...p,
        tasks: p.tasks.map(t => {
          if (t.id !== taskId) return t;
          const newTask = { ...t, status };
          if (status === 'Terminé') {
            try {
              const confirmSet = window.confirm('Marquer la tâche comme terminée et fixer la progression à 100 % ?');
              if (confirmSet) {
                newTask.progress = 100;
              }
            } catch {
              // if window.confirm not available, default to setting progress
              newTask.progress = 100;
            }
          }
          return newTask;
        })
      };
    });
    setProjects(updated);
  }

  function openProjectEdit() {
    setProjectForm({
      name: project.name || '',
      description: project.description || '',
      startDate: project.startDate || '',
      endDate: project.endDate || '',
      methodology: project.methodology || 'scrum'
    });
    setShowProjectEdit(true);
  }

  function handleSaveProject(e) {
    e.preventDefault();
    const updated = projects.map(p => p.id === project.id ? { ...p, ...projectForm } : p);
    setProjects(updated);
    setShowProjectEdit(false);
  }

  useEffect(() => {
    setProject(projects.find(p => p.id === id));
  }, [id, projects]);

  useEffect(() => {
    saveProjects(projects);
  }, [projects]);

  if (!project) {
    return (
      <div className="project-page">
        <p>Projet introuvable.</p>
        <button className="btn" onClick={() => navigate(-1)}>Back</button>
      </div>
    );
  }

  const progress = project.tasks && project.tasks.length > 0
    ? Math.round((project.tasks.reduce((a,t)=>a+(t.progress||0),0) / (project.tasks.length*100)) * 100)
    : 0;

  const tasks = project.tasks || [];

  const ganttData = (() => {
    if (!tasks.length) return null;
    const parsed = tasks.map(task => {
      const start = task.startDate ? new Date(task.startDate) : null;
      const end = task.endDate ? new Date(task.endDate) : null;
      return { ...task, start, end };
    });
    const validStarts = parsed.filter(t => t.start).map(t => t.start.getTime());
    const validEnds = parsed.filter(t => t.end).map(t => t.end.getTime());
    const baseStart = validStarts.length ? new Date(Math.min(...validStarts)) : new Date();
    const baseEndRaw = validEnds.length ? new Date(Math.max(...validEnds)) : new Date(baseStart.getTime() + 14 * DAY_MS);
    const paddedEnd = new Date(baseEndRaw.getTime() + DAY_MS);
    const totalDays = Math.max(1, Math.ceil((paddedEnd - baseStart) / DAY_MS));
    const timelineDays = Array.from({ length: totalDays }, (_, i) => new Date(baseStart.getTime() + i * DAY_MS));

    const enriched = parsed.map(task => {
      const start = task.start || baseStart;
      const end = task.end || new Date(start.getTime() + DAY_MS);
      const startOffset = Math.max(0, Math.floor((start - baseStart) / DAY_MS));
      const durationDays = Math.max(1, Math.ceil((end - start) / DAY_MS));
      return { ...task, start, end, startOffset, durationDays };
    });

    return { baseStart, baseEnd: paddedEnd, totalDays, timelineDays, tasks: enriched };
  })();

  const ganttColumnsStyle = ganttData
    ? { gridTemplateColumns: `repeat(${ganttData.totalDays}, var(--gantt-col-width))` }
    : {};

  function handleAddTask(e) {
    e.preventDefault();
    const newTask = {
      id: Date.now().toString(),
      name: taskForm.name || "Untitled Task",
      description: taskForm.description || "",
      startDate: taskForm.startDate || null,
      endDate: taskForm.endDate || null,
      duration: taskForm.duration || null,
      responsible: taskForm.responsible || null,
      progress: 0,
      priority: 'Normal',
      status: 'Non démarré',
    };
    const updated = projects.map(p => p.id === project.id ? { ...p, tasks: [...(p.tasks||[]), newTask] } : p);
    setProjects(updated);
    setShowTask(false);
    setTaskForm({ name: "", description: "", startDate: "", endDate: "", duration: "", responsible: "" });
  }

  function openEditTask(t, e) {
    if (e && e.stopPropagation) e.stopPropagation();
    setEditTaskForm({ ...t });
    setShowEdit(true);
  }

  function handleSaveEdit(e) {
    e.preventDefault();
    if (!editTaskForm) return;
    const updated = projects.map(p => {
      if (p.id !== project.id) return p;
      return { ...p, tasks: p.tasks.map(t => t.id === editTaskForm.id ? { ...t, ...editTaskForm } : t) };
    });
    setProjects(updated);
    setShowEdit(false);
    setEditTaskForm(null);
  }

  function handleInvite() {
    if (!inviteEmail) return;
    const updated = projects.map(p => p.id === project.id ? { ...p, members: [...(p.members||[]), inviteEmail] } : p);
    setProjects(updated);
    setInviteEmail("");
  }

  function updateProgress(taskId, value) {
    const updated = projects.map(p => {
      if (p.id !== project.id) return p;
      return { ...p, tasks: p.tasks.map(t => {
        if (t.id !== taskId) return t;
        const progress = Number(value);
        const status = progress >= 100 ? 'Terminé' : (progress > 0 ? 'En cours' : (t.status || 'Non démarré'));
        return { ...t, progress, status };
      }) };
    });
    setProjects(updated);
  }

  return (
    <div className="project-page">
      <header className="project-header">
        <div>
          <h2>{project.name}</h2>
          <p className="muted">{project.description}</p>
        </div>
        <div className="project-controls">
          <button className="btn" onClick={() => navigate(-1)}>Back</button>
          <button className="btn" onClick={openProjectEdit}>Edit Project</button>
          <button className="btn primary" onClick={() => setShowTask(true)}>Add Task</button>
        </div>
      </header>

      <section className="project-overview">
        <div className="progress">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <div className="progress-text">Progress: {progress}%</div>
        </div>

        <div className="members">
          <h4>Members</h4>
          <ul>
            {(project.members||[]).map((m, i) => <li key={i}>{m}</li>)}
          </ul>
          <div className="invite">
            <input placeholder="email@domain.com" value={inviteEmail} onChange={e=>setInviteEmail(e.target.value)} />
            <button className="btn" onClick={handleInvite}>Invite</button>
          </div>
        </div>
      </section>

      <section className="task-list">
        <h3>Tasks</h3>
        {(!project.tasks || project.tasks.length === 0) && <p className="muted">No tasks yet</p>}
        <ul>
          {(project.tasks||[]).map(t => (
            <li key={t.id} className="task-item">
              <div className="task-left">
                <strong>{t.name}</strong>
                <p className="muted small">{t.description}</p>
                <div className="task-meta">
                  <span className={`badge priority ${t.priority||'normal'}`}>{t.priority? t.priority : 'Normal'}</span>
                  <span className="badge date">{t.endDate ? new Date(t.endDate).toLocaleDateString() : 'No due'}</span>
                </div>
              </div>
              <div className="task-right">
                <select className="status-select" value={t.status || 'Non démarré'} onChange={e=>{ e.stopPropagation(); updateTaskStatus(t.id, e.target.value);}}>
                  <option>Non démarré</option>
                  <option>En cours</option>
                  <option>Terminé</option>
                  <option>Annulé</option>
                  <option>Signalé</option>
                </select>
                <input type="range" min="0" max="100" value={t.progress||0} onChange={e=> { e.stopPropagation(); updateProgress(t.id, e.target.value)} } />
                <span className="small">{t.progress || 0}%</span>
                <button className="task-menu-btn" onClick={(e)=>openEditTask(t,e)} title="Edit task">⋯</button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {showEdit && editTaskForm && (
        <div className="modal" onClick={() => { setShowEdit(false); setEditTaskForm(null); }}>
          <div className="modal-inner" onClick={e=>e.stopPropagation()}>
            <h3>Edit Task</h3>
            <form onSubmit={handleSaveEdit} className="form">
              <label>
                Name
                <input value={editTaskForm.name} onChange={e=>setEditTaskForm(f=>({...f, name: e.target.value}))} required />
              </label>
              <label>
                Description
                <textarea value={editTaskForm.description} onChange={e=>setEditTaskForm(f=>({...f, description: e.target.value}))} />
              </label>
              <div className="row">
                <label>
                  Start
                  <input type="date" value={editTaskForm.startDate || ''} onChange={e=>setEditTaskForm(f=>({...f, startDate: e.target.value}))} />
                </label>
                <label>
                  End
                  <input type="date" value={editTaskForm.endDate || ''} onChange={e=>setEditTaskForm(f=>({...f, endDate: e.target.value}))} />
                </label>
              </div>
              <label>
                Priority
                <select value={editTaskForm.priority || 'Normal'} onChange={e=>setEditTaskForm(f=>({...f, priority: e.target.value}))}>
                  <option>Faible</option>
                  <option>Normal</option>
                  <option>Haute</option>
                  <option>Critique</option>
                </select>
              </label>
              <label>
                Status
                <select value={editTaskForm.status || 'Non démarré'} onChange={e=>setEditTaskForm(f=>({...f, status: e.target.value}))}>
                  <option>Non démarré</option>
                  <option>En cours</option>
                  <option>Terminé</option>
                  <option>Annulé</option>
                  <option>Signalé</option>
                </select>
              </label>
              <label>
                Responsible
                <select value={editTaskForm.responsible || ''} onChange={e=>setEditTaskForm(f=>({...f, responsible: e.target.value}))}>
                  <option value="">-- choose --</option>
                  {(project.members||[]).map((m, i) => <option key={i} value={m}>{m}</option>)}
                </select>
              </label>
              <label>
                Progress
                <input type="range" min="0" max="100" value={editTaskForm.progress || 0} onChange={e=>setEditTaskForm(f=>({...f, progress: Number(e.target.value)}))} />
              </label>

              <div className="actions">
                <button type="button" className="btn" onClick={()=>{ setShowEdit(false); setEditTaskForm(null);}}>Cancel</button>
                <button type="submit" className="btn primary">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showProjectEdit && (
        <div className="modal" onClick={() => setShowProjectEdit(false)}>
          <div className="modal-inner" onClick={e=>e.stopPropagation()}>
            <h3>Edit Project</h3>
            <form onSubmit={handleSaveProject} className="form">
              <label>
                Name
                <input value={projectForm.name} onChange={e=>setProjectForm(f=>({...f, name: e.target.value}))} required />
              </label>
              <label>
                Description
                <textarea value={projectForm.description} onChange={e=>setProjectForm(f=>({...f, description: e.target.value}))} />
              </label>
              <div className="row">
                <label>
                  Start
                  <input type="date" value={projectForm.startDate || ''} onChange={e=>setProjectForm(f=>({...f, startDate: e.target.value}))} />
                </label>
                <label>
                  End
                  <input type="date" value={projectForm.endDate || ''} onChange={e=>setProjectForm(f=>({...f, endDate: e.target.value}))} />
                </label>
              </div>
              <label>
                Methodology
                <select value={projectForm.methodology || 'scrum'} onChange={e=>setProjectForm(f=>({...f, methodology: e.target.value}))}>
                  <option value="waterfall">Waterfall</option>
                  <option value="scrum">Scrum</option>
                  <option value="kanban">Kanban</option>
                </select>
              </label>

              <div className="actions">
                <button type="button" className="btn" onClick={()=>setShowProjectEdit(false)}>Cancel</button>
                <button type="submit" className="btn primary">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <section className="diagrams">
        <h3>Visualize Tasks</h3>
        <select value={diagram} onChange={e=>setDiagram(e.target.value)}>
          <option value="gantt">Gantt Chart</option>
          {project.methodology === 'kanban' && <option value="kanban">Kanban Board</option>}
          {project.methodology === 'scrum' && <option value="scrum">Scrum Board</option>}
        </select>

        {diagram === 'gantt' && (
          <div className="gantt-chart">
            <h4>Gantt Chart — Project Timeline</h4>
            {!tasks.length || !ganttData ? (
              <p className="muted">No tasks to display</p>
            ) : (
              <>
                <div className="gantt-scroll">
                  <div className="gantt-grid">
                    <div className="gantt-header">
                      <div className="gantt-task-column header">Task</div>
                      <div className="gantt-scale" style={ganttColumnsStyle}>
                        {ganttData.timelineDays.map(day => {
                          const isWeekend = day.getDay() === 0 || day.getDay() === 6;
                          return (
                            <div key={day.toISOString()} className={`gantt-scale-cell ${isWeekend ? 'weekend' : ''}`}>
                              <span className="gantt-scale-day">{day.toLocaleDateString('fr-FR', { day: '2-digit' })}</span>
                              <span className="gantt-scale-month">{day.toLocaleDateString('fr-FR', { month: 'short' })}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="gantt-body">
                      {ganttData.tasks.map(task => (
                        <div key={task.id} className="gantt-row">
                          <div className="gantt-task-column">
                            <div className="gantt-task-name">{task.name}</div>
                            <div className="gantt-task-meta">
                              <span>{task.start ? task.start.toLocaleDateString('fr-FR') : '—'} → {task.end ? task.end.toLocaleDateString('fr-FR') : '—'}</span>
                              {task.responsible && <span className="gantt-task-owner">{task.responsible}</span>}
                            </div>
                          </div>
                          <div className="gantt-scale" style={ganttColumnsStyle}>
                            <div
                              className="gantt-bar"
                              style={{
                                gridColumn: `${task.startOffset + 1} / span ${task.durationDays}`,
                                backgroundColor: STATUS_COLORS[task.status] || '#6366f1'
                              }}
                              title={`${task.name} (${task.progress || 0}%)`}
                            >
                              <span className="gantt-bar-label">{Math.round(task.progress || 0)}%</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="gantt-legend">
                  {Object.entries(STATUS_COLORS).map(([status, color]) => (
                    <div key={status} className="gantt-legend-item">
                      <span className="gantt-legend-color" style={{ backgroundColor: color }} />
                      <span>{status}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {diagram === 'kanban' && (
          <div className="kanban-board">
            <h4>Kanban Board — Task Status</h4>
            <div className="kanban-columns">
              {['Non démarré', 'En cours', 'Terminé', 'Annulé', 'Signalé'].map(status => (
                <div key={status} className="kanban-column">
                  <div className="kanban-column-title">{status}</div>
                  <div className="kanban-cards">
                    {(project.tasks||[]).filter(t => (t.status || 'Non démarré') === status).map(t => (
                      <div key={t.id} className="kanban-card" onClick={(e)=>openEditTask(t,e)}>
                        <div className="kanban-card-title">{t.name}</div>
                        <div className="kanban-card-desc">{t.description}</div>
                        <div className="kanban-card-footer">
                          <span className={`badge priority ${t.priority||'normal'}`}>{t.priority||'Normal'}</span>
                          <span className="kanban-card-progress">{t.progress||0}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {diagram === 'scrum' && (
          <div className="kanban-board">
            <h4>Scrum Board — Sprint Tasks</h4>
            <div className="kanban-columns">
              {['Non démarré', 'En cours', 'Terminé', 'Annulé', 'Signalé'].map(status => (
                <div key={status} className="kanban-column">
                  <div className="kanban-column-title">{status}</div>
                  <div className="kanban-cards">
                    {(project.tasks||[]).filter(t => (t.status || 'Non démarré') === status).map(t => (
                      <div key={t.id} className="kanban-card" onClick={(e)=>openEditTask(t,e)}>
                        <div className="kanban-card-title">{t.name}</div>
                        <div className="kanban-card-desc">{t.description}</div>
                        <div className="kanban-card-footer">
                          <span className={`badge priority ${t.priority||'normal'}`}>{t.priority||'Normal'}</span>
                          <span className="kanban-card-progress">{t.progress||0}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {showTask && (
        <div className="modal" onClick={() => setShowTask(false)}>
          <div className="modal-inner" onClick={e=>e.stopPropagation()}>
            <h3>New Task</h3>
            <form onSubmit={handleAddTask} className="form">
              <label>
                Name
                <input value={taskForm.name} onChange={e=>setTaskForm(f=>({...f, name: e.target.value}))} required />
              </label>
              <label>
                Description
                <textarea value={taskForm.description} onChange={e=>setTaskForm(f=>({...f, description: e.target.value}))} />
              </label>
              <div className="row">
                <label>
                  Start
                  <input type="date" value={taskForm.startDate} onChange={e=>setTaskForm(f=>({...f, startDate: e.target.value}))} />
                </label>
                <label>
                  End
                  <input type="date" value={taskForm.endDate} onChange={e=>setTaskForm(f=>({...f, endDate: e.target.value}))} />
                </label>
              </div>
              <label>
                Duration
                <input value={taskForm.duration} onChange={e=>setTaskForm(f=>({...f, duration: e.target.value}))} />
              </label>
              <label>
                Responsible
                <select value={taskForm.responsible} onChange={e=>setTaskForm(f=>({...f, responsible: e.target.value}))}>
                  <option value="">-- choose --</option>
                  {(project.members||[]).map((m, i) => <option key={i} value={m}>{m}</option>)}
                </select>
              </label>

              <div className="actions">
                <button type="button" className="btn" onClick={()=>setShowTask(false)}>Cancel</button>
                <button type="submit" className="btn primary">Add Task</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
