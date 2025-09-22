import { connectToDatabase, disconnectFromDatabase } from '../';
import { Property } from '../models/property.model';
import { Truck } from '../models/truck.model';
import { Trip } from '../models/trip.model';

export const resetDatabase = async (): Promise<void> => {
  try {
    console.log('Starting database reset...');
    await connectToDatabase();
    console.log('Clearing all collections...');
    
    // Drop each collection individually
    await Property.collection.drop().catch(() => console.log('Property collection not found'));
    await Truck.collection.drop().catch(() => console.log('Truck collection not found'));
    await Trip.collection.drop().catch(() => console.log('Trip collection not found'));

    console.log('Database reset completed!');
  } catch (error) {
    console.error('Error resetting database:', error);
    throw error;
  }
};

export const resetAndSeed = async (): Promise<void> => {
  try {
    await resetDatabase();
    
    const { seedProperties } = await import('../seeds/property.seed');
    const { seedTrucks } = await import('../seeds/truck.seed');
    const { seedTrips } = await import('../seeds/trip.seed');
    
    await seedProperties();
    await seedTrucks();
    await seedTrips();
    
    console.log('Database reset and seeded successfully!');
  } catch (error) {
    console.error('Error during reset and seed:', error);
    throw error;
  }
};

const runReset = async (): Promise<void> => {
  try {
    const resetType = process.argv[2] || 'reset';
    
    if (resetType === 'seed') {
      await resetAndSeed();
    } else {
      await resetDatabase();
    }
  } catch (error) {
    console.error('Reset failed:', error);
    process.exit(1);
  } finally {
    await disconnectFromDatabase();
    console.log('Database connection closed');
    process.exit(0);
  }
};

if (require.main === module) {
  runReset();
}