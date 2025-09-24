import { connectToDatabase, disconnectFromDatabase } from './src/database/index';
import { Property } from './src/database/models/property.model';

const checkImageData = async () => {
  try {
    console.log('Connecting to database...');
    await connectToDatabase();
    
    // Find the first property with image data
    const propertyWithImages = await Property.findOne({
      coverImage: { $ne: '' }
    });
    
    if (propertyWithImages) {
      console.log('\n✅ Found property with image data:');
      console.log('Property Name:', propertyWithImages.propertyName);
      console.log('Cover Image:', propertyWithImages.coverImage);
      console.log('Other Images Count:', propertyWithImages.otherImages?.length || 0);
      console.log('Other Images:', propertyWithImages.otherImages);
      
      if (propertyWithImages.otherImages && propertyWithImages.otherImages.length > 0) {
        console.log('\n📸 Individual Other Images:');
        propertyWithImages.otherImages.forEach((img, index) => {
          console.log(`  Image ${index + 1}: ${img}`);
        });
      }
    } else {
      console.log('❌ No property found with image data');
    }
    
  } catch (error) {
    console.error('Error checking image data:', error);
  } finally {
    await disconnectFromDatabase();
    console.log('\nDatabase connection closed');
  }
};

if (require.main === module) {
  checkImageData();
}