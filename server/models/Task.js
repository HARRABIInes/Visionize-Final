/**
 * Task Model (Mongoose Schema)
 * 
 * Defines the structure of task documents in MongoDB.
 * Each task belongs to a project and has properties like status,
 * priority, progress, assignee, and dates.
 * 
 * Collections: tasks
 */

import mongoose from 'mongoose';

// Define task schema structure
const taskSchema = new mongoose.Schema({
  // Task relationship
  projectId: { 
    type: String, 
    required: true // Reference to parent project
  },
  
  // Basic task information
  title: { 
    type: String, 
    required: true // Task must have a title
  },
  description: String, // Optional detailed description
  
  // Task workflow status
  status: { 
    type: String, 
    enum: ['Not Started', 'In Progress', 'Completed', 'Cancelled', 'Reported'],
    default: 'Not Started'
  },
  
  // Progress tracking
  progress: { 
    type: Number, 
    default: 0, // 0-100 percentage
    min: 0,
    max: 100
  },
  
  // Task classification
  priority: { 
    type: String, 
    enum: ['Low', 'Normal', 'High', 'Critical'],
    default: 'Normal'
  },
  type: { 
    type: String, 
    enum: ['Normal', 'Critical', 'Blocking', 'Enhancement'],
    default: 'Normal'
  },
  
  // Task assignment
  responsable: { 
    type: String, 
    default: '' // Email of assigned team member
  },
  
  // Timeline
  startDate: String, // ISO date string
  endDate: String    // ISO date string
}, { 
  timestamps: true // Automatically adds createdAt and updatedAt
});

// Export Task model for use in controllers
export const Task = mongoose.model('Task', taskSchema);
