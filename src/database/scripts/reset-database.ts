import { connectToDatabase, disconnectFromDatabase } from '../config/connection';
import { Property } from '../models/property.model';

/**
 * Reset the entire database - drops all data and recreates with fresh schema
 * This is useful when you have major schema changes and want a clean start
 */
export const resetDatabase = async (): Promise<void> => {
  try {
    console.log('🔄 Starting database reset...');

    // Connect to database
    await connectToDatabase();

    // Drop the entire properties collection
    console.log('🗑️  Dropping properties collection...');
    try {
      await Property.collection.drop();
      console.log('✅ Properties collection dropped');
    } catch (error: any) {
      if (error.code === 26) {
        console.log('ℹ️  Properties collection does not exist, skipping drop');
      } else {
        throw error;
      }
    }

    // Drop migration collections to reset migration state
    console.log('🗑️  Clearing migration history...');
    try {
      const db = Property.db;
      await db.collection('migrations_changelog').drop();
      await db.collection('migrations_changelog_lock').drop();
      console.log('✅ Migration history cleared');
    } catch (error: any) {
      if (error.code === 26) {
        console.log('ℹ️  Migration collections do not exist, skipping drop');
      } else {
        console.log('⚠️  Warning: Could not clear migration history:', error.message);
      }
    }

    // The collection will be recreated automatically when we insert new data
    // with the new schema and indexes defined in the model
    console.log('✅ Database reset completed!');
    console.log('💡 Run "npm run db:seed" to populate with new sample data');

  } catch (error) {
    console.error('❌ Error resetting database:', error);
    throw error;
  }
};

/**
 * Quick reset and reseed in one command
 */
export const resetAndSeed = async (): Promise<void> => {
  try {
    await resetDatabase();
    
    // Import and run seeding
    const { seedProperties } = await import('../seeds/property.seed');
    await seedProperties();
    
    console.log('🎉 Database reset and seeded successfully!');
  } catch (error) {
    console.error('❌ Error during reset and seed:', error);
    throw error;
  }
};

/**
 * Main function to run database reset
 */
const runReset = async (): Promise<void> => {
  try {
    const resetType = process.argv[2] || 'reset';
    
    if (resetType === 'seed') {
      await resetAndSeed();
    } else {
      await resetDatabase();
    }
  } catch (error) {
    console.error('❌ Reset failed:', error);
    process.exit(1);
  } finally {
    await disconnectFromDatabase();
    console.log('👋 Database connection closed');
    process.exit(0);
  }
};

// Run reset if this file is executed directly
if (require.main === module) {
  runReset();
}