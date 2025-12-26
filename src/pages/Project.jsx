import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getProject, updateProject, addMember, removeMember } from "../services/projects";
import { listTasks, createTask, updateTask } from "../services/tasks";
import GanttChart from "../components/GanttChart";
import KanbanBoard from "../components/KanbanBoard";
import ScrumBoard from "../components/ScrumBoard";
import "./Project.css";

export default function Project() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showTask, setShowTask] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);
  const [editTaskForm, setEditTaskForm] = useState(null);
  const [memberEmail, setMemberEmail] = useState("");
  const [activeView, setActiveView] = useState("list");
  const [taskForm, setTaskForm] = useState({ title: "", description: "", startDate: "", endDate: "", type: "Normal", responsable: "" });
  const [projectForm, setProjectForm] = useState({ title: "", description: "", managementMethod: "Kanban" });

  async function handleAddMember(e) {
    e.preventDefault();
    try {
      setError(null);
      await addMember(id, memberEmail);
      setMembers(prev => [...prev, memberEmail]);
      setMemberEmail("");
      setShowAddMember(false);
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleRemoveMember(email) {
    try {
      setError(null);
      await removeMember(id, email);
      setMembers(prev => prev.filter(m => m !== email));
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    const load = async () => {
      try {
        setError(null);
        const p = await getProject(id);
        setProject(p);
        setProjectForm({ title: p.title || "", description: p.description || "", managementMethod: p.managementMethod || "Kanban" });
        // Initialiser activeView basé sur la méthode de gestion
        if (p.managementMethod === 'Kanban') {
          setActiveView('kanban');
        } else if (p.managementMethod === 'Scrum') {
          setActiveView('scrum');
        } else {
          setActiveView('gantt'); // Waterfall = Gantt uniquement
        }
        const t = await listTasks(id);
        setTasks(t);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  // Réinitialiser activeView quand la méthode change
  useEffect(() => {
    if (project) {
      if (project.managementMethod === 'Kanban') {
        setActiveView('kanban');
      } else if (project.managementMethod === 'Scrum') {
        setActiveView('scrum');
      } else {
        setActiveView('gantt'); // Waterfall = Gantt uniquement
      }
    }
  }, [project?.managementMethod]);

  const progress = tasks.length > 0
    ? Math.round((tasks.reduce((a, t) => a + (t.progress || 0), 0) / (tasks.length * 100)) * 100)
    : 0;

  async function handleAddTask(e) {
    e.preventDefault();
    try {
      setError(null);
      const created = await createTask(id, {
        title: taskForm.title || "Untitled Task",
        description: taskForm.description,
        startDate: taskForm.startDate,
        endDate: taskForm.endDate,
        type: taskForm.type,
        responsable: taskForm.responsable,
        status: "Not Started",
        progress: 0,
      });
      setTasks(prev => [created, ...prev]);
      setTaskForm({ title: "", description: "", startDate: "", endDate: "", type: "Normal", responsable: "" });
      setShowTask(false);
    } catch (err) {
      setError(err.message);
    }
  }

  function openEditTask(t, e) {
    if (e?.stopPropagation) e.stopPropagation();
    setEditTaskForm({ ...t });
    setShowEdit(true);
  }

  async function handleSaveEdit(e) {
    e.preventDefault();
    if (!editTaskForm) return;
    try {
      setError(null);
      const updated = await updateTask(editTaskForm._id, {
        title: editTaskForm.title,
        description: editTaskForm.description,
        status: editTaskForm.status,
        progress: editTaskForm.progress,
        startDate: editTaskForm.startDate,
        endDate: editTaskForm.endDate,
        priority: editTaskForm.priority,
        type: editTaskForm.type,
        assignee: editTaskForm.assignee,
        responsable: editTaskForm.responsable,
      });
      setTasks(prev => prev.map(t => t._id === updated._id ? updated : t));
      setShowEdit(false);
      setEditTaskForm(null);
    } catch (err) {
      setError(err.message);
    }
  }

  async function updateProgress(taskId, value) {
    const target = tasks.find(t => t._id === taskId);
    if (!target) return;
    const progressValue = Number(value);
    const status = progressValue >= 100 ? "Completed" : progressValue > 0 ? "In Progress" : target.status || "Not Started";
    const updated = await updateTask(taskId, { ...target, progress: progressValue, status });
    setTasks(prev => prev.map(t => t._id === taskId ? updated : t));
  }

  async function handleSaveProject(e) {
    e.preventDefault();
    try {
      setError(null);
      const payload = { title: projectForm.title, description: projectForm.description, managementMethod: projectForm.managementMethod };
      console.log('[Project] saving project payload:', payload);
      const updated = await updateProject(id, payload);
      console.log('[Project] save response:', updated);
      setProject(updated);
      setProjectForm({ title: updated.title || "", description: updated.description || "", managementMethod: updated.managementMethod || "Kanban" });
      setShowEdit(false);
    } catch (err) {
      setError(err.message);
    }
  }

  if (loading) {
    return <div className="project-page"><p className="muted">Loading...</p></div>;
  }

  if (!project) {
    return (
      <div className="project-page">
        <p>Project not found.</p>
        <button className="btn" onClick={() => navigate(-1)}>Back</button>
      </div>
    );
  }

  return (
    <div className="project-page">
      <header className="project-header">
        <div>
          <h2>{project.title}</h2>
          <p className="muted">{project.description}</p>
          <p className="muted">Method: <strong>{project.managementMethod || 'Kanban'}</strong></p>
        </div>
        <div className="project-controls">
          <button className="btn" onClick={() => navigate(-1)}>Back</button>
          <button className="btn" onClick={() => setShowEdit(true)}>Edit Project</button>
          <button className="btn primary" onClick={() => setShowTask(true)}>Add Task</button>
          <button className="btn" onClick={() => setShowAddMember(true)}>Add Member</button>
        </div>
      </header>

      {error && <p className="muted" style={{ color: "red" }}>{error}</p>}

      <section className="project-overview">
        <div className="progress">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <div className="progress-text">Progress: {progress}%</div>
        </div>

        <div className="members">
          <div className="members-header">
            <h4>Members ({members.length || (project.members || []).length})</h4>
          </div>
          <ul>
            {(members.length > 0 ? members : project.members || []).map((m) => (
              <li key={m} className="member-item">
                <span>{m}</span>
                <button className="btn-remove" onClick={() => handleRemoveMember(m)} title="Remove member">✕</button>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="task-list">
        <h3>Tasks</h3>
        {tasks.length === 0 && <p className="muted">No tasks yet</p>}
        <ul>
          {tasks.map(t => (
            <li key={t._id} className="task-item">
              <div className="task-left">
                <strong>{t.title}</strong>
                <p className="muted small">{t.description}</p>
                <div className="task-meta">
                  <span className={`badge priority ${t.priority || 'normal'}`}>{t.priority || 'Normal'}</span>
                  <span className="badge date">{t.endDate ? new Date(t.endDate).toLocaleDateString() : 'No due'}</span>
                </div>
              </div>
              <div className="task-right">
                <select className="status-select" value={t.status || 'Not Started'} onChange={async e=> {
                  const updated = await updateTask(t._id, { ...t, status: e.target.value });
                  setTasks(prev => prev.map(x => x._id === t._id ? updated : x));
                }}>
                  <option>Not Started</option>
                  <option>In Progress</option>
                  <option>Completed</option>
                  <option>Cancelled</option>
                  <option>Reported</option>
                </select>
                <input type="range" min="0" max="100" value={t.progress || 0} onChange={e=> updateProgress(t._id, e.target.value)} />
                <span className="small">{t.progress || 0}%</span>
                <button className="task-menu-btn" onClick={(e)=>openEditTask(t,e)} title="Edit task">⋯</button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="views-selector">
        <h4>Visualization:</h4>
        {/* Kanban: Kanban Board + Gantt Chart */}
        {project.managementMethod === 'Kanban' && (
          <>
            <button className={`view-btn ${activeView === 'kanban' ? 'active' : ''}`} onClick={() => setActiveView('kanban')}>
              📊 Kanban Board
            </button>
            <button className={`view-btn ${activeView === 'gantt' ? 'active' : ''}`} onClick={() => setActiveView('gantt')}>
              📈 Gantt Chart
            </button>
          </>
        )}
        
        {/* Scrum: Scrum Board + Gantt Chart */}
        {project.managementMethod === 'Scrum' && (
          <>
            <button className={`view-btn ${activeView === 'scrum' ? 'active' : ''}`} onClick={() => setActiveView('scrum')}>
              🎯 Scrum Board
            </button>
            <button className={`view-btn ${activeView === 'gantt' ? 'active' : ''}`} onClick={() => setActiveView('gantt')}>
              📈 Gantt Chart
            </button>
          </>
        )}
        
        {/* Waterfall: Seulement Gantt Chart */}
        {project.managementMethod === 'Waterfall' && (
          <button className={`view-btn active`}>
            📈 Gantt Chart
          </button>
        )}
      </section>

      {activeView === 'kanban' && <KanbanBoard tasks={tasks} onUpdateTask={(taskId, data) => updateTask(taskId, data).then(updated => setTasks(prev => prev.map(t => t._id === taskId ? updated : t)))} />}
      
      {activeView === 'gantt' && <GanttChart tasks={tasks} />}
      
      {activeView === 'scrum' && <ScrumBoard tasks={tasks} members={members} />}

      {showTask && (
        <div className="modal" onClick={() => setShowTask(false)}>
          <div className="modal-inner" onClick={e=>e.stopPropagation()}>
            <h3>New Task</h3>
            <form onSubmit={handleAddTask} className="form">
              <label>
                Name
                <input value={taskForm.title} onChange={e=>setTaskForm(f=>({...f, title: e.target.value}))} required />
              </label>
              <label>
                Description
                <textarea value={taskForm.description} onChange={e=>setTaskForm(f=>({...f, description: e.target.value}))} />
              </label>
              <label>
                Task Type
                <select value={taskForm.type} onChange={e=>setTaskForm(f=>({...f, type: e.target.value}))}>
                  <option>Normal</option>
                  <option>Critical</option>
                  <option>Blocking</option>
                  <option>Enhancement</option>
                </select>
              </label>
              <label>
                Responsible
                <select value={taskForm.responsable} onChange={e=>setTaskForm(f=>({...f, responsable: e.target.value}))}>
                  <option value="">Select a responsible</option>
                  {(members.length > 0 ? members : project.members || []).map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
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
              <div className="actions">
                <button type="button" className="btn" onClick={() => setShowTask(false)}>Cancel</button>
                <button type="submit" className="btn primary">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEdit && editTaskForm && (
        <div className="modal" onClick={() => setShowEdit(false)}>
          <div className="modal-inner" onClick={e=>e.stopPropagation()}>
            <h3>Edit Task</h3>
            <form onSubmit={handleSaveEdit} className="form">
              <label>
                Name
                <input value={editTaskForm.title} onChange={e=>setEditTaskForm(f=>({...f, title: e.target.value}))} required />
              </label>
              <label>
                Description
                <textarea value={editTaskForm.description} onChange={e=>setEditTaskForm(f=>({...f, description: e.target.value}))} />
              </label>
              <label>
                Status
                <select value={editTaskForm.status || 'Not Started'} onChange={e=>setEditTaskForm(f=>({...f, status: e.target.value}))}>
                  <option>Not Started</option>
                  <option>In Progress</option>
                  <option>Completed</option>
                  <option>Cancelled</option>
                  <option>Reported</option>
                </select>
              </label>
              <label>
                Priority
                <select value={editTaskForm.priority || 'Normal'} onChange={e=>setEditTaskForm(f=>({...f, priority: e.target.value}))}>
                  <option>Low</option>
                  <option>Normal</option>
                  <option>High</option>
                  <option>Critical</option>
                </select>
              </label>
              <label>
                Task Type
                <select value={editTaskForm.type || 'Normal'} onChange={e=>setEditTaskForm(f=>({...f, type: e.target.value}))}>
                  <option>Normal</option>
                  <option>Critical</option>
                  <option>Blocking</option>
                  <option>Enhancement</option>
                </select>
              </label>
              <label>
                Responsible
                <select value={editTaskForm.responsable || ''} onChange={e=>setEditTaskForm(f=>({...f, responsable: e.target.value}))}>
                  <option value="">Select a responsible</option>
                  {(members.length > 0 ? members : project.members || []).map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </label>
              <label>
                Progress (%)
                <input type="number" min="0" max="100" value={editTaskForm.progress || 0} onChange={e=>setEditTaskForm(f=>({...f, progress: Number(e.target.value)}))} />
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
              <div className="actions">
                <button type="button" className="btn" onClick={() => {setShowEdit(false); setEditTaskForm(null);}}>Cancel</button>
                <button type="submit" className="btn primary">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEdit && project && !editTaskForm && (
        <div className="modal" onClick={() => setShowEdit(false)}>
          <div className="modal-inner" onClick={e=>e.stopPropagation()}>
            <h3>Edit Project</h3>
            <form onSubmit={handleSaveProject} className="form">
              <label>
                Name
                <input value={projectForm.title} onChange={e=>setProjectForm(f=>({...f, title: e.target.value}))} required />
              </label>
              <label>
                Description
                <textarea value={projectForm.description} onChange={e=>setProjectForm(f=>({...f, description: e.target.value}))} />
              </label>
              <label>
                Management Method
                <select value={projectForm.managementMethod || 'Kanban'} onChange={e=>setProjectForm(f=>({...f, managementMethod: e.target.value}))}>
                  <option value="Kanban">Kanban</option>
                  <option value="Scrum">Scrum</option>
                  <option value="Waterfall">Waterfall</option>
                </select>
              </label>

              <div className="actions">
                <button type="button" className="btn" onClick={()=>setShowEdit(false)}>Cancel</button>
                <button type="submit" className="btn primary">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showAddMember && (
        <div className="modal" onClick={() => setShowAddMember(false)}>
          <div className="modal-inner" onClick={e=>e.stopPropagation()}>
            <h3>Add Member</h3>
            <form onSubmit={handleAddMember} className="form">
              <label>
                Member Email
                <input 
                  type="email"
                  value={memberEmail} 
                  onChange={e=>setMemberEmail(e.target.value)} 
                  placeholder="example@email.com"
                  required 
                />
              </label>
              <div className="actions">
                <button type="button" className="btn" onClick={() => setShowAddMember(false)}>Cancel</button>
                <button type="submit" className="btn primary">Add</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
