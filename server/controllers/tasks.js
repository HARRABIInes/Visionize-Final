import express from 'express';
import { Task } from '../models/Task.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// Get all tasks for a project
router.get('/projects/:projectId/tasks', requireAuth, async (req, res) => {
  try {
    const tasks = await Task.find({ projectId: req.params.projectId });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create task
router.post('/projects/:projectId/tasks', requireAuth, async (req, res) => {
  try {
    const { title, description, status, progress, priority, assignee, responsable, type, startDate, endDate } = req.body;
    console.log('[tasks] POST /projects/' + req.params.projectId + ' body:', JSON.stringify(req.body));
    const task = await Task.create({
      projectId: req.params.projectId,
      title,
      description,
      status: status || 'Non démarré',
      progress: typeof progress === 'number' ? progress : (progress ? Number(progress) : 0),
      priority: priority || 'Normal',
      type: type || 'Normal',
      assignee,
      responsable: responsable || '',
      startDate,
      endDate
    });
    console.log('[tasks] Created task id:', task._id, 'type/status:', task.type, task.status);
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update task
router.put('/tasks/:taskId', requireAuth, async (req, res) => {
  try {
    const { title, description, status, progress, priority, assignee, responsable, type, startDate, endDate } = req.body;
    console.log('[tasks] PUT /tasks/' + req.params.taskId + ' body:', JSON.stringify(req.body));
    const task = await Task.findByIdAndUpdate(
      req.params.taskId,
      { title, description, status, progress, priority, assignee, responsable, type, startDate, endDate },
      { new: true }
    );
    console.log('[tasks] Updated task id:', task?._id, 'type/status:', task?.type, task?.status);
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete task
router.delete('/tasks/:taskId', requireAuth, async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.taskId);
    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
