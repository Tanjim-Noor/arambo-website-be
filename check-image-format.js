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

async function checkImageFormat() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect('mongodb://admin:password@localhost:27017/arambo_properties?authSource=admin');
    console.log('✅ Connected to MongoDB\n');

    // Get the property with images
    const property = await Property.findOne({ coverImage: { $ne: '' } });
    
    console.log('🔍 DETAILED IMAGE ANALYSIS:');
    console.log(`   🏠 Property: ${property.propertyName}`);
    console.log(`   📸 Cover Image: "${property.coverImage}"`);
    console.log(`   📷 Other Images Array:`);
    console.log(`      - Type: ${typeof property.otherImages}`);
    console.log(`      - Is Array: ${Array.isArray(property.otherImages)}`);
    console.log(`      - Length: ${property.otherImages?.length || 0}`);
    console.log(`      - Raw Data:`, JSON.stringify(property.otherImages, null, 2));
    
    if (property.otherImages && property.otherImages.length > 0) {
      property.otherImages.forEach((img, index) => {
        console.log(`      [${index}]: "${img}" (type: ${typeof img}, length: ${img.length})`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

checkImageFormat();