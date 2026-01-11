// Script untuk debug data Sertifikat Halal
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

async function runDebug() {
  console.log('🔍 DEBUG SERTIFIKAT HALAL DATA INCONSISTENCY\n');
  
  try {
    // 1. Test API Sertifikat Halal
    console.log('📊 Testing Sertifikat Halal API...');
    const halalResult = await makeRequest('/api/sertifikat-halal');
    
    // 2. Test Dashboard Stats
    console.log('📊 Testing Dashboard Stats...');
    const dashboardResult = await makeRequest('/api/dashboard/stats');
    
    if (halalResult.statusCode === 200 && halalResult.response.success) {
      console.log('✅ Sertifikat Halal API SUCCESS\n');
      
      const halalData = halalResult.response.data;
      console.log(`📋 SERTIFIKAT HALAL API DATA:`);
      console.log(`   Total Records: ${halalData.length}`);
      
      if (halalData.length > 0) {
        console.log('   Records:');
        halalData.forEach((halal, index) => {
          console.log(`   ${index + 1}. ${halal.nomor_sertifikat}`);
          console.log(`      IKM: ${halal.ikm_binaan?.nama_lengkap || 'N/A'} (${halal.ikm_binaan?.nama_usaha || 'N/A'})`);
          console.log(`      NIB: ${halal.ikm_binaan?.nib || 'N/A'}`);
          console.log(`      Tahun: ${halal.tahun_fasilitasi}`);
          console.log(`      Deleted: ${halal.deleted_at ? 'YES' : 'NO'}`);
          console.log('');
        });
      }
    } else {
      console.log('❌ Sertifikat Halal API FAILED');
      console.log('Response:', halalResult.response);
    }
    
    if (dashboardResult.statusCode === 200) {
      console.log('✅ Dashboard Stats API SUCCESS\n');
      
      const dashboardData = dashboardResult.response;
      const halalStats = dashboardData.layananStats?.find(l => l.name === 'Sertifikat Halal');
      
      console.log(`📊 DASHBOARD STATS DATA:`);
      console.log(`   Sertifikat Halal Count: ${halalStats?.total || 'N/A'}`);
      
      console.log('\n   All Layanan Stats:');
      if (dashboardData.layananStats) {
        dashboardData.layananStats.forEach(layanan => {
          console.log(`   ${layanan.name}: ${layanan.total}`);
        });
      }
    } else {
      console.log('❌ Dashboard Stats API FAILED');
    }
    
    // 3. Compare Results
    if (halalResult.response.success && dashboardResult.statusCode === 200) {
      const apiCount = halalResult.response.data.length;
      const dashboardCount = dashboardResult.response.layananStats?.find(l => l.name === 'Sertifikat Halal')?.total || 0;
      
      console.log('\n🔍 COMPARISON:');
      console.log(`   API Endpoint: ${apiCount} records`);
      console.log(`   Dashboard: ${dashboardCount} records`);
      
      if (apiCount === dashboardCount) {
        console.log('   ✅ DATA CONSISTENT');
      } else {
        console.log('   ❌ DATA INCONSISTENT!');
        console.log('   🔧 Need to investigate query differences');
      }
    }
    
    // 4. Test Raw Database Query
    console.log('\n📊 Testing Raw Database via Debug API...');
    const debugResult = await makeRequest('/api/debug-data');
    
    if (debugResult.statusCode === 200 && debugResult.response.success) {
      const debugData = debugResult.response.data;
      const rawHalalData = debugData.allSertifikatHalal || [];
      
      console.log(`📋 RAW DATABASE DATA:`);
      console.log(`   Total Records in DB: ${rawHalalData.length}`);
      console.log(`   Records with deleted_at IS NULL: ${rawHalalData.filter(h => !h.deleted_at).length}`);
      console.log(`   Records with deleted_at NOT NULL: ${rawHalalData.filter(h => h.deleted_at).length}`);
      
      if (rawHalalData.length > 0) {
        console.log('\n   Raw Records:');
        rawHalalData.forEach((halal, index) => {
          console.log(`   ${index + 1}. ${halal.nomor_sertifikat}`);
          console.log(`      IKM ID: ${halal.ikm_id}`);
          console.log(`      Deleted: ${halal.deleted_at ? 'YES' : 'NO'}`);
          console.log(`      Created: ${halal.created_at}`);
        });
      }
    }
    
  } catch (error) {
    console.log('\n❌ FAILED: Could not complete debug');
    console.log('🔍 Error:', error.message);
  }
}

runDebug();