/**
 * Script to seed the truck database with sample data
 */
import { connectToDatabase } from '../';
import { seedTrucks } from '../seeds/truck.seed';

const runTruckSeed = async (): Promise<void> => {
  try {
    console.log('🔗 Connecting to database...');
    await connectToDatabase();
    
    console.log('🚛 Seeding trucks database...');
    await seedTrucks();
    
    console.log('✅ Truck seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding trucks database:', error);
    process.exit(1);
  }
};

// Run the seeding if this file is executed directly
if (require.main === module) {
  runTruckSeed();
}

export { runTruckSeed };