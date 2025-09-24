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

async function fixImageArray() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect('mongodb://admin:password@localhost:27017/arambo_properties?authSource=admin');
    console.log('✅ Connected to MongoDB\n');

    // Find the property with cover image
    const property = await Property.findOne({ coverImage: { $ne: '' } });
    
    console.log('🔧 BEFORE UPDATE:');
    console.log(`   📷 Other Images:`, property.otherImages);
    console.log(`   📏 Length: ${property.otherImages?.length || 0}`);
    
    // Update with explicitly separated array
    const result = await Property.updateOne(
      { _id: property._id },
      { 
        $set: {
          otherImages: [
            "https://i.ibb.co/fYByWSps/2.webp",
            "https://i.ibb.co/dJKtnxrc/3.webp"
          ]
        }
      }
    );
    
    console.log('✅ Update result:', result);
    
    // Verify the update
    const updatedProperty = await Property.findById(property._id);
    console.log('\n🔍 AFTER UPDATE:');
    console.log(`   📷 Other Images:`, updatedProperty.otherImages);
    console.log(`   📏 Length: ${updatedProperty.otherImages?.length || 0}`);
    console.log(`   🔢 Individual items:`);
    updatedProperty.otherImages.forEach((img, index) => {
      console.log(`      ${index + 1}. "${img}"`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

fixImageArray();