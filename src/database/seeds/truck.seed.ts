/**
 * Sample truck data for seeding the database
 */
import { Truck } from '../models/truck.model';

const sampleTrucks = [
  {
    modelNumber: 'T-100',
    height: 3.5,
    isOpen: true
  },
  {
    modelNumber: 'C-200',
    height: 4.0,
    isOpen: false
  },
  {
    modelNumber: 'X-300',
    height: 3.8,
    isOpen: true
  },
  {
    modelNumber: 'Heavy-400',
    height: 4.5,
    isOpen: false
  },
  {
    modelNumber: 'Compact-150',
    height: 2.8,
    isOpen: true
  },
  {
    modelNumber: 'Cargo-250',
    height: 3.2,
    isOpen: false
  },
  {
    modelNumber: 'Mini-50',
    height: 2.5,
    isOpen: true
  },
  {
    modelNumber: 'Super-500',
    height: 5.0,
    isOpen: false
  }
];

export const seedTrucks = async (): Promise<void> => {
  try {
    await Truck.deleteMany({});
    await Truck.insertMany(sampleTrucks);
    console.log('Truck database seeded successfully!');
  } catch (error) {
    console.error('Error seeding truck database:', error);
  }
};

export const clearTrucks = async (): Promise<void> => {
  try {
    await Truck.deleteMany({});
    console.log('Truck database cleared successfully!');
  } catch (error) {
    console.error('Error clearing truck database:', error);
  }
};
