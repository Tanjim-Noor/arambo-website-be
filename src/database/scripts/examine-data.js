/**
 * Script to examine existing property data structure
 */

const { MongoClient } = require('mongodb');
require('dotenv').config();

async function examineExistingData() {
  const client = new MongoClient('mongodb://admin:password@localhost:27017/arambo_properties?authSource=admin');
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db('arambo_properties');
    const collection = db.collection('properties');
    
    // Check total document count
    const totalDocs = await collection.countDocuments({});
    console.log(`\nTotal documents: ${totalDocs}`);
    
    if (totalDocs > 0) {
      // Get sample documents
      const sampleDocs = await collection.find({}).limit(3).toArray();
      console.log('\nSample documents:');
      sampleDocs.forEach((doc, index) => {
        console.log(`\nDocument ${index + 1}:`);
        console.log(`  propertyType: "${doc.propertyType}"`);
        console.log(`  listingType: "${doc.listingType}"`);
        console.log(`  propertyName: "${doc.propertyName}"`);
        console.log(`  category: "${doc.category}"`);
      });
      
      // Check distinct values
      const propertyTypes = await collection.distinct('propertyType');
      const listingTypes = await collection.distinct('listingType');
      
      console.log(`\nDistinct propertyType values: ${JSON.stringify(propertyTypes)}`);
      console.log(`Distinct listingType values: ${JSON.stringify(listingTypes)}`);
      
      // Check for documents that have propertyType but no listingType
      const needsMigration = await collection.countDocuments({ 
        propertyType: { $exists: true }, 
        listingType: { $exists: false } 
      });
      console.log(`\nDocuments that need migration: ${needsMigration}`);
    } else {
      console.log('\nNo existing documents found. This is a clean database.');
    }
    
  } catch (error) {
    console.error('Error examining data:', error);
  } finally {
    await client.close();
    console.log('\nDisconnected from MongoDB');
  }
}

// Run if called directly
if (require.main === module) {
  examineExistingData().catch(console.error);
}

module.exports = { examineExistingData };