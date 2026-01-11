// Script untuk test semua API endpoints
const http = require('http');

function makeRequest(path, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        try {
          const response = JSON.parse(responseData);
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

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

async function runAllTests() {
  console.log('🧪 Testing All API Endpoints...\n');
  
  const endpoints = [
    { name: 'IKM Binaan', path: '/api/ikm-binaan' },
    { name: 'HKI Merek', path: '/api/hki-merek' },
    { name: 'Sertifikat Halal', path: '/api/sertifikat-halal' },
    { name: 'Pelatihan', path: '/api/pelatihan' },
    { name: 'Dashboard Stats', path: '/api/dashboard/stats' }
  ];

  const results = {};
  
  try {
    for (const endpoint of endpoints) {
      console.log(`📊 Testing ${endpoint.name}:`);
      
      try {
        const result = await makeRequest(endpoint.path);
        
        if (result.statusCode === 200 && result.response.success !== false) {
          const dataCount = result.response.data?.length || 0;
          console.log(`   ✅ ${endpoint.name} - SUCCESS (${dataCount} records)`);
          results[endpoint.name] = { success: true, count: dataCount };
        } else {
          console.log(`   ❌ ${endpoint.name} - FAILED`);
          console.log(`   Error: ${result.response.error || 'Unknown error'}`);
          results[endpoint.name] = { success: false, error: result.response.error };
        }
      } catch (error) {
        console.log(`   ❌ ${endpoint.name} - CONNECTION FAILED`);
        console.log(`   Error: ${error.message}`);
        results[endpoint.name] = { success: false, error: error.message };
      }
      
      console.log('');
    }
    
    // Summary
    console.log('📋 SUMMARY:');
    console.log('='.repeat(50));
    
    let totalSuccess = 0;
    let totalEndpoints = endpoints.length;
    
    for (const endpoint of endpoints) {
      const result = results[endpoint.name];
      if (result.success) {
        console.log(`✅ ${endpoint.name}: ${result.count || 'N/A'} records`);
        totalSuccess++;
      } else {
        console.log(`❌ ${endpoint.name}: ${result.error || 'Failed'}`);
      }
    }
    
    console.log('='.repeat(50));
    console.log(`📊 Success Rate: ${totalSuccess}/${totalEndpoints} (${((totalSuccess/totalEndpoints)*100).toFixed(1)}%)`);
    
    if (totalSuccess === totalEndpoints) {
      console.log('🎉 ALL ENDPOINTS WORKING PERFECTLY!');
      
      // Data consistency check
      console.log('\n🔍 DATA CONSISTENCY CHECK:');
      const ikmCount = results['IKM Binaan']?.count || 0;
      const hkiCount = results['HKI Merek']?.count || 0;
      const halalCount = results['Sertifikat Halal']?.count || 0;
      const pelatihanCount = results['Pelatihan']?.count || 0;
      
      console.log(`   IKM Binaan: ${ikmCount}`);
      console.log(`   HKI Merek: ${hkiCount}`);
      console.log(`   Sertifikat Halal: ${halalCount}`);
      console.log(`   Pelatihan: ${pelatihanCount}`);
      
      if (ikmCount >= hkiCount && ikmCount >= halalCount) {
        console.log('   ✅ Data relationships look consistent');
      } else {
        console.log('   ⚠️  Data relationships may need attention');
      }
    } else {
      console.log('⚠️  Some endpoints need attention');
    }
    
  } catch (error) {
    console.log('\n❌ FAILED: Could not complete all tests');
    console.log('🔍 Error:', error.message);
  }
}

runAllTests();