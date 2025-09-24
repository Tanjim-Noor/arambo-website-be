// Test script to check image data in the database
const dotenv = require('dotenv');
const mongoose = require('mongoose');

// Load environment variables
dotenv.config();

// Simple connection function
const connectMongo = async () => {
  try {
    await mongoose.connect('mongodb://admin:password@localhost:27017/arambo_properties?authSource=admin');
    console.log('✅ Connected to MongoDB');
    return true;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    return false;
  }
};

// Simple Property schema for testing
const propertySchema = new mongoose.Schema({
  propertyName: String,
  coverImage: String,
  otherImages: [String],
}, { collection: 'properties' });

const Property = mongoose.model('Property', propertySchema);

const checkImages = async () => {
  const connected = await connectMongo();
  if (!connected) return;

  try {
    // Find property with images
    const property = await Property.findOne({ 
      coverImage: { $exists: true, $ne: '' } 
    }).select('propertyName coverImage otherImages');

    if (property) {
      console.log('\n🏠 Property Found:', property.propertyName);
      console.log('📸 Cover Image:', property.coverImage);
      console.log('📷 Other Images Count:', property.otherImages ? property.otherImages.length : 0);
      
      if (property.otherImages && property.otherImages.length > 0) {
        console.log('📷 Other Images:');
        property.otherImages.forEach((img, i) => {
          console.log(`  ${i + 1}. ${img}`);
        });
      }
    } else {
      console.log('❌ No property found with image data');
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
};

checkImages();