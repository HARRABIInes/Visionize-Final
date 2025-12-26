import React from 'react';
import './GanttChart.css';

export default function GanttChart({ tasks }) {
  if (!tasks || tasks.length === 0) {
    return <div className="gantt-empty">No tasks with dates</div>;
  }

  const tasksWithDates = tasks.filter(t => t.startDate && t.endDate);
  if (tasksWithDates.length === 0) {
    return <div className="gantt-empty">No tasks with start and end dates</div>;
  }

  // Trouver la date min et max
  const allDates = tasksWithDates.flatMap(t => [new Date(t.startDate), new Date(t.endDate)]);
  const minDate = new Date(Math.min(...allDates));
  const maxDate = new Date(Math.max(...allDates));
  
  // Générer toutes les dates entre min et max
  const dates = [];
  for (let d = new Date(minDate); d <= maxDate; d.setDate(d.getDate() + 1)) {
    dates.push(new Date(d));
  }

  const totalDays = dates.length;

  const getTaskPosition = (task) => {
    const start = new Date(task.startDate);
    const end = new Date(task.endDate);
    const startDay = Math.floor((start - minDate) / (1000 * 60 * 60 * 24));
    const duration = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
    
    return {
      left: `${(startDay / totalDays) * 100}%`,
      width: `${(duration / totalDays) * 100}%`
    };
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
  };

  const getStatusClass = (status) => {
    const normalized = status?.toLowerCase().replace(/\s+/g, '-') || 'non-demarré';
    return normalized;
  };

  return (
    <div className="gantt-chart">
      <h3>Gantt Chart</h3>
      <div className="gantt-container">
        {/* Timeline header */}
        <div className="gantt-header">
          <div className="task-name-header">Tasks</div>
          <div className="gantt-timeline-header">
            {dates.map((date, i) => {
              // Afficher une date tous les 3 jours pour ne pas surcharger
              if (i % 3 === 0 || i === dates.length - 1) {
                return (
                  <div 
                    key={i} 
                    className="timeline-date"
                    style={{ left: `${(i / totalDays) * 100}%` }}
                  >
                    {formatDate(date)}
                  </div>
                );
              }
              return null;
            })}
          </div>
        </div>

        {/* Tasks */}
        <div className="gantt-tasks">
          {tasksWithDates.map(task => {
            const position = getTaskPosition(task);
            return (
              <div key={task._id} className="gantt-task-row">
                <div className="task-name" title={task.title}>{task.title}</div>
                <div className="task-bar-container">
                  {/* Grid lines */}
                  {dates.map((_, i) => (
                    i % 3 === 0 && (
                      <div 
                        key={i} 
                        className="grid-line"
                        style={{ left: `${(i / totalDays) * 100}%` }}
                      />
                    )
                  ))}
                  <div
                    className={`task-bar ${getStatusClass(task.status)}`}
                    style={position}
                    title={`${task.title}\n${task.startDate} → ${task.endDate}\n${task.status} - ${task.progress}%`}
                  >
                    <span className="task-bar-text">{task.progress}%</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="gantt-legend">
          <div className="legend-item">
            <div className="legend-color not-started"></div>
            <span>Not Started</span>
          </div>
          <div className="legend-item">
            <div className="legend-color in-progress"></div>
            <span>In Progress</span>
          </div>
          <div className="legend-item">
            <div className="legend-color completed"></div>
            <span>Completed</span>
          </div>
          <div className="legend-item">
            <div className="legend-color cancelled"></div>
            <span>Cancelled</span>
          </div>
        </div>
      </div>
    </div>
  );
}
