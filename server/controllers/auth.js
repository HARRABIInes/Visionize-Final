/**
 * Authentication Controller
 * 
 * Handles user registration and login:
 * - POST /api/auth/signup - Register new user
 * - POST /api/auth/signin - Login existing user
 * 
 * Uses bcrypt for password hashing and JWT for session tokens.
 */

import express from 'express';
import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { issueToken } from '../middleware/auth.js';

const router = express.Router();

// ========================================
// POST /api/auth/signup - Register New User
// ========================================
router.post('/signup', async (req, res) => {
  try {
    // Extract user data from request body
    const { email, password, firstName, lastName, profession, birthDate } = req.body;
    
    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }
    
    // Check if user already exists
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    // Hash password with bcrypt (salt rounds: 10)
    const passwordHash = await bcrypt.hash(password, 10);
    
    // Create new user document in MongoDB
    const user = await User.create({
      email,
      passwordHash, // Store hashed password (never plain text)
      firstName,
      lastName,
      profession,
      birthDate
    });
    
    // Return success response
    res.json({ ok: true, userId: user._id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ========================================
// POST /api/auth/signin - Login User
// ========================================
router.post('/signin', async (req, res) => {
  try {
    // Extract credentials from request body
    const { email, password } = req.body;
    
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      // Use generic error to avoid revealing if email exists
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    
    // Compare provided password with stored hash
    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    
    // Generate JWT token valid for 12 hours (default)
    const token = issueToken(user._id.toString(), user.email);
    
    // Return token and user info (exclude passwordHash for security)
    res.json({ 
      token, 
      user: { 
        email: user.email, 
        firstName: user.firstName, 
        lastName: user.lastName 
      } 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
