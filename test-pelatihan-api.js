// Script untuk test API pelatihan
const http = require('http');

function testPelatihanAPI() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/test-pelatihan',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          resolve({
            statusCode: res.statusCode,
            response: response
          });
        } catch (error) {
          reject(new Error(`Failed to parse response: ${error.message}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(new Error(`Request failed: ${error.message}`));
    });

    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    req.end();
  });
}

async function runTest() {
  console.log('🧪 Testing Pelatihan API...\n');
  
  try {
    const result = await testPelatihanAPI();
    
    console.log(`📊 Status Code: ${result.statusCode}`);
    console.log('📋 Response:');
    console.log(JSON.stringify(result.response, null, 2));
    
    if (result.statusCode === 200 && result.response.success) {
      console.log('\n✅ SUCCESS: Pelatihan table is working!');
      console.log(`📈 Total Pelatihan: ${result.response.data?.totalPelatihan || 0}`);
    } else {
      console.log('\n❌ FAILED: Pelatihan table has issues');
      console.log('🔍 Error:', result.response.error || 'Unknown error');
      
      if (result.response.message) {
        console.log('💡 Solution:', result.response.message);
      }
    }
    
  } catch (error) {
    console.log('\n❌ FAILED: Could not connect to pelatihan test endpoint');
    console.log('🔍 Error:', error.message);
  }
}

runTest();