import { Furniture } from '../models/furniture.model';
import { connectToDatabase, disconnectFromDatabase } from '../config/connection';

const furnitureItems = [
  {
    name: "Ahmed Hassan",
    email: "ahmed.hassan@example.com",
    phone: "01712345678",
    furnitureType: "Commercial Furniture",
    paymentType: "EMI Plan",
    furnitureCondition: "New Furniture"
  },
  {
    name: "Fatima Rahman",
    email: "fatima.rahman@example.com",
    phone: "01798765432",
    furnitureType: "Residential Furniture",
    paymentType: "Instant Pay",
    furnitureCondition: "Used Furniture"
  },
  {
    name: "Mohammad Ali",
    email: "mohammad.ali@example.com",
    phone: "01887654321",
    furnitureType: "Commercial Furniture",
    paymentType: "Lease",
    furnitureCondition: "New Furniture"
  },
  {
    name: "Rashida Begum",
    email: "rashida.begum@example.com",
    phone: "01612345987",
    furnitureType: "Residential Furniture",
    paymentType: "EMI Plan",
    furnitureCondition: "New Furniture"
  },
  {
    name: "Karim Sheikh",
    email: "karim.sheikh@example.com",
    phone: "01576543210",
    furnitureType: "Commercial Furniture",
    paymentType: "Instant Pay",
    furnitureCondition: "Used Furniture"
  },
  {
    name: "Nasreen Akhter",
    email: "nasreen.akhter@example.com",
    phone: "01934567890",
    furnitureType: "Residential Furniture",
    paymentType: "Lease",
    furnitureCondition: "New Furniture"
  },
  {
    name: "Habibur Rahman",
    email: "habibur.rahman@example.com",
    phone: "01823456789",
    furnitureType: "Commercial Furniture",
    furnitureCondition: "New Furniture"
  },
  {
    name: "Salma Khatun",
    email: "salma.khatun@example.com",
    phone: "01745678901",
    furnitureType: "Residential Furniture",
    paymentType: "Instant Pay",
    furnitureCondition: "Used Furniture"
  },
  {
    name: "Ibrahim Hossain",
    email: "ibrahim.hossain@example.com",
    phone: "01656789012",
    furnitureType: "Commercial Furniture",
    paymentType: "Lease"
  },
  {
    name: "Rubina Islam",
    email: "rubina.islam@example.com",
    phone: "01567890123",
    furnitureType: "Residential Furniture",
    paymentType: "EMI Plan",
    furnitureCondition: "New Furniture"
  }
];

export async function seedFurniture() {
  try {
    // Connect to database
    await connectToDatabase();
    
    console.log('Connected to database. Starting furniture seeding...');
    
    // Clear existing furniture data
    await Furniture.deleteMany({});
    console.log('Cleared existing furniture data.');
    
    // Insert furniture data
    const insertedFurniture = await Furniture.insertMany(furnitureItems);
    console.log(`Successfully inserted ${insertedFurniture.length} furniture items.`);
    
    // Log statistics
    const stats = await Furniture.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          commercial: { 
            $sum: { $cond: [{ $eq: ['$furnitureType', 'Commercial Furniture'] }, 1, 0] }
          },
          residential: { 
            $sum: { $cond: [{ $eq: ['$furnitureType', 'Residential Furniture'] }, 1, 0] }
          }
        }
      }
    ]);
    
    if (stats.length > 0) {
      const stat = stats[0];
      console.log('Furniture seeding statistics:');
      console.log(`- Total items: ${stat.total}`);
      console.log(`- Commercial furniture: ${stat.commercial}`);
      console.log(`- Residential furniture: ${stat.residential}`);
    }
    
  } catch (error) {
    console.error('Error seeding furniture data:', error);
    throw error;
  }
}

// Run seeding if this file is executed directly
if (require.main === module) {
  seedFurniture()
    .then(() => {
      console.log('Furniture seeding completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Furniture seeding failed:', error);
      process.exit(1);
    })
    .finally(async () => {
      await disconnectFromDatabase();
    });
}