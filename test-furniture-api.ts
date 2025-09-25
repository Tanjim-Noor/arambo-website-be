// Test script for Furniture API
// Run this with: npx ts-node test-furniture-api.ts

import axios from 'axios';

const BASE_URL = 'http://localhost:4000/furniture';

interface FurnitureItem {
  _id?: string;
  name: string;
  email: string;
  phone: string;
  furnitureType: 'Commercial Furniture' | 'Residential Furniture';
  paymentType?: 'EMI Plan' | 'Lease' | 'Instant Pay';
  furnitureCondition?: 'New Furniture' | 'Used Furniture';
  price: number;
  description?: string;
  location: string;
  brand?: string;
  furnitureModel?: string;
  quantity: number;
  isAvailable: boolean;
  images?: string[];
}

async function testFurnitureAPI() {
  try {
    console.log('🧪 Testing Furniture API...\n');

    // 1. Health Check
    console.log('1️⃣ Testing Health Check');
    const healthResponse = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Health Check:', healthResponse.data);
    console.log('');

    // 2. Get Statistics
    console.log('2️⃣ Testing Statistics');
    const statsResponse = await axios.get(`${BASE_URL}/stats`);
    console.log('📊 Statistics:', statsResponse.data);
    console.log('');

    // 3. Get All Furniture
    console.log('3️⃣ Testing Get All Furniture (with pagination)');
    const allFurnitureResponse = await axios.get(`${BASE_URL}?page=1&limit=5`);
    console.log(`📋 Found ${allFurnitureResponse.data.data.length} items (first 5)`);
    console.log('📄 Pagination:', allFurnitureResponse.data.meta);
    console.log('');

    // 4. Create New Furniture
    console.log('4️⃣ Testing Create Furniture');
    const newFurniture: FurnitureItem = {
      name: 'API Test User',
      email: 'apitest@example.com',
      phone: '01999888777',
      furnitureType: 'Commercial Furniture',
      paymentType: 'EMI Plan',
      furnitureCondition: 'New Furniture',
      price: 125000,
      description: 'API Test - Executive Conference Table',
      location: 'API Test Location, Dhaka',
      brand: 'API Test Brand',
      furnitureModel: 'API-TEST-001',
      quantity: 3,
      isAvailable: true,
      images: []
    };

    const createResponse = await axios.post(BASE_URL, newFurniture);
    const createdFurniture = createResponse.data;
    console.log('✅ Created Furniture ID:', createdFurniture._id);
    console.log('');

    // 5. Get Furniture by ID
    console.log('5️⃣ Testing Get Furniture by ID');
    const getFurnitureResponse = await axios.get(`${BASE_URL}/${createdFurniture._id}`);
    console.log('📦 Retrieved Furniture:', getFurnitureResponse.data.name, '-', getFurnitureResponse.data.description);
    console.log('');

    // 6. Update Furniture
    console.log('6️⃣ Testing Update Furniture');
    const updateData = {
      price: 135000,
      description: 'UPDATED: API Test - Executive Conference Table with Premium Features',
      paymentType: 'Instant Pay'
    };
    const updateResponse = await axios.put(`${BASE_URL}/${createdFurniture._id}`, updateData);
    console.log('✅ Updated Furniture Price:', updateResponse.data.price);
    console.log('✅ Updated Description:', updateResponse.data.description);
    console.log('');

    // 7. Test Filtering
    console.log('7️⃣ Testing Filters');
    
    // Filter by Commercial Furniture
    const commercialResponse = await axios.get(`${BASE_URL}?furnitureType=Commercial Furniture`);
    console.log(`🏢 Commercial Furniture: ${commercialResponse.data.data.length} items`);

    // Filter by Payment Type
    const emiResponse = await axios.get(`${BASE_URL}?paymentType=EMI Plan`);
    console.log(`💳 EMI Plan items: ${emiResponse.data.data.length} items`);

    // Filter by Price Range
    const priceRangeResponse = await axios.get(`${BASE_URL}?minPrice=50000&maxPrice=100000`);
    console.log(`💰 Price 50K-100K: ${priceRangeResponse.data.data.length} items`);
    console.log('');

    // 8. Test Search
    console.log('8️⃣ Testing Search');
    const locationSearchResponse = await axios.get(`${BASE_URL}?location=Dhaka`);
    console.log(`🏠 Location 'Dhaka': ${locationSearchResponse.data.data.length} items`);

    const brandSearchResponse = await axios.get(`${BASE_URL}?brand=Hatil`);
    console.log(`🏷️ Brand 'Hatil': ${brandSearchResponse.data.data.length} items`);
    console.log('');

    // 9. Delete Furniture
    console.log('9️⃣ Testing Delete Furniture');
    const deleteResponse = await axios.delete(`${BASE_URL}/${createdFurniture._id}`);
    console.log('🗑️ Delete Result:', deleteResponse.data.message);
    console.log('');

    // 10. Verify Deletion
    console.log('🔟 Verifying Deletion');
    try {
      await axios.get(`${BASE_URL}/${createdFurniture._id}`);
      console.log('❌ Error: Item should have been deleted');
    } catch (error: any) {
      if (error.response?.status === 404) {
        console.log('✅ Confirmed: Item successfully deleted (404 Not Found)');
      } else {
        console.log('⚠️ Unexpected error:', error.message);
      }
    }

    console.log('\n🎉 All tests completed successfully!');

  } catch (error: any) {
    console.error('❌ API Test failed:', error.response?.data || error.message);
  }
}

// Run tests
testFurnitureAPI();