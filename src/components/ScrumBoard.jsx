import React from 'react';
import './ScrumBoard.css';

export default function ScrumBoard({ tasks, members }) {
  const statusOrder = ['Not Started', 'In Progress', 'Completed'];
  const tasksByStatus = {};

  statusOrder.forEach(status => {
    tasksByStatus[status] = tasks.filter(t => (t.status || 'Not Started') === status);
  });

  return (
    <div className="scrum-board">
      <h3>Scrum Board</h3>
      <div className="scrum-columns">
        {statusOrder.map(status => (
          <div key={status} className="scrum-column">
            <div className="column-header">
              <h4>{status}</h4>
              <span className="count">{tasksByStatus[status].length}</span>
            </div>
            <div className="scrum-tasks">
              {tasksByStatus[status].map(task => (
                <div key={task._id} className="scrum-task">
                  <div className="task-header">
                    <h5>{task.title}</h5>
                    <span className={`priority ${task.priority?.toLowerCase() || 'normal'}`}>
                      {task.priority || 'Normal'}
                    </span>
                  </div>
                  <p className="description">{task.description}</p>
                  {(task.startDate || task.endDate) && (
                    <div className="task-dates">
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
