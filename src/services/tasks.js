import { apiFetch } from "./api";

export const listTasks = (projectId) => apiFetch(`/projects/${projectId}/tasks`);

export const createTask = (projectId, payload) =>
  apiFetch(`/projects/${projectId}/tasks`, {
    method: "POST",
    body: JSON.stringify(payload)
  });

export const updateTask = (taskId, payload) =>
  apiFetch(`/tasks/${taskId}`, {
    method: "PUT",
    body: JSON.stringify(payload)
  });

export const deleteTask = (taskId) => apiFetch(`/tasks/${taskId}`, { method: "DELETE" });
