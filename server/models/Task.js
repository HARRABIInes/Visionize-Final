import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  projectId: { type: String, required: true },
  title: { type: String, required: true },
  description: String,
  status: { type: String, enum: ['Not Started', 'In Progress', 'Completed', 'Cancelled', 'Reported'], default: 'Not Started' },
  progress: { type: Number, default: 0 },
  priority: { type: String, enum: ['Low', 'Normal', 'High', 'Critical'], default: 'Normal' },
  type: { type: String, enum: ['Normal', 'Critical', 'Blocking', 'Enhancement'], default: 'Normal' },
  responsable: { type: String, default: '' },
  startDate: String,
  endDate: String
}, { timestamps: true });

export const Task = mongoose.model('Task', taskSchema);
