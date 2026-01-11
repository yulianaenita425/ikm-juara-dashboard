// Test Vercel deployment status
const https = require('https');

const baseUrl = 'https://ikm-juara-dashboard.vercel.app';

function testEndpoint(path, description) {
  return new Promise((resolve) => {
    const url = `${baseUrl}${path}`;
    console.log(`Testing: ${description}`);
    console.log(`URL: ${url}`);
    
    https.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        const status = res.statusCode;
        const isSuccess = status >= 200 && status < 300;
        const statusIcon = isSuccess ? '✅' : '❌';
        
        console.log(`${statusIcon} ${description} - Status: ${status}`);
        
        if (path.startsWith('/api/')) {
          try {
            const jsonData = JSON.parse(data);
            console.log(`   Response: ${JSON.stringify(jsonData).substring(0, 100)}...`);
          } catch (e) {
            console.log(`   Response: ${data.substring(0, 100)}...`);
          }
        } else {
          const hasContent = data.length > 100;
          console.log(`   Content: ${hasContent ? 'Page loaded' : 'Minimal content'} (${data.length} bytes)`);
        }
        
        resolve({ status, isSuccess, data });
      });
    }).on('error', (err) => {
      console.log(`❌ ${description} - Error: ${err.message}`);
      resolve({ status: 0, isSuccess: false, error: err.message });
    });
  });
}

async function testDeployment() {
  console.log('🚀 Testing Vercel Deployment Status...');
  console.log('='.repeat(50));
  
  const tests = [
    { path: '/', description: 'Homepage' },
    { path: '/login', description: 'Login Page' },
    { path: '/dashboard', description: 'Dashboard' },
    { path: '/api/test-supabase', description: 'API - Test Supabase' },
    { path: '/api/dashboard/stats', description: 'API - Dashboard Stats' },
    { path: '/api/ikm-binaan', description: 'API - IKM Binaan' },
    { path: '/api/pelatihan', description: 'API - Pelatihan' },
    { path: '/api/sertifikat-halal', description: 'API - Sertifikat Halal' },
    { path: '/api/jenis-pelatihan', description: 'API - Jenis Pelatihan' },
    { path: '/pelatihan', description: 'Pelatihan Page' },
    { path: '/layanan/sertifikat-halal', description: 'Sertifikat Halal Page' },
    { path: '/penelusuran', description: 'Penelusuran Page' },
    { path: '/laporan', description: 'Laporan Page' }
  ];
  
  let successCount = 0;
  const results = [];
  
  for (const test of tests) {
    const result = await testEndpoint(test.path, test.description);
    results.push({ ...test, ...result });
    if (result.isSuccess) successCount++;
    console.log(''); // Empty line for readability
  }
  
  console.log('='.repeat(50));
  console.log('📊 DEPLOYMENT TEST RESULTS');
  console.log('='.repeat(50));
  console.log(`✅ Successful: ${successCount}/${tests.length} tests`);
  console.log(`📈 Success Rate: ${Math.round((successCount/tests.length)*100)}%`);
  
  console.log('\n🔍 DETAILED RESULTS:');
  results.forEach(result => {
    const icon = result.isSuccess ? '✅' : '❌';
    console.log(`${icon} ${result.description} - ${result.status || 'Error'}`);
  });
  
  if (successCount === tests.length) {
    console.log('\n🎉 ALL TESTS PASSED! Deployment is successful!');
    console.log('🌐 Website is fully functional at: https://ikm-juara-dashboard.vercel.app/');
  } else {
    console.log('\n⚠️ Some tests failed. Check the results above.');
  }
  
  console.log('\n📋 NEXT STEPS:');
  console.log('1. Login with: admin / admin123');
  console.log('2. Test all 6 fixed features manually');
  console.log('3. Verify NIB 1909210016219 in penelusuran');
  console.log('4. Check form persistence in pelatihan');
  console.log('5. Test year range 2020-2040 in laporan');
}

testDeployment().catch(console.error);