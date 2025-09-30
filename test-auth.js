const axios = require('axios');

const API_BASE = 'http://localhost:4000';

async function testAuth() {
  console.log('🧪 Testing Authentication API...\n');

  try {
    // Test 1: Health check
    console.log('1️⃣ Testing auth health check...');
    const healthResponse = await axios.get(`${API_BASE}/auth/health`);
    console.log('✅ Health check:', healthResponse.data);
    console.log('');

    // Test 2: Login with correct credentials
    console.log('2️⃣ Testing login with correct credentials...');
    const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
      username: 'admin',
      password: 'admin123'
    });
    console.log('✅ Login successful:', loginResponse.data);
    const token = loginResponse.data.data.accessToken;
    console.log('');

    // Test 3: Verify token
    console.log('3️⃣ Testing token verification...');
    const verifyResponse = await axios.get(`${API_BASE}/auth/verify`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log('✅ Token verification:', verifyResponse.data);
    console.log('');

    // Test 4: Get auth status
    console.log('4️⃣ Testing auth status...');
    const statusResponse = await axios.get(`${API_BASE}/auth/status`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log('✅ Auth status:', statusResponse.data);
    console.log('');

    // Test 5: Test protected endpoint (create property)
    // console.log('5️⃣ Testing protected endpoint with valid token...');
    // const protectedResponse = await axios.post(`${API_BASE}/properties`, {
    //   name: 'Test User',
    //   email: 'test@example.com',
    //   phone: '01234567890',
    //   propertyName: 'Test Property for Auth',
    //   listingType: 'For Rent',
    //   propertyType: 'Apartment',
    //   size: 1000,
    //   location: 'Test Location',
    //   bedrooms: 2,
    //   bathroom: 1,
    //   baranda: 1,
    //   propertyCategory: 'Residential'
    // }, {
    //   headers: {
    //     'Authorization': `Bearer ${token}`
    //   }
    // });
    // console.log('✅ Protected endpoint with auth:', protectedResponse.data);
    // console.log('');

    // Test 6: Login with incorrect credentials
    console.log('6️⃣ Testing login with incorrect credentials...');
    try {
      await axios.post(`${API_BASE}/auth/login`, {
        username: 'admin',
        password: 'wrongpassword'
      });
    } catch (error) {
      console.log('✅ Expected error for wrong credentials:', error.response.data);
      console.log('');
    }

    // // Test 7: Test protected endpoint without token
    // console.log('7️⃣ Testing protected endpoint without token...');
    // try {
    //   await axios.post(`${API_BASE}/properties`, {
    //     name: 'Test User',
    //     email: 'test@example.com',
    //     phone: '01234567890',
    //     propertyName: 'Test Property No Auth',
    //     listingType: 'For Rent',
    //     propertyType: 'Apartment',
    //     size: 1000,
    //     location: 'Test Location',
    //     bedrooms: 2,
    //     bathroom: 1,
    //     baranda: 1,
    //     propertyCategory: 'Residential'
    //   });
    // } catch (error) {
    //   console.log('✅ Expected error for no auth:', error.response.data);
    //   console.log('');
    // }

    // // Test 8: Test protected endpoint with invalid token
    // console.log('8️⃣ Testing protected endpoint with invalid token...');
    // try {
    //   await axios.post(`${API_BASE}/properties`, {
    //     name: 'Test User',
    //     email: 'test@example.com',
    //     phone: '01234567890',
    //     propertyName: 'Test Property Invalid Auth',
    //     listingType: 'For Rent',
    //     propertyType: 'Apartment',
    //     size: 1000,
    //     location: 'Test Location',
    //     bedrooms: 2,
    //     bathroom: 1,
    //     baranda: 1,
    //     category: 'Residential'
    //   }, {
    //     headers: {
    //       'Authorization': 'Bearer invalid-token'
    //     }
    //   });
    // } catch (error) {
    //   console.log('✅ Expected error for invalid token:', error.response.data);
    //   console.log('');
    // }

    console.log('🎉 All authentication tests completed successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

testAuth();