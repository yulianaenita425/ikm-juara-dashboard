const https = require('https');
const http = require('http');
const { URL } = require('url');

const PRODUCTION_URL = 'https://ikm-juara-dashboard.vercel.app';

function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const client = urlObj.protocol === 'https:' ? https : http;
    
    const req = client.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          statusText: res.statusMessage,
          ok: res.statusCode >= 200 && res.statusCode < 300,
          text: () => Promise.resolve(data),
          json: () => Promise.resolve(JSON.parse(data))
        });
      });
    });
    
    req.on('error', reject);
    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

async function testProductionDeployment() {
  console.log('🚀 Testing Production Deployment...\n');

  const tests = [
    {
      name: 'Homepage',
      url: `${PRODUCTION_URL}/`,
      expectText: 'Database IKM JUARA'
    },
    {
      name: 'Dashboard',
      url: `${PRODUCTION_URL}/dashboard`,
      expectText: 'Dashboard'
    },
    {
      name: 'API - Dashboard Stats',
      url: `${PRODUCTION_URL}/api/dashboard/stats`,
      expectJson: true
    },
    {
      name: 'API - Test Supabase',
      url: `${PRODUCTION_URL}/api/test-supabase`,
      expectJson: true
    },
    {
      name: 'IKM Binaan Page',
      url: `${PRODUCTION_URL}/ikm-binaan`,
      expectText: 'IKM Binaan'
    },
    {
      name: 'Pelatihan Page',
      url: `${PRODUCTION_URL}/pelatihan`,
      expectText: 'Pelatihan'
    },
    {
      name: 'API - Pelatihan',
      url: `${PRODUCTION_URL}/api/pelatihan`,
      expectJson: true
    },
    {
      name: 'API - IKM Binaan',
      url: `${PRODUCTION_URL}/api/ikm-binaan`,
      expectJson: true
    }
  ];

  let passedTests = 0;
  let totalTests = tests.length;

  for (const test of tests) {
    try {
      console.log(`Testing: ${test.name}`);
      const response = await makeRequest(test.url);
      
      if (response.ok) {
        if (test.expectJson) {
          const data = await response.json();
          console.log(`✅ ${test.name} - Status: ${response.status}`);
          console.log(`   Response: ${JSON.stringify(data).substring(0, 100)}...`);
        } else {
          const text = await response.text();
          if (text.includes(test.expectText)) {
            console.log(`✅ ${test.name} - Status: ${response.status} - Contains expected text`);
          } else {
            console.log(`⚠️  ${test.name} - Status: ${response.status} - Missing expected text`);
          }
        }
        passedTests++;
      } else {
        console.log(`❌ ${test.name} - Status: ${response.status} - ${response.statusText}`);
      }
    } catch (error) {
      console.log(`❌ ${test.name} - Error: ${error.message}`);
    }
    console.log('');
  }

  console.log(`\n📊 Test Results: ${passedTests}/${totalTests} tests passed`);
  
  if (passedTests === totalTests) {
    console.log('🎉 All tests passed! Deployment is successful!');
  } else {
    console.log('⚠️  Some tests failed. Check the logs above for details.');
  }

  // Test specific endpoints that might have issues
  console.log('\n🔍 Testing Critical Endpoints...');
  
  try {
    const supabaseTest = await makeRequest(`${PRODUCTION_URL}/api/test-supabase`);
    const supabaseData = await supabaseTest.json();
    
    if (supabaseData.success) {
      console.log('✅ Supabase connection is working!');
      console.log(`   Tables found: ${supabaseData.tables?.length || 0}`);
    } else {
      console.log('❌ Supabase connection failed:');
      console.log(`   Error: ${supabaseData.error}`);
    }
  } catch (error) {
    console.log('❌ Failed to test Supabase connection:', error.message);
  }
}

testProductionDeployment().catch(console.error);