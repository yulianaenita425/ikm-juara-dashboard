// Script untuk test koneksi Supabase
// Jalankan dengan: node test-supabase-connection.js

const http = require('http');

function testSupabaseConnection() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/test-supabase',
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
  console.log('🧪 Testing Supabase Connection...\n');
  
  try {
    const result = await testSupabaseConnection();
    
    console.log(`📊 Status Code: ${result.statusCode}`);
    console.log('📋 Response:');
    console.log(JSON.stringify(result.response, null, 2));
    
    if (result.statusCode === 200 && result.response.success) {
      console.log('\n✅ SUCCESS: Supabase connection is working!');
      console.log(`📈 Total IKM in database: ${result.response.data?.totalIkm || 'N/A'}`);
      
      if (result.response.data?.sampleIkm?.length > 0) {
        console.log(`📝 Sample IKM: ${result.response.data.sampleIkm[0].nama_usaha || 'N/A'}`);
      }
    } else {
      console.log('\n❌ FAILED: Supabase connection failed');
      console.log('🔍 Error:', result.response.error || 'Unknown error');
    }
    
  } catch (error) {
    console.log('\n❌ FAILED: Could not connect to test endpoint');
    console.log('🔍 Error:', error.message);
    console.log('\n💡 Possible solutions:');
    console.log('   1. Make sure development server is running (npm run dev)');
    console.log('   2. Check if port 3000 is available');
    console.log('   3. Verify .env.local has correct Supabase credentials');
  }
}

// Jalankan test
runTest();