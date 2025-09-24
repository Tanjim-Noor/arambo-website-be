require('dotenv').config();
const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_LOCAL_URI || 'mongodb://localhost:27017/arambo_properties_dev';

async function checkTruckDatabase() {
  console.log('Checking truck database structure...');
  
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db();
    const collection = db.collection('trucks');
    
    // Get a sample document to see the structure
    const sampleDoc = await collection.findOne({});
    console.log('\n📄 SAMPLE TRUCK DOCUMENT:');
    console.log(JSON.stringify(sampleDoc, null, 2));
    
    // Check all field names
    if (sampleDoc) {
      console.log('\n📋 ALL FIELD NAMES:');
      Object.keys(sampleDoc).forEach((key, index) => {
        console.log(`   ${index + 1}. "${key}" (${typeof sampleDoc[key]})`);
      });
    }
    
    // Count total documents
    const count = await collection.countDocuments();
    console.log(`\n📊 Total trucks: ${count}`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
    console.log('🔌 Disconnected from MongoDB');
  }
}

checkTruckDatabase();