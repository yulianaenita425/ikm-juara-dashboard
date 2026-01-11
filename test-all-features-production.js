const https = require('https');
const { URL } = require('url');

const PRODUCTION_URL = 'https://ikm-juara-dashboard.vercel.app';

function makeRequest(url, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || 443,
      path: urlObj.pathname + urlObj.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Node.js Test Client'
      }
    };

    if (data && method !== 'GET') {
      const postData = JSON.stringify(data);
      options.headers['Content-Length'] = Buffer.byteLength(postData);
    }

    const req = https.request(options, (res) => {
      let responseData = '';
      res.on('data', chunk => responseData += chunk);
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          statusText: res.statusMessage,
          ok: res.statusCode >= 200 && res.statusCode < 300,
          headers: res.headers,
          text: () => Promise.resolve(responseData),
          json: () => Promise.resolve(JSON.parse(responseData))
        });
      });
    });

    req.on('error', reject);
    req.setTimeout(15000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    if (data && method !== 'GET') {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

async function testAllFeatures() {
  console.log('🚀 Testing All Features in Production...\n');

  const testSuites = [
    {
      name: '📊 Dashboard & Statistics',
      tests: [
        { name: 'Dashboard Stats API', url: '/api/dashboard/stats', expectJson: true },
        { name: 'Dashboard Page', url: '/dashboard', expectStatus: 200 }
      ]
    },
    {
      name: '🏢 IKM Binaan Management',
      tests: [
        { name: 'IKM Binaan API - GET', url: '/api/ikm-binaan', expectJson: true },
        { name: 'IKM Binaan Page', url: '/ikm-binaan', expectStatus: 200 },
        { 
          name: 'IKM Binaan API - POST', 
          url: '/api/ikm-binaan', 
          method: 'POST',
          data: {
            nib: '1234567890123',
            nik: '1234567890123456',
            nama_lengkap: 'Test User',
            alamat_lengkap: 'Test Address',
            nama_usaha: 'Test Business',
            nomor_hp: '081234567890'
          },
          expectJson: true 
        }
      ]
    },
    {
      name: '🎓 Pelatihan System',
      tests: [
        { name: 'Pelatihan API - GET', url: '/api/pelatihan', expectJson: true },
        { name: 'Pelatihan Page', url: '/pelatihan', expectStatus: 200 }
      ]
    },
    {
      name: '🏷️ Layanan IKM Juara',
      tests: [
        { name: 'HKI Merek API', url: '/api/hki-merek', expectJson: true },
        { name: 'HKI Merek Page', url: '/layanan/hki-merek', expectStatus: 200 },
        { name: 'Sertifikat Halal API', url: '/api/sertifikat-halal', expectJson: true },
        { name: 'Sertifikat Halal Page', url: '/layanan/sertifikat-halal', expectStatus: 200 },
        { name: 'TKDN IK API', url: '/api/tkdn-ik', expectJson: true },
        { name: 'TKDN IK Page', url: '/layanan/tkdn-ik', expectStatus: 200 },
        { name: 'SIINas API', url: '/api/siinas', expectJson: true },
        { name: 'SIINas Page', url: '/layanan/siinas', expectStatus: 200 },
        { name: 'Uji Nilai Gizi API', url: '/api/uji-nilai-gizi', expectJson: true },
        { name: 'Uji Nilai Gizi Page', url: '/layanan/uji-nilai-gizi', expectStatus: 200 },
        { name: 'Kurasi Produk API', url: '/api/kurasi-produk', expectJson: true },
        { name: 'Kurasi Produk Page', url: '/layanan/kurasi-produk', expectStatus: 200 }
      ]
    },
    {
      name: '📋 Additional Features',
      tests: [
        { name: 'Buku Tamu API', url: '/api/buku-tamu', expectJson: true },
        { name: 'Laporan Page', url: '/laporan', expectStatus: 200 },
        { name: 'Log Aktivitas Page', url: '/log-aktivitas', expectStatus: 200 },
        { name: 'Penelusuran Page', url: '/penelusuran', expectStatus: 200 },
        { name: 'Recycle Bin Page', url: '/recycle-bin', expectStatus: 200 }
      ]
    },
    {
      name: '🔧 System & Database',
      tests: [
        { name: 'Supabase Connection Test', url: '/api/test-supabase', expectJson: true },
        { name: 'Debug Data API', url: '/api/debug-data', expectJson: true }
      ]
    }
  ];

  let totalTests = 0;
  let passedTests = 0;
  let failedTests = [];

  for (const suite of testSuites) {
    console.log(`\n${suite.name}`);
    console.log('='.repeat(50));

    for (const test of suite.tests) {
      totalTests++;
      try {
        const url = `${PRODUCTION_URL}${test.url}`;
        const response = await makeRequest(url, test.method || 'GET', test.data);
        
        let success = false;
        let message = '';

        if (test.expectJson) {
          if (response.ok) {
            const data = await response.json();
            success = true;
            message = `✅ ${test.name} - Status: ${response.status} - JSON Response OK`;
            if (data.success !== undefined) {
              message += ` (Success: ${data.success})`;
            }
          } else {
            message = `❌ ${test.name} - Status: ${response.status} - ${response.statusText}`;
            failedTests.push({ test: test.name, error: `HTTP ${response.status}` });
          }
        } else if (test.expectStatus) {
          if (response.status === test.expectStatus) {
            success = true;
            message = `✅ ${test.name} - Status: ${response.status} - OK`;
          } else {
            message = `❌ ${test.name} - Expected: ${test.expectStatus}, Got: ${response.status}`;
            failedTests.push({ test: test.name, error: `Expected ${test.expectStatus}, got ${response.status}` });
          }
        }

        if (success) {
          passedTests++;
        }

        console.log(message);

      } catch (error) {
        console.log(`❌ ${test.name} - Error: ${error.message}`);
        failedTests.push({ test: test.name, error: error.message });
      }
    }
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 COMPREHENSIVE TEST RESULTS');
  console.log('='.repeat(60));
  console.log(`Total Tests: ${totalTests}`);
  console.log(`Passed: ${passedTests} ✅`);
  console.log(`Failed: ${totalTests - passedTests} ❌`);
  console.log(`Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`);

  if (failedTests.length > 0) {
    console.log('\n❌ Failed Tests:');
    failedTests.forEach((fail, index) => {
      console.log(`${index + 1}. ${fail.test} - ${fail.error}`);
    });
  }

  if (passedTests === totalTests) {
    console.log('\n🎉 ALL TESTS PASSED! Your application is fully functional!');
  } else if (passedTests / totalTests >= 0.8) {
    console.log('\n✅ Most features are working! Minor issues detected.');
  } else {
    console.log('\n⚠️ Several issues detected. Please check the failed tests above.');
  }

  // Test specific critical functionality
  console.log('\n🔍 Testing Critical User Flows...');
  
  try {
    // Test dashboard data flow
    const dashboardStats = await makeRequest(`${PRODUCTION_URL}/api/dashboard/stats`);
    if (dashboardStats.ok) {
      const stats = await dashboardStats.json();
      console.log('✅ Dashboard data flow working');
      console.log(`   - Total IKM Binaan: ${stats.totalIkmBinaan?.current || 0}`);
      console.log(`   - Layanan Stats: ${stats.layananStats?.length || 0} services`);
    }

    // Test database connectivity
    const dbTest = await makeRequest(`${PRODUCTION_URL}/api/test-supabase`);
    if (dbTest.ok) {
      const dbData = await dbTest.json();
      console.log('✅ Database connectivity working');
      console.log(`   - Connection: ${dbData.success ? 'OK' : 'Failed'}`);
      console.log(`   - Sample data: ${dbData.data?.sampleIkm?.length || 0} records`);
    }

  } catch (error) {
    console.log('❌ Critical flow test failed:', error.message);
  }

  console.log('\n🚀 Production deployment testing completed!');
}

testAllFeatures().catch(console.error);