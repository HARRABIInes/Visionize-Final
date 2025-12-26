import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  ownerId: { type: String, required: true },
  members: [String],
  managementMethod: { type: String, enum: ['Kanban', 'Scrum', 'Waterfall'], default: 'Kanban' }
}, { timestamps: true });

export const Project = mongoose.model('Project', projectSchema);
