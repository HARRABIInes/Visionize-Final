/**
 * Tasks Service (tasks.js)
 * 
 * Handles all task-related API calls:
 * - List tasks for a project
 * - Create new tasks
 * - Update task details (status, progress, etc.)
 * - Delete tasks
 */

import { apiFetch } from "./api";

/**
 * Get All Tasks for a Project
 * 
 * @param {string} projectId - Project MongoDB _id
 * @returns {Promise<Array>} Array of task objects
 */
export const listTasks = (projectId) => apiFetch(`/projects/${projectId}/tasks`);

/**
 * Create New Task
 * 
 * @param {string} projectId - Project MongoDB _id
 * @param {Object} payload - Task data
 * @param {string} payload.title - Task title
 * @param {string} payload.description - Task description
 * @param {string} payload.status - "Not Started", "In Progress", "Completed", etc.
 * @param {number} payload.progress - 0-100 percentage
 * @param {string} payload.priority - "Low", "Normal", "High", "Critical"
 * @param {string} payload.type - "Normal", "Critical", "Blocking", "Enhancement"
 * @param {string} payload.responsable - Assigned member email
 * @param {string} payload.startDate - Start date (ISO string)
 * @param {string} payload.endDate - End date (ISO string)
 * @returns {Promise<Object>} Created task object
 */
export const createTask = (projectId, payload) =>
  apiFetch(`/projects/${projectId}/tasks`, {
    method: "POST",
    body: JSON.stringify(payload)
  });

/**
 * Update Existing Task
 * 
 * @param {string} taskId - Task MongoDB _id
 * @param {Object} payload - Fields to update (any task field)
 * @returns {Promise<Object>} Updated task object
 */
export const updateTask = (taskId, payload) =>
  apiFetch(`/tasks/${taskId}`, {
    method: "PUT",
    body: JSON.stringify(payload)
  });

/**
 * Delete Task
 * 
 * @param {string} taskId - Task MongoDB _id
 * @returns {Promise<Object>} { ok: true }
 */
export const deleteTask = (taskId) => apiFetch(`/tasks/${taskId}`, { method: "DELETE" });
