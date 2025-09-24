const mongoose = require('mongoose');
require('dotenv').config();

// Define Property schema
const propertySchema = new mongoose.Schema({
  name: String,
  propertyName: String,
  coverImage: String,
  otherImages: [String]
}, { collection: 'properties' });

const Property = mongoose.model('Property', propertySchema);

async function checkFirstProperty() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect('mongodb://admin:password@localhost:27017/arambo_properties?authSource=admin');
    console.log('✅ Connected to MongoDB\n');

    // Get the very first property by creation order
    const firstProperty = await Property.findOne().sort({ _id: 1 });
    
    console.log('🥇 FIRST property in database:');
    console.log(`   🏠 Name: ${firstProperty.propertyName}`);
    console.log(`   📸 Cover: "${firstProperty.coverImage || 'EMPTY'}"`);
    console.log(`   📷 Other Images (${firstProperty.otherImages?.length || 0}):`, firstProperty.otherImages || []);
    console.log(`   🆔 ID: ${firstProperty._id}`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

checkFirstProperty();