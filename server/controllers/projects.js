/**
 * Projects Controller
 * 
 * Handles all project-related operations:
 * - GET /api/projects - List all user's projects
 * - POST /api/projects - Create new project
 * - GET /api/projects/:id - Get single project details
 * - PUT /api/projects/:id - Update project
 * - DELETE /api/projects/:id - Delete project and associated tasks
 * - POST /api/projects/:id/members - Add team member
 * - DELETE /api/projects/:id/members/:memberId - Remove team member
 * 
 * All routes are protected with requireAuth middleware (JWT verification).
 */

import express from 'express';
import { Project } from '../models/Project.js';
import { Task } from '../models/Task.js';
import { User } from '../models/User.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// ========================================
// GET /api/projects - Get All User's Projects
// ========================================
router.get('/', requireAuth, async (req, res) => {
  try {
    // Find all projects where current user is the owner
    // req.user.userId comes from JWT token (set by requireAuth middleware)
    const projects = await Project.find({ ownerId: req.user.userId });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ========================================
// POST /api/projects - Create New Project
// ========================================
router.post('/', requireAuth, async (req, res) => {
  try {
    // Extract project data from request body
    const { title, description, managementMethod } = req.body;
    
    console.log('[projects] POST / - body:', JSON.stringify(req.body));
    
    // Create new project document in MongoDB
    const project = await Project.create({
      title,
      description,
      managementMethod: managementMethod, // Kanban, Scrum, or Waterfall
      ownerId: req.user.userId, // Set current user as owner
      members: [] // Initialize with empty members array
    });
    
    console.log('[projects] Created project managementMethod:', project.managementMethod);
    
    // Return created project with 201 status
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ========================================
// GET /api/projects/:id - Get Single Project
// ========================================
router.get('/:id', requireAuth, async (req, res) => {
  try {
    // Find project by MongoDB _id from URL parameter
    const project = await Project.findById(req.params.id);
    
    // Return 404 if project doesn't exist
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ========================================
// PUT /api/projects/:id - Update Project
// ========================================
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const { title, description, managementMethod } = req.body;
    
    console.log(`[projects] PUT /${req.params.id} - body:`, JSON.stringify(req.body));
    console.log('[projects] PUT - has managementMethod key:', Object.prototype.hasOwnProperty.call(req.body, 'managementMethod'));
    console.log('[projects] PUT - managementMethod value/type:', managementMethod, typeof managementMethod);
    
    // Build update object with only fields that were provided
    // This allows partial updates (e.g., only changing title)
    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (managementMethod !== undefined) updateData.managementMethod = managementMethod;
    
    // Update project and return updated document
    // new: true returns the updated document (not the old one)
    // runValidators: true ensures enum validation is applied
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    console.log('[projects] Updated project managementMethod:', project?.managementMethod);
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ========================================
// DELETE /api/projects/:id - Delete Project
// ========================================
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    // Delete project document
    await Project.findByIdAndDelete(req.params.id);
    
    // Also delete all tasks associated with this project (cascade delete)
    await Task.deleteMany({ projectId: req.params.id });
    
    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ========================================
// POST /api/projects/:id/members - Add Team Member
// ========================================
router.post('/:id/members', requireAuth, async (req, res) => {
  try {
    const { email } = req.body;
    
    // Verify user exists before adding as member
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Add member email to project's members array
    // $addToSet prevents duplicates (unlike $push)
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { members: email } },
      { new: true }
    );
    
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ========================================
// DELETE /api/projects/:id/members/:memberId - Remove Team Member
// ========================================
router.delete('/:id/members/:memberId', requireAuth, async (req, res) => {
  try {
    // Remove member from project's members array
    // $pull removes all matching values
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { $pull: { members: req.params.memberId } },
      { new: true }
    );
    
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
