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
    lift: true,
    // New fields
    houseId: 'A-01',
    streetAddress: 'Downtown, City Center, Metropolitan Area',
    landmark: 'Near Central Mall',
    area: 'Downtown & City Center',
    listingId: 'RE-SALE-1',
    inventoryStatus: 'Looking for Sale',
    tenantType: 'Family',
    propertyCategory: 'Residential',
    furnishingStatus: 'Furnished',
    availableFrom: new Date('2025-01-01'),
    floor: 5,
    totalFloor: 10,
    yearOfConstruction: 2020,
    rent: 0, // Not applicable for sale
    serviceCharge: 0,
    advanceMonths: 0,
    cleanHygieneScore: 9,
    sunlightScore: 8,
    bathroomConditionsScore: 9,
    coverImage: 'https://example.com/images/luxury-apartment-cover.jpg',
    otherImages: [
      'https://example.com/images/luxury-apartment-1.jpg',
      'https://example.com/images/luxury-apartment-2.jpg'
    ]
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
    lift: false,
    // New fields
    houseId: 'H-05',
    streetAddress: 'Green Valley, Suburban District',
    landmark: 'Opposite Green Park',
    area: 'Green Valley & Suburbs',
    listingId: 'RE-RENT-2',
    inventoryStatus: 'Looking for Rent',
    tenantType: 'Family',
    propertyCategory: 'Residential',
    furnishingStatus: 'Semi-Furnished',
    availableFrom: new Date('2025-02-01'),
    floor: 0, // Ground floor
    totalFloor: 2,
    yearOfConstruction: 2018,
    rent: 25000,
    serviceCharge: 3000,
    advanceMonths: 2,
    cleanHygieneScore: 8,
    sunlightScore: 9,
    bathroomConditionsScore: 8,
    coverImage: 'https://example.com/images/family-house-cover.jpg',
    otherImages: [
      'https://example.com/images/family-house-1.jpg',
      'https://example.com/images/family-house-2.jpg',
      'https://example.com/images/family-house-garden.jpg'
    ]
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
    lift: true,
    // New fields
    houseId: 'V-12',
    streetAddress: 'Hillside Premium District, Elite Avenue',
    landmark: 'Near Premium Club',
    area: 'Hillside & Premium District',
    listingId: 'RE-SALE-3',
    inventoryStatus: 'Looking for Sale',
    tenantType: 'Family',
    propertyCategory: 'Residential',
    furnishingStatus: 'Furnished',
    availableFrom: new Date('2025-03-01'),
    floor: 0, // Ground floor villa
    totalFloor: 3,
    yearOfConstruction: 2022,
    rent: 0,
    serviceCharge: 0,
    advanceMonths: 0,
    cleanHygieneScore: 10,
    sunlightScore: 10,
    bathroomConditionsScore: 10,
    coverImage: 'https://example.com/images/luxury-villa-cover.jpg',
    otherImages: [
      'https://example.com/images/luxury-villa-pool.jpg',
      'https://example.com/images/luxury-villa-interior.jpg',
      'https://example.com/images/luxury-villa-garden.jpg'
    ]
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
    lift: true,
    // New fields
    houseId: 'S-08',
    streetAddress: 'Business District, Corporate Avenue',
    landmark: 'Next to Metro Station',
    area: 'Business District',
    listingId: 'RE-RENT-4',
    inventoryStatus: 'Looking for Rent',
    tenantType: 'Bachelor',
    propertyCategory: 'Residential',
    furnishingStatus: 'Furnished',
    availableFrom: new Date('2025-01-15'),
    floor: 8,
    totalFloor: 15,
    yearOfConstruction: 2021,
    rent: 18000,
    serviceCharge: 2500,
    advanceMonths: 3,
    cleanHygieneScore: 7,
    sunlightScore: 6,
    bathroomConditionsScore: 8,
    coverImage: 'https://example.com/images/studio-apartment-cover.jpg',
    otherImages: [
      'https://example.com/images/studio-apartment-interior.jpg'
    ]
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
    lift: true,
    // New fields
    houseId: 'C-15',
    streetAddress: 'Business Park Zone A, Tech Boulevard',
    landmark: 'Opposite IT Tower',
    area: 'Business Park Zone A',
    listingId: 'RE-LEASE-5',
    inventoryStatus: 'Looking for Lease',
    tenantType: 'Office',
    propertyCategory: 'Commercial',
    furnishingStatus: 'Non-Furnished',
    availableFrom: new Date('2025-04-01'),
    floor: 3,
    totalFloor: 8,
    yearOfConstruction: 2019,
    rent: 80000,
    serviceCharge: 15000,
    advanceMonths: 6,
    cleanHygieneScore: 9,
    sunlightScore: 8,
    bathroomConditionsScore: 9,
    coverImage: 'https://example.com/images/office-space-cover.jpg',
    otherImages: [
      'https://example.com/images/office-space-interior.jpg',
      'https://example.com/images/office-space-parking.jpg'
    ]
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