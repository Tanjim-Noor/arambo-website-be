/**
 * Script to seed the trip database with sample data
 */
import { connectToDatabase } from '../';
import { seedTrips } from '../seeds/trip.seed';

const runTripSeed = async (): Promise<void> => {
  try {
    console.log('Connecting to database...');
    await connectToDatabase();
    
    console.log('Seeding trips database...');
    await seedTrips();
    
    console.log('Trip seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding trips database:', error);
    process.exit(1);
  }
};

// Run the seeding if this file is executed directly
if (require.main === module) {
  runTripSeed();
}

export { runTripSeed };