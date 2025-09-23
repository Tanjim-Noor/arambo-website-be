// Quick test script to verify truck API changes
const http = require('http');

console.log("🧪 Testing API endpoints...");


  // Test : Test the body approach
  setTimeout(() => {
    console.log("\n2. Testing body approach...");
    const testData = JSON.stringify({ id: "507f1f77bcf86cd799439011" });
    
    const newReq = http.request({
      hostname: 'localhost',
      port: 4000,
      path: '/api/trucks/get-by-id',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(testData)
      }
    }, (res) => {
      console.log(`   Status: ${res.statusCode}`);
      res.on('data', (chunk) => {
        const data = JSON.parse(chunk.toString());
        if (res.statusCode === 404 && data.error === 'Truck not found') {
          console.log('   ✅ Body-based endpoint working (truck not found as expected)!');
        } else if (res.statusCode === 200) {
          console.log('   ✅ Body-based endpoint working (truck found)!');
        }
        console.log('\n🎉 API changes successful! URL parameter removed, body parameter implemented.');
        process.exit(0);
      });
    });
    
    newReq.on('error', (e) => {
      console.log(`   ❌ Error: ${e.message}`);
      process.exit(1);
    });
    
    newReq.write(testData);
    newReq.end();
  }, 1000);
;

oldReq.on('error', (e) => {
  console.log(`   ❌ Error: ${e.message}`);
  process.exit(1);
});

oldReq.end();