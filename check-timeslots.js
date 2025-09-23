// Test script to check time slots
const http = require('http');

console.log("🧪 Checking time slot options...");
const req = http.request({
  hostname: 'localhost',
  port: 4000,
  path: '/api/trips',
  method: 'GET',
  headers: { 'Content-Type': 'application/json' }
}, (res) => {
  console.log(`Status: ${res.statusCode}`);
  res.on('data', (chunk) => {
    const trips = JSON.parse(chunk.toString());
    console.log('\n✅ Time Slots Found:');
    trips.forEach((trip, index) => {
      console.log(`${index + 1}. ${trip.name}: "${trip.preferredTimeSlot}"`);
    });
    
    const uniqueTimeSlots = [...new Set(trips.map(trip => trip.preferredTimeSlot))];
    console.log('\n🎯 Unique Time Slots:');
    uniqueTimeSlots.forEach(slot => console.log(`   - ${slot}`));
    
    console.log('\n🔍 Validation:');
    const expectedSlots = ['Morning (8AM - 12PM)', 'Afternoon (12PM - 4PM)', 'Evening (4PM - 8PM)'];
    const allValid = uniqueTimeSlots.every(slot => expectedSlots.includes(slot));
    console.log(`All time slots valid: ${allValid ? '✅ Yes' : '❌ No'}`);
  });
});

req.on('error', (e) => {
  console.log(`❌ Error: ${e.message}`);
});

req.end();