// Simple script to test the deployed backend
const API_URL = 'https://capstone-backend.onrender.com';

async function testDeployment() {
  console.log('Testing backend deployment...\n');

  // Test 1: Health check
  try {
    console.log('1. Testing health endpoint...');
    const healthResponse = await fetch(`${API_URL}/health`);
    if (healthResponse.ok) {
      const healthData = await healthResponse.json();
      console.log('✅ Health check passed:', healthData);
    } else {
      console.log('❌ Health check failed:', healthResponse.status, healthResponse.statusText);
    }
  } catch (error) {
    console.log('❌ Health check error:', error.message);
  }

  // Test 2: CORS preflight
  try {
    console.log('\n2. Testing CORS preflight...');
    const corsResponse = await fetch(`${API_URL}/api/books`, {
      method: 'OPTIONS',
      headers: {
        'Origin': 'https://capstone-sem3-j7sk.vercel.app',
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'Content-Type,Authorization'
      }
    });
    console.log('CORS preflight status:', corsResponse.status);
    console.log('CORS headers:', Object.fromEntries(corsResponse.headers.entries()));
  } catch (error) {
    console.log('❌ CORS preflight error:', error.message);
  }

  // Test 3: API endpoint without auth
  try {
    console.log('\n3. Testing API endpoint (should return 401)...');
    const apiResponse = await fetch(`${API_URL}/api/books`);
    console.log('API response status:', apiResponse.status);
    if (!apiResponse.ok) {
      const errorData = await apiResponse.json();
      console.log('Expected error:', errorData);
    }
  } catch (error) {
    console.log('❌ API test error:', error.message);
  }
}

testDeployment().catch(console.error);