import express from 'express';
import { Project } from '../models/Project.js';
import { Task } from '../models/Task.js';
import { User } from '../models/User.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// Get all projects for authenticated user
router.get('/', requireAuth, async (req, res) => {
  try {
    const projects = await Project.find({ ownerId: req.user.userId });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create project
router.post('/', requireAuth, async (req, res) => {
  try {
    const { title, description, managementMethod } = req.body;
    console.log('[projects] POST / - body:', JSON.stringify(req.body));
    const project = await Project.create({
      title,
      description,
      managementMethod: managementMethod,
      ownerId: req.user.userId,
      members: []
    });
    console.log('[projects] Created project managementMethod:', project.managementMethod);
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get project by ID
router.get('/:id', requireAuth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update project
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const { title, description, managementMethod } = req.body;
    console.log(`[projects] PUT /${req.params.id} - body:`, JSON.stringify(req.body));
    console.log('[projects] PUT - has managementMethod key:', Object.prototype.hasOwnProperty.call(req.body, 'managementMethod'));
    console.log('[projects] PUT - managementMethod value/type:', managementMethod, typeof managementMethod);
    
    // Build update object with only defined fields
    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (managementMethod !== undefined) updateData.managementMethod = managementMethod;
    
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

// Delete project
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    await Task.deleteMany({ projectId: req.params.id });
    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add member to project
router.post('/:id/members', requireAuth, async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
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

// Remove member from project
router.delete('/:id/members/:memberId', requireAuth, async (req, res) => {
  try {
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
