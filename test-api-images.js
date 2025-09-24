const axios = require('axios');

async function testAPI() {
  try {
    console.log('🔍 Testing API response...\n');
    
    const response = await axios.get('http://localhost:4000/properties?limit=1');
    const property = response.data.data[0];
    
    console.log('📊 API Response for first property:');
    console.log(`   🏠 Name: ${property.propertyName}`);
    console.log(`   📸 Cover Image: ${property.coverImage}`);
    console.log(`   📷 Other Images Type: ${typeof property.otherImages}`);
    console.log(`   📷 Is Array: ${Array.isArray(property.otherImages)}`);
    console.log(`   📷 Length: ${property.otherImages?.length || 0}`);
    console.log(`   📷 Raw Other Images:`, JSON.stringify(property.otherImages, null, 2));
    
    if (property.otherImages && property.otherImages.length > 0) {
      console.log('\n🔢 Individual Other Images:');
      property.otherImages.forEach((img, index) => {
        console.log(`   ${index + 1}. "${img}"`);
      });
    }
    
  } catch (error) {
    console.error('❌ API Error:', error.message);
  }
}

testAPI();