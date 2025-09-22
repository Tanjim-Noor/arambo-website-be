/**
 * Sample trip data for seeding the database
 */
import { Trip } from '../models/trip.model';
import { Truck } from '../models/truck.model';

const getSampleTrips = async () => {
  // Get some truck IDs to reference
  const trucks = await Truck.find().limit(8);
  if (trucks.length < 6) {
    throw new Error('Not enough trucks found. Please seed trucks first with: npm run db:seed:trucks');
  }

  return [
    {
      name: 'John Smith',
      phone: '01712345678',
      email: 'john.smith@email.com',
      productType: 'Furniture',
      tripDetails: 'Moving household furniture from apartment to new house',
      dropOffLocation: 'Gulshan 2, Dhaka',
      preferredDate: new Date('2024-01-15'),
      preferredTimeSlot: 'morning',
      additionalNotes: 'Please call before arriving',
      truckId: trucks[0]!._id
    },
    {
      name: 'Sarah Ahmed',
      phone: '01798765432',
      email: 'sarah.ahmed@gmail.com',
      productType: 'Electronics',
      tripDetails: 'Delivery of office equipment and computers',
      dropOffLocation: 'Banani Commercial Area, Dhaka',
      preferredDate: new Date('2024-01-16'),
      preferredTimeSlot: 'afternoon',
      additionalNotes: 'Handle with care - fragile items',
      truckId: trucks[1]!._id
    },
    {
      name: 'Michael Rahman',
      phone: '01611223344',
      email: 'michael.rahman@company.com',
      productType: 'Construction Materials',
      tripDetails: 'Transport cement and steel rods to construction site',
      dropOffLocation: 'Uttara Sector 10, Dhaka',
      preferredDate: new Date('2024-01-17'),
      preferredTimeSlot: 'morning',
      additionalNotes: 'Heavy load - ensure truck capacity',
      truckId: trucks[2]!._id
    },
    {
      name: 'Fatima Khan',
      phone: '01555666777',
      email: 'fatima.khan@email.com',
      productType: 'Personal Items',
      tripDetails: 'Student moving from dorm to family home',
      dropOffLocation: 'Dhanmondi 27, Dhaka',
      preferredDate: new Date('2024-01-18'),
      preferredTimeSlot: 'evening',
      additionalNotes: 'Small load, books and personal belongings',
      truckId: trucks[3]!._id
    },
    {
      name: 'David Wilson',
      phone: '01777888999',
      email: 'david.wilson@business.com',
      productType: 'Business Goods',
      tripDetails: 'Relocating office supplies and documents',
      dropOffLocation: 'Motijheel Commercial Area, Dhaka',
      preferredDate: new Date('2024-01-19'),
      preferredTimeSlot: 'afternoon',
      additionalNotes: 'Confidential documents - secure transport needed',
      truckId: trucks[4]!._id
    },
    {
      name: 'Aisha Begum',
      phone: '01444555666',
      email: 'aisha.begum@home.com',
      productType: 'Appliances',
      tripDetails: 'Moving refrigerator, washing machine, and AC',
      dropOffLocation: 'Bashundhara Residential Area, Dhaka',
      preferredDate: new Date('2024-01-20'),
      preferredTimeSlot: 'morning',
      additionalNotes: 'Need help with loading/unloading heavy items',
      truckId: trucks[5]!._id
    }
  ];
};

export const seedTrips = async (): Promise<void> => {
  try {
    const sampleTrips = await getSampleTrips();
    await Trip.deleteMany({});
    await Trip.insertMany(sampleTrips);
    console.log('Trip database seeded successfully!');
  } catch (error) {
    console.error('Error seeding trip database:', error);
    throw error;
  }
};

export const clearTrips = async (): Promise<void> => {
  try {
    await Trip.deleteMany({});
    console.log('Trip database cleared successfully!');
  } catch (error) {
    console.error('Error clearing trip database:', error);
    throw error;
  }
};