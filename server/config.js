import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const envPath = fileURLToPath(new URL('.env', import.meta.url));
dotenv.config({ path: envPath });

export const MONGODB_URI = process.env.MONGODB_URI;
export const DB_NAME = process.env.DB_NAME || 'visionise';
export const JWT_SECRET = process.env.JWT_SECRET || 'change-me';
export const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || 'http://localhost:5173';
export const PORT = process.env.PORT || 5000;
