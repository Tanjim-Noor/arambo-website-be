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

async function checkAllImages() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect('mongodb://admin:password@localhost:27017/arambo_properties?authSource=admin');
    console.log('✅ Connected to MongoDB\n');

    // Find ALL properties with cover images
    const propertiesWithCoverImages = await Property.find({
      coverImage: { $ne: '' }
    }).select('propertyName coverImage otherImages');

    console.log(`📊 Found ${propertiesWithCoverImages.length} properties with cover images:\n`);

    propertiesWithCoverImages.forEach((property, index) => {
      console.log(`${index + 1}. 🏠 ${property.propertyName}`);
      console.log(`   📸 Cover: ${property.coverImage}`);
      console.log(`   📷 Other Images (${property.otherImages?.length || 0}):`, property.otherImages || []);
      console.log('');
    });

    // Also check properties with other images but no cover image
    const propertiesWithOtherImagesOnly = await Property.find({
      coverImage: { $in: ['', null, undefined] },
      otherImages: { $exists: true, $ne: [] }
    }).select('propertyName coverImage otherImages');

    if (propertiesWithOtherImagesOnly.length > 0) {
      console.log(`🔍 Found ${propertiesWithOtherImagesOnly.length} properties with only other images (no cover):`);
      propertiesWithOtherImagesOnly.forEach((property, index) => {
        console.log(`${index + 1}. 🏠 ${property.propertyName}`);
        console.log(`   📷 Other Images (${property.otherImages?.length || 0}):`, property.otherImages);
        console.log('');
      });
    }

    // Count total properties
    const totalProperties = await Property.countDocuments();
    console.log(`📈 Total properties in database: ${totalProperties}`);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

checkAllImages();