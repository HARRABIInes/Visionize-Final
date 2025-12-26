/**
 * User Model (Mongoose Schema)
 * 
 * Defines the structure of user documents in MongoDB.
 * Used for authentication and profile management.
 * 
 * Collections: users
 */

import mongoose from 'mongoose';

// Define user schema structure
const userSchema = new mongoose.Schema({
  // Authentication fields
  email: { 
    type: String, 
    required: true, 
    unique: true // Ensures no duplicate emails
  },
  passwordHash: { 
    type: String, 
    required: true // Stored as bcrypt hash (never plain text)
  },
  
  // Profile fields
  firstName: String,
  lastName: String,
  profession: String,
  birthDate: String
}, { 
  timestamps: true // Automatically adds createdAt and updatedAt fields
});

// Export User model for use in controllers
export const User = mongoose.model('User', userSchema);
