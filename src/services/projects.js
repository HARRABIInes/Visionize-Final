import { apiFetch } from "./api";

export const listProjects = () => apiFetch("/projects");

export const getProject = (id) => apiFetch(`/projects/${id}`);

export const createProject = ({ title, description, managementMethod }) =>
  (async () => {
    const body = { title, description, managementMethod };
    console.log('[services/projects] createProject payload:', body);
    const res = await apiFetch("/projects", {
      method: "POST",
      body: JSON.stringify(body)
    });
    console.log('[services/projects] createProject response:', res);
    return res;
  })();

export const updateProject = (id, payload) =>
  (async () => {
    console.log('[services/projects] updateProject payload:', { id, ...payload });
    const res = await apiFetch(`/projects/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload)
    });
    console.log('[services/projects] updateProject response:', res);
    return res;
  })();

export const deleteProject = (id) =>
  apiFetch(`/projects/${id}`, { method: "DELETE" });

export const addMember = (id, email) =>
  apiFetch(`/projects/${id}/members`, {
    method: "POST",
    body: JSON.stringify({ email })
  });

export const removeMember = (id, memberId) =>
  apiFetch(`/projects/${id}/members/${memberId}`, { method: "DELETE" });
