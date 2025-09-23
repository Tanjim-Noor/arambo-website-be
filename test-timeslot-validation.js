// Test validation with invalid and valid time slots
const http = require('http');

// Test 1: Invalid time slot
const invalidData = JSON.stringify({
  name: "Test Invalid Time",
  phone: "01712345682",
  email: "testinvalid@example.com",
  productType: "Fragile",
  pickupLocation: "Test Pickup Address",
  dropOffLocation: "Test Drop-off Address",
  preferredDate: "2024-01-15",
  preferredTimeSlot: "night",
  truckId: "68d26e129f10e9b5c0031915"
});

console.log("🧪 Testing invalid time slot...");
const invalidReq = http.request({
  hostname: 'localhost',
  port: 4000,
  path: '/api/trips',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(invalidData)
  }
}, (res) => {
  console.log(`Invalid test status: ${res.statusCode}`);
  res.on('data', (chunk) => {
    const response = JSON.parse(chunk.toString());
    if (res.statusCode === 400) {
      console.log('✅ Invalid time slot rejected!');
      console.log(`Error: ${response.error}`);
    } else {
      console.log('❌ Invalid time slot accepted (should be rejected)');
    }
    
    // Test 2: Valid time slot
    setTimeout(() => {
      const validData = JSON.stringify({
        name: "Test Valid Time",
        phone: "01712345683",
        email: "testvalid@example.com",
        productType: "Fragile",
        pickupLocation: "Test Pickup Address",
        dropOffLocation: "Test Drop-off Address",
        preferredDate: "2024-01-15",
        preferredTimeSlot: "Morning (8AM - 12PM)",
        truckId: "68d26e129f10e9b5c0031915"
      });
      
      console.log("\n🧪 Testing valid time slot...");
      const validReq = http.request({
        hostname: 'localhost',
        port: 4000,
        path: '/api/trips',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(validData)
        }
      }, (res) => {
        console.log(`Valid test status: ${res.statusCode}`);
        res.on('data', (chunk) => {
          const response = JSON.parse(chunk.toString());
          if (res.statusCode === 201) {
            console.log(`✅ Valid time slot accepted: "${response.preferredTimeSlot}"`);
          } else {
            console.log('❌ Valid time slot rejected');
            console.log(JSON.stringify(response, null, 2));
          }
        });
      });
      
      validReq.write(validData);
      validReq.end();
    }, 1000);
  });
});

invalidReq.on('error', (e) => {
  console.log(`❌ Error: ${e.message}`);
});

invalidReq.write(invalidData);
invalidReq.end();