import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { MONGODB_URI, DB_NAME } from '../config.js';
import { Project } from '../models/Project.js';

dotenv.config();

async function run() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(MONGODB_URI, { dbName: DB_NAME });
  console.log('Connected to', DB_NAME);

  const result = await Project.updateMany(
    { managementMethod: { $exists: false } },
    { $set: { managementMethod: 'Kanban' } }
  );

  console.log('Update result:', result);
  console.log('Done.');
  await mongoose.disconnect();
}

run().catch(err => {
  console.error('Migration error:', err);
  process.exit(1);
});
