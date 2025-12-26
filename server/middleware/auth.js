import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config.js';

export const requireAuth = (req, res, next) => {
  const auth = req.headers.authorization || '';
  const token = auth.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
};

export const issueToken = (userId, email, hours = 12) => {
  const exp = Math.floor(Date.now() / 1000) + (hours * 60 * 60);
  return jwt.sign({ userId, email, exp }, JWT_SECRET);
};
