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

export const resetPropertiesDatabase = async (): Promise<void> => {
  try {
    console.log('Starting properties database reset...');
    await connectToDatabase();
    console.log('Clearing properties collection...');
    
    await Property.collection.drop().catch(() => console.log('Property collection not found'));

    console.log('Properties database reset completed!');
  } catch (error) {
    console.error('Error resetting properties database:', error);
    throw error;
  }
};

export const resetTrucksDatabase = async (): Promise<void> => {
  try {
    console.log('Starting trucks database reset...');
    await connectToDatabase();
    console.log('Clearing trucks collection...');
    
    await Truck.collection.drop().catch(() => console.log('Truck collection not found'));

    console.log('Trucks database reset completed!');
  } catch (error) {
    console.error('Error resetting trucks database:', error);
    throw error;
  }
};

export const resetTripsDatabase = async (): Promise<void> => {
  try {
    console.log('Starting trips database reset...');
    await connectToDatabase();
    console.log('Clearing trips collection...');
    
    await Trip.collection.drop().catch(() => console.log('Trip collection not found'));

    console.log('Trips database reset completed!');
  } catch (error) {
    console.error('Error resetting trips database:', error);
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
    } else if (resetType === 'properties') {
      await resetPropertiesDatabase();
    } else if (resetType === 'trucks') {
      await resetTrucksDatabase();
    } else if (resetType === 'trips') {
      await resetTripsDatabase();
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