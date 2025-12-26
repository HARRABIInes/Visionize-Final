/**
 * Projects Service (projects.js)
 * 
 * Handles all project-related API calls:
 * - List all projects
 * - Get single project details
 * - Create, update, delete projects
 * - Manage project members
 */

import { apiFetch } from "./api";

/**
 * Get All User's Projects
 * Fetches list of projects owned by current user.
 * 
 * @returns {Promise<Array>} Array of project objects
 */
export const listProjects = () => apiFetch("/projects");

/**
 * Get Single Project Details
 * 
 * @param {string} id - Project MongoDB _id
 * @returns {Promise<Object>} Project object with all details
 */
export const getProject = (id) => apiFetch(`/projects/${id}`);

/**
 * Create New Project
 * 
 * @param {Object} projectData - Project information
 * @param {string} projectData.title - Project title
 * @param {string} projectData.description - Project description
 * @param {string} projectData.managementMethod - "Kanban", "Scrum", or "Waterfall"
 * @returns {Promise<Object>} Created project object
 */
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

/**
 * Update Existing Project
 * 
 * @param {string} id - Project MongoDB _id
 * @param {Object} payload - Fields to update (title, description, managementMethod)
 * @returns {Promise<Object>} Updated project object
 */
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

/**
 * Delete Project
 * Also deletes all associated tasks (cascade delete on backend).
 * 
 * @param {string} id - Project MongoDB _id
 * @returns {Promise<Object>} { ok: true }
 */
export const deleteProject = (id) =>
  apiFetch(`/projects/${id}`, { method: "DELETE" });

/**
 * Add Team Member to Project
 * 
 * @param {string} id - Project MongoDB _id
 * @param {string} email - Member's email address
 * @returns {Promise<Object>} Updated project with new member
 */
export const addMember = (id, email) =>
  apiFetch(`/projects/${id}/members`, {
    method: "POST",
    body: JSON.stringify({ email })
  });

/**
 * Remove Team Member from Project
 * 
 * @param {string} id - Project MongoDB _id
 * @param {string} memberId - Member's email address
 * @returns {Promise<Object>} Updated project without removed member
 */
export const removeMember = (id, memberId) =>
  apiFetch(`/projects/${id}/members/${memberId}`, { method: "DELETE" });
