// Script untuk test debug data
const http = require('http');

function testDebugData() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/debug-data',
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

    req.setTimeout(15000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    req.end();
  });
}

async function runTest() {
  console.log('🔍 Debugging Data Inconsistency...\n');
  
  try {
    const result = await testDebugData();
    
    if (result.statusCode === 200 && result.response.success) {
      const data = result.response.data;
      
      console.log('✅ DEBUG DATA SUCCESS!\n');
      
      // 1. IKM Binaan Analysis
      console.log('📊 IKM BINAAN ANALYSIS:');
      console.log(`   Total records in table: ${data.allIkmBinaan?.length || 0}`);
      console.log(`   Count with deleted_at IS NULL: ${data.counts.ikmBinaan}`);
      console.log(`   Records with deleted_at NOT NULL: ${data.analysis.ikmWithDeletedAt?.length || 0}`);
      
      if (data.allIkmBinaan && data.allIkmBinaan.length > 0) {
        console.log('\n   📋 All IKM Binaan Records:');
        data.allIkmBinaan.forEach((ikm, index) => {
          console.log(`   ${index + 1}. ${ikm.nama_lengkap} (${ikm.nama_usaha}) - NIB: ${ikm.nib}`);
          console.log(`      ID: ${ikm.id}`);
          console.log(`      Deleted: ${ikm.deleted_at ? 'YES' : 'NO'}`);
          console.log(`      Created: ${ikm.created_at}`);
          console.log('');
        });
      }
      
      // 2. HKI Merek Analysis
      console.log('\n📊 HKI MEREK ANALYSIS:');
      console.log(`   Total records in table: ${data.allHkiMerek?.length || 0}`);
      console.log(`   Count with deleted_at IS NULL: ${data.counts.hkiMerek}`);
      console.log(`   Records with deleted_at NOT NULL: ${data.analysis.hkiWithDeletedAt?.length || 0}`);
      console.log(`   HKI Merek 2024: ${data.hkiMerek2024?.length || 0}`);
      
      if (data.allHkiMerek && data.allHkiMerek.length > 0) {
        console.log('\n   📋 All HKI Merek Records:');
        data.allHkiMerek.forEach((hki, index) => {
          console.log(`   ${index + 1}. ${hki.nomor_pendaftaran} - Status: ${hki.status_sertifikat}`);
          console.log(`      IKM: ${hki.ikm_binaan?.nama_lengkap || 'N/A'} (${hki.ikm_binaan?.nama_usaha || 'N/A'})`);
          console.log(`      Tahun: ${hki.tahun_fasilitasi}`);
          console.log(`      Deleted: ${hki.deleted_at ? 'YES' : 'NO'}`);
          console.log(`      Created: ${hki.created_at}`);
          console.log('');
        });
      }
      
      // 3. HKI Merek 2024 Specific
      if (data.hkiMerek2024 && data.hkiMerek2024.length > 0) {
        console.log('\n   📋 HKI Merek 2024 Records:');
        data.hkiMerek2024.forEach((hki, index) => {
          console.log(`   ${index + 1}. ${hki.nomor_pendaftaran} - Status: ${hki.status_sertifikat}`);
          console.log(`      IKM: ${hki.ikm_binaan?.nama_lengkap || 'N/A'} (${hki.ikm_binaan?.nama_usaha || 'N/A'})`);
          console.log('');
        });
      }
      
      // 4. Sertifikat Halal Analysis
      console.log('\n📊 SERTIFIKAT HALAL ANALYSIS:');
      console.log(`   Total records in table: ${data.allSertifikatHalal?.length || 0}`);
      console.log(`   Count with deleted_at IS NULL: ${data.counts.sertifikatHalal}`);
      
      if (data.allSertifikatHalal && data.allSertifikatHalal.length > 0) {
        console.log('\n   📋 All Sertifikat Halal Records:');
        data.allSertifikatHalal.forEach((halal, index) => {
          console.log(`   ${index + 1}. ${halal.nomor_sertifikat}`);
          console.log(`      IKM: ${halal.ikm_binaan?.nama_lengkap || 'N/A'} (${halal.ikm_binaan?.nama_usaha || 'N/A'})`);
          console.log(`      Deleted: ${halal.deleted_at ? 'YES' : 'NO'}`);
          console.log('');
        });
      }
      
    } else {
      console.log('❌ DEBUG FAILED');
      console.log('Response:', JSON.stringify(result.response, null, 2));
    }
    
  } catch (error) {
    console.log('\n❌ FAILED: Could not connect to debug endpoint');
    console.log('🔍 Error:', error.message);
  }
}

runTest();