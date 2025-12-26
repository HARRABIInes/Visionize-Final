/**
 * Project Model (Mongoose Schema)
 * 
 * Defines the structure of project documents in MongoDB.
 * Each project has a title, description, owner, team members,
 * and a management method (Kanban, Scrum, or Waterfall).
 * 
 * Collections: projects
 */

import mongoose from 'mongoose';

// Define project schema structure
const projectSchema = new mongoose.Schema({
  // Basic project information
  title: { 
    type: String, 
    required: true // Project must have a title
  },
  description: String, // Optional project description
  
  // Ownership and team
  ownerId: { 
    type: String, 
    required: true // User ID of project creator
  },
  members: [String], // Array of member email addresses
  
  // Project management methodology
  managementMethod: { 
    type: String, 
    enum: ['Kanban', 'Scrum', 'Waterfall'], // Only these values allowed
    default: 'Kanban' // Default to Kanban if not specified
  },
  
  // Project timeline
  startDate: String, // Project start date (ISO date string)
  endDate: String    // Project end date (ISO date string)
}, { 
  timestamps: true // Automatically adds createdAt and updatedAt
});

// Export Project model for use in controllers
export const Project = mongoose.model('Project', projectSchema);
