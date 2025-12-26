import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  firstName: String,
  lastName: String,
  profession: String,
  birthDate: String
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);
