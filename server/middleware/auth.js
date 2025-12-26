/**
 * Authentication Middleware
 * 
 * This module provides JWT-based authentication:
 * - requireAuth: Middleware to protect routes (verifies JWT token)
 * - issueToken: Helper to generate JWT tokens for authenticated users
 */

import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config.js';

/**
 * Middleware: Require Authentication
 * 
 * Protects API routes by verifying JWT token from Authorization header.
 * Extracts user information (userId, email) and attaches to req.user.
 * 
 * Usage: app.get('/api/projects', requireAuth, (req, res) => {...})
 */
export const requireAuth = (req, res, next) => {
  // Extract Authorization header (format: "Bearer <token>")
  const auth = req.headers.authorization || '';
  const token = auth.replace('Bearer ', '');
  
  // Reject request if no token provided
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  try {
    // Verify token signature and decode payload
    const payload = jwt.verify(token, JWT_SECRET);
    
    // Attach user info to request object for use in controllers
    req.user = payload; // Contains: { userId, email, exp }
    
    // Continue to next middleware/controller
    next();
  } catch (error) {
    // Token invalid or expired
    return res.status(401).json({ error: 'Unauthorized' });
  }
};

/**
 * Helper: Issue JWT Token
 * 
 * Generates a signed JWT token for authenticated users.
 * Token expires after specified hours (default: 12 hours).
 * 
 * @param {string} userId - User's MongoDB _id
 * @param {string} email - User's email address
 * @param {number} hours - Token validity duration (default 12h)
 * @returns {string} Signed JWT token
 */
export const issueToken = (userId, email, hours = 12) => {
  // Calculate expiration timestamp (Unix epoch seconds)
  const exp = Math.floor(Date.now() / 1000) + (hours * 60 * 60);
  
  // Sign and return JWT with payload
  return jwt.sign({ userId, email, exp }, JWT_SECRET);
};
