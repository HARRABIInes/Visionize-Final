import mongoose from 'mongoose';
import { Project } from '../models/Project.js';
import { MONGODB_URI, DB_NAME } from '../config.js';

async function migrateProjects() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI, { dbName: DB_NAME });
    console.log('Connected successfully');

    // Find all projects that don't have managementMethod field
    const projectsWithoutMethod = await Project.find({
      managementMethod: { $exists: false }
    });

    console.log(`Found ${projectsWithoutMethod.length} projects without managementMethod`);

    if (projectsWithoutMethod.length === 0) {
      console.log('All projects already have managementMethod field');
      await mongoose.connection.close();
      return;
    }

    // Update all projects without managementMethod
    const result = await Project.updateMany(
      { managementMethod: { $exists: false } },
      { $set: { managementMethod: 'Kanban' } }
    );

    console.log(`Updated ${result.modifiedCount} projects`);
    console.log('Migration completed successfully');

    // Verify the update
    const updatedProjects = await Project.find({});
    console.log('\nAll projects:');
    updatedProjects.forEach(p => {
      console.log(`- ${p.title}: ${p.managementMethod}`);
    });

    await mongoose.connection.close();
    console.log('\nDatabase connection closed');
  } catch (error) {
    console.error('Migration failed:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
}

migrateProjects();
