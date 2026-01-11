// Script untuk test API endpoints
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

async function runTests() {
  console.log('🧪 Testing API Endpoints...\n');
  
  try {
    // 1. Test IKM Binaan API
    console.log('📊 Testing IKM Binaan API:');
    const ikmResult = await makeRequest('/api/ikm-binaan');
    
    if (ikmResult.statusCode === 200 && ikmResult.response.success) {
      console.log(`   ✅ GET /api/ikm-binaan - SUCCESS`);
      console.log(`   📈 Total IKM Binaan: ${ikmResult.response.data.length}`);
      
      if (ikmResult.response.data.length > 0) {
        console.log('   📋 IKM Binaan Records:');
        ikmResult.response.data.forEach((ikm, index) => {
          console.log(`      ${index + 1}. ${ikm.nama_lengkap} (${ikm.nama_usaha}) - NIB: ${ikm.nib}`);
        });
      }
    } else {
      console.log(`   ❌ GET /api/ikm-binaan - FAILED`);
      console.log(`   Error: ${ikmResult.response.error}`);
    }
    
    console.log('');
    
    // 2. Test HKI Merek API
    console.log('📊 Testing HKI Merek API:');
    const hkiResult = await makeRequest('/api/hki-merek');
    
    if (hkiResult.statusCode === 200 && hkiResult.response.success) {
      console.log(`   ✅ GET /api/hki-merek - SUCCESS`);
      console.log(`   📈 Total HKI Merek: ${hkiResult.response.data.length}`);
      
      if (hkiResult.response.data.length > 0) {
        console.log('   📋 HKI Merek Records:');
        hkiResult.response.data.forEach((hki, index) => {
          console.log(`      ${index + 1}. ${hki.nomor_pendaftaran} - Status: ${hki.status_sertifikat}`);
          console.log(`         IKM: ${hki.ikm_binaan?.nama_lengkap || 'N/A'} (${hki.ikm_binaan?.nama_usaha || 'N/A'})`);
          console.log(`         Tahun: ${hki.tahun_fasilitasi}`);
        });
      }
    } else {
      console.log(`   ❌ GET /api/hki-merek - FAILED`);
      console.log(`   Error: ${hkiResult.response.error}`);
    }
    
    console.log('');
    
    // 3. Analysis
    console.log('🔍 Data Analysis:');
    if (ikmResult.response.success && hkiResult.response.success) {
      const ikmCount = ikmResult.response.data.length;
      const hkiCount = hkiResult.response.data.length;
      const hki2024Count = hkiResult.response.data.filter(hki => hki.tahun_fasilitasi === 2024).length;
      
      console.log(`   📊 IKM Binaan: ${ikmCount} records`);
      console.log(`   📊 HKI Merek Total: ${hkiCount} records`);
      console.log(`   📊 HKI Merek 2024: ${hki2024Count} records`);
      
      // Check for inconsistencies
      if (ikmCount === 5 && hkiCount === 3 && hki2024Count === 3) {
        console.log('   ✅ Data consistency: GOOD');
      } else {
        console.log('   ⚠️  Data consistency: NEEDS ATTENTION');
      }
    }
    
  } catch (error) {
    console.log('\n❌ FAILED: Could not connect to API endpoints');
    console.log('🔍 Error:', error.message);
  }
}

runTests();