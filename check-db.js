const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');
const dotenvExpand = require('dotenv-expand');

// Load and expand environment variables
const myEnv = dotenv.config();
dotenvExpand.expand(myEnv);

async function checkDatabase() {
  const uri = process.env.MONGODB_URI || process.env.MONGODB_LOCAL_URI;
  console.log('Connecting to:', uri);
  
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    // Get database name from URI
    const dbName = uri.split('/')[3].split('?')[0];
    console.log('📊 Database name:', dbName);
    
    const db = client.db(dbName);
    
    // List all collections
    const collections = await db.listCollections().toArray();
    console.log('📁 Collections:', collections.map(c => c.name));
    
    // Check properties collection
    const propertiesCount = await db.collection('properties').countDocuments();
    console.log('🏠 Properties count:', propertiesCount);
    
    if (propertiesCount > 0) {
      const sampleProperty = await db.collection('properties').findOne();
      console.log('📋 Sample property:');
      console.log(JSON.stringify(sampleProperty, null, 2));
    }
    
  } catch (error) {
    console.error('❌ Database error:', error);
  } finally {
    await client.close();
    console.log('🔌 Connection closed');
  }
}

checkDatabase().catch(console.error);