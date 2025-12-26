import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { MONGODB_URI, DB_NAME, FRONTEND_ORIGIN, PORT } from './config.js';
import authRoutes from './controllers/auth.js';
import projectsRoutes from './controllers/projects.js';
import tasksRoutes from './controllers/tasks.js';

dotenv.config();

const app = express();

// Middleware
const allowedOrigins = (FRONTEND_ORIGIN || '').split(',').map(s => s.trim()).filter(Boolean);
app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true); // allow curl/postman
    if (allowedOrigins.length === 0) return cb(null, true);
    if (allowedOrigins.includes(origin)) return cb(null, true);
    return cb(new Error('Not allowed by CORS'));
  },
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api', tasksRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    ok: true, 
    db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    dbName: DB_NAME
  });
});

// Connect to MongoDB and start server
mongoose.connect(MONGODB_URI, { dbName: DB_NAME })
  .then(() => {
    console.log(`✅ Connected to MongoDB database: ${DB_NAME}`);
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
    });
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  });
