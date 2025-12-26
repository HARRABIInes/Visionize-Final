/**
 * Visionise Backend - Express Server
 * 
 * This is the main entry point of the backend API.
 * It handles:
 * - Database connection to MongoDB
 * - CORS configuration for frontend communication
 * - API routes for authentication, projects, and tasks
 * - Middleware setup (JSON parsing, authentication)
 */

import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { MONGODB_URI, DB_NAME, FRONTEND_ORIGIN, PORT } from './config.js';
import authRoutes from './controllers/auth.js';
import projectsRoutes from './controllers/projects.js';
import tasksRoutes from './controllers/tasks.js';

// Load environment variables from .env file
dotenv.config();

// Initialize Express application
const app = express();

// ========================================
// MIDDLEWARE CONFIGURATION
// ========================================

// CORS: Allow frontend to communicate with backend
// Split allowed origins by comma for multiple environments (dev, prod)
const allowedOrigins = (FRONTEND_ORIGIN || '').split(',').map(s => s.trim()).filter(Boolean);
app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true); // Allow tools like Postman/curl
    if (allowedOrigins.length === 0) return cb(null, true); // Allow all if not configured
    if (allowedOrigins.includes(origin)) return cb(null, true); // Check whitelist
    return cb(new Error('Not allowed by CORS'));
  },
  credentials: true // Allow cookies and authorization headers
}));

// Parse JSON request bodies automatically
app.use(express.json());

// ========================================
// API ROUTES
// ========================================

// Authentication routes: /api/auth/signup, /api/auth/signin
app.use('/api/auth', authRoutes);

// Project management routes: /api/projects (GET, POST, PUT, DELETE)
app.use('/api/projects', projectsRoutes);

// Task management routes: /api/tasks, /api/projects/:id/tasks
app.use('/api', tasksRoutes);

// Health check endpoint to verify server and database status
app.get('/api/health', (req, res) => {
  res.json({ 
    ok: true, 
    db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    dbName: DB_NAME
  });
});

// ========================================
// DATABASE CONNECTION & SERVER START
// ========================================

// Connect to MongoDB Atlas using Mongoose ODM
mongoose.connect(MONGODB_URI, { dbName: DB_NAME })
  .then(() => {
    console.log(`✅ Connected to MongoDB database: ${DB_NAME}`);
    
    // Start Express server only after successful DB connection
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
    });
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1); // Exit if database connection fails
  });
