/**
 * Tasks Controller
 * 
 * Handles all task-related operations:
 * - GET /api/projects/:projectId/tasks - Get all tasks for a project
 * - POST /api/projects/:projectId/tasks - Create new task
 * - PUT /api/tasks/:taskId - Update task
 * - DELETE /api/tasks/:taskId - Delete task
 * 
 * All routes are protected with requireAuth middleware (JWT verification).
 */

import express from 'express';
import { Task } from '../models/Task.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// ========================================
// GET /api/projects/:projectId/tasks - Get All Project Tasks
// ========================================
router.get('/projects/:projectId/tasks', requireAuth, async (req, res) => {
  try {
    // Find all tasks belonging to the specified project
    const tasks = await Task.find({ projectId: req.params.projectId });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ========================================
// POST /api/projects/:projectId/tasks - Create New Task
// ========================================
router.post('/projects/:projectId/tasks', requireAuth, async (req, res) => {
  try {
    // Extract task data from request body
    const { title, description, status, progress, priority, assignee, responsable, type, startDate, endDate } = req.body;
    
    console.log('[tasks] POST /projects/' + req.params.projectId + ' body:', JSON.stringify(req.body));
    
    // Create new task document in MongoDB
    const task = await Task.create({
      projectId: req.params.projectId, // Link task to parent project
      title,
      description,
      status: status || 'Non démarré', // Default status if not provided
      // Convert progress to number, default to 0
      progress: typeof progress === 'number' ? progress : (progress ? Number(progress) : 0),
      priority: priority || 'Normal', // Default priority
      type: type || 'Normal', // Default type
      assignee,
      responsable: responsable || '', // Team member assigned to task
      startDate,
      endDate
    });
    
    console.log('[tasks] Created task id:', task._id, 'type/status:', task.type, task.status);
    
    // Return created task with 201 status
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ========================================
// PUT /api/tasks/:taskId - Update Task
// ========================================
router.put('/tasks/:taskId', requireAuth, async (req, res) => {
  try {
    // Extract all possible task fields from request body
    const { title, description, status, progress, priority, assignee, responsable, type, startDate, endDate } = req.body;
    
    console.log('[tasks] PUT /tasks/' + req.params.taskId + ' body:', JSON.stringify(req.body));
    
    // Update task with all provided fields
    // findByIdAndUpdate will only update fields that are defined
    const task = await Task.findByIdAndUpdate(
      req.params.taskId,
      { title, description, status, progress, priority, assignee, responsable, type, startDate, endDate },
      { new: true } // Return updated document
    );
    
    console.log('[tasks] Updated task id:', task?._id, 'type/status:', task?.type, task?.status);
    
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ========================================
// DELETE /api/tasks/:taskId - Delete Task
// ========================================
router.delete('/tasks/:taskId', requireAuth, async (req, res) => {
  try {
    // Permanently delete task document from MongoDB
    await Task.findByIdAndDelete(req.params.taskId);
    
    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
