import { Property } from '../models/property.model';
import { connectToDatabase, disconnectFromDatabase } from '../config/connection';

/**
 * Sample property data for seeding the database
 */
const sampleProperties = [
  {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '1234567890',
    propertyName: 'Luxury Apartment in Downtown',
    propertyType: 'apartment',
    size: 1200,
    location: 'Downtown, City Center',
    bedrooms: 2,
    bathroom: 2,
    baranda: true,
    category: 'sale',
    notes: 'Modern apartment with city view, fully furnished',
    firstOwner: true,
    paperworkUpdated: true,
    onLoan: false,
  },
  {
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    phone: '0987654321',
    propertyName: 'Cozy Family House',
    propertyType: 'house',
    size: 2500,
    location: 'Suburbs, Green Valley',
    bedrooms: 4,
    bathroom: 3,
    baranda: false,
    category: 'rent',
    notes: 'Perfect for families, large garden, quiet neighborhood',
    firstOwner: false,
    paperworkUpdated: true,
    onLoan: false,
  },
  {
    name: 'Mike Johnson',
    email: 'mike.johnson@example.com',
    phone: '5555555555',
    propertyName: 'Luxury Villa with Pool',
    propertyType: 'villa',
    size: 5000,
    location: 'Hillside, Premium District',
    bedrooms: 6,
    bathroom: 4,
    baranda: true,
    category: 'sale',
    notes: 'Luxury villa with swimming pool, home theater, and premium finishings',
    firstOwner: true,
    paperworkUpdated: true,
    onLoan: false,
  },
  {
    name: 'Sarah Wilson',
    email: 'sarah.wilson@example.com',
    phone: '7777777777',
    propertyName: 'Modern Studio Apartment',
    propertyType: 'studio',
    size: 600,
    location: 'Business District',
    bedrooms: 0,
    bathroom: 1,
    baranda: false,
    category: 'rent',
    notes: 'Compact and modern, perfect for young professionals',
    firstOwner: false,
    paperworkUpdated: false,
    onLoan: true,
  },
  {
    name: 'David Brown',
    email: 'david.brown@example.com',
    phone: '9999999999',
    propertyName: 'Commercial Office Space',
    propertyType: 'commercial',
    size: 3000,
    location: 'Business Park, Zone A',
    bedrooms: 0,
    bathroom: 2,
    baranda: false,
    category: 'lease',
    notes: 'Modern office space with parking, ideal for tech companies',
    firstOwner: true,
    paperworkUpdated: true,
    onLoan: false,
  },
];

/**
 * Seed the database with sample property data
 */
export const seedProperties = async (): Promise<void> => {
  try {
    console.log('🌱 Starting database seeding...');

    // Connect to database
    await connectToDatabase();

    // Clear existing data
    const existingCount = await Property.countDocuments();
    if (existingCount > 0) {
      console.log(`🗑️  Clearing ${existingCount} existing properties...`);
      await Property.deleteMany({});
    }

    // Insert sample data
    console.log('📝 Inserting sample properties...');
    const insertedProperties = await Property.insertMany(sampleProperties);

    console.log(`✅ Successfully seeded ${insertedProperties.length} properties!`);
    
    // Log inserted properties
    insertedProperties.forEach((property, index) => {
      console.log(`   ${index + 1}. ${property.propertyName} (${property.propertyType}) - ${property.category}`);
    });

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
};

/**
 * Clear all properties from the database
 */
export const clearProperties = async (): Promise<void> => {
  try {
    console.log('🗑️  Clearing all properties...');
    
    await connectToDatabase();
    const deleteResult = await Property.deleteMany({});
    
    console.log(`✅ Successfully cleared ${deleteResult.deletedCount} properties`);
  } catch (error) {
    console.error('❌ Error clearing database:', error);
    throw error;
  }
};

/**
 * Main function to run seeding
 * Can be called directly: npm run seed
 */
const runSeeding = async (): Promise<void> => {
  try {
    await seedProperties();
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  } finally {
    await disconnectFromDatabase();
    console.log('👋 Database connection closed');
    process.exit(0);
  }
};

// Run seeding if this file is executed directly
if (require.main === module) {
  runSeeding();
}