const http = require('http');

const API_BASE = 'localhost:4000';
const API_KEY = 'arambo-admin-2024';

console.log('🔐 Testing API Authentication...\n');

// Test 1: Public endpoint (should work without API key)
function testPublicEndpoint() {
  return new Promise((resolve) => {
    console.log('1️⃣ Testing public endpoint (GET /properties)');
    
    const req = http.request({
      hostname: API_BASE.split(':')[0],
      port: API_BASE.split(':')[1],
      path: '/properties',
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    }, (res) => {
      console.log(`   Status: ${res.statusCode}`);
      if (res.statusCode === 200) {
        console.log('   ✅ Public endpoint accessible without API key\n');
      } else {
        console.log('   ❌ Public endpoint failed\n');
      }
      resolve();
    });

    req.on('error', (e) => {
      console.log(`   ❌ Error: ${e.message}\n`);
      resolve();
    });
    
    req.end();
  });
}

// Test 2: Private endpoint without API key (should fail)
function testPrivateEndpointNoAuth() {
  return new Promise((resolve) => {
    console.log('2️⃣ Testing private endpoint without API key (POST /properties)');
    
    const testData = JSON.stringify({
      name: "Test User",
      email: "test@example.com",
      phone: "1234567890"
    });

    const req = http.request({
      hostname: API_BASE.split(':')[0],
      port: API_BASE.split(':')[1],
      path: '/properties',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(testData)
      }
    }, (res) => {
      console.log(`   Status: ${res.statusCode}`);
      if (res.statusCode === 401) {
        console.log('   ✅ Private endpoint correctly rejected without API key\n');
      } else {
        console.log('   ❌ Private endpoint should have returned 401\n');
      }
      resolve();
    });

    req.on('error', (e) => {
      console.log(`   ❌ Error: ${e.message}\n`);
      resolve();
    });
    
    req.write(testData);
    req.end();
  });
}

// Test 3: Private endpoint with valid API key (should work)
function testPrivateEndpointWithAuth() {
  return new Promise((resolve) => {
    console.log('3️⃣ Testing private endpoint with API key (POST /properties)');
    
    const testData = JSON.stringify({
      name: "Test User",
      email: "test@example.com",
      phone: "1234567890",
      propertyName: "Test Property",
      propertyAddress: "123 Test St",
      apartmentSize: "2 Bedroom",
      listingId: "TEST-001",
      inventoryStatus: "Looking for Rent",
      tenantType: "Family",
      propertyCategory: "Residential",
      furnishingStatus: "Non-Furnished",
      availableFrom: "2024-01-01",
      floor: 1,
      totalFloor: 5,
      yearOfConstruction: 2020,
      rent: 25000,
      serviceCharge: 3000,
      advanceMonths: 2
    });

    const req = http.request({
      hostname: API_BASE.split(':')[0],
      port: API_BASE.split(':')[1],
      path: '/properties',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(testData),
        'X-API-Key': API_KEY
      }
    }, (res) => {
      console.log(`   Status: ${res.statusCode}`);
      if (res.statusCode === 201 || res.statusCode === 200) {
        console.log('   ✅ Private endpoint accessible with valid API key\n');
      } else {
        console.log('   ⚠️  Private endpoint response (check if validation failed)\n');
      }
      resolve();
    });

    req.on('error', (e) => {
      console.log(`   ❌ Error: ${e.message}\n`);
      resolve();
    });
    
    req.write(testData);
    req.end();
  });
}

// Run all tests
async function runTests() {
  await testPublicEndpoint();
  await testPrivateEndpointNoAuth();
  await testPrivateEndpointWithAuth();
  
  console.log('🏁 Authentication test completed!');
  console.log('\n📋 Summary:');
  console.log('   • Public endpoints: No API key required');
  console.log('   • Private endpoints: Require API key in X-API-Key header');
  console.log(`   • Development API key: ${API_KEY}`);
}

runTests();