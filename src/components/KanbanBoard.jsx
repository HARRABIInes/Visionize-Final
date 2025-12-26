import React from 'react';
import './KanbanBoard.css';

export default function KanbanBoard({ tasks, onUpdateTask }) {
  const columns = ['Not Started', 'In Progress', 'Completed', 'Cancelled'];

  const handleDragStart = (e, task) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('taskId', task._id);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, status) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    const task = tasks.find(t => t._id === taskId);
    if (task && task.status !== status) {
      onUpdateTask(taskId, { ...task, status });
    }
  };

  return (
    <div className="kanban-board">
      <h3>Kanban Board</h3>
      <div className="kanban-columns">
        {columns.map(status => (
          <div key={status} className="kanban-column">
            <div className="column-header">{status}</div>
            <div
              className="column-content"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, status)}
            >
              {tasks
                .filter(t => (t.status || 'Not Started') === status)
                .map(task => (
                  <div
                    key={task._id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, task)}
                    className={`kanban-card ${task.priority?.toLowerCase() || 'normal'}`}
                  >
                    <div className="task-header">
                      <h4>{task.title}</h4>
                      <span className={`priority ${task.priority?.toLowerCase() || 'normal'}`}>
                        {task.priority || 'Normal'}
                      </span>
                    </div>
                    <p className="description">{task.description}</p>
                    {(task.startDate || task.endDate) && (
                      <div className="card-dates">
                        {task.startDate && <span className="date">📅 {new Date(task.startDate).toLocaleDateString()}</span>}
                        {task.endDate && <span className="date">📅 {new Date(task.endDate).toLocaleDateString()}</span>}
                      </div>
                    )}
                    <div className="task-info">
                      <span className="assignee">👤 {task.responsable || 'Unassigned'}</span>
                      <span className="type">📌 {task.type || 'Normal'}</span>
                    </div>
                    <div className="task-progress">
                      <div className="progress-bar">
                        <div
                          className="progress-fill"
                          style={{ width: `${task.progress || 0}%` }}
                        />
                      </div>
                      <span className="progress-text">{task.progress || 0}%</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
