// Script untuk test struktur data HKI Merek
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

async function runTest() {
  console.log('🔍 Testing HKI Merek Data Structure...\n');
  
  try {
    const result = await makeRequest('/api/hki-merek');
    
    if (result.statusCode === 200 && result.response.success) {
      console.log('✅ HKI Merek API SUCCESS\n');
      
      const hkiData = result.response.data;
      console.log(`📊 Total HKI Merek: ${hkiData.length}\n`);
      
      if (hkiData.length > 0) {
        console.log('📋 HKI Merek Data Structure:');
        console.log('='.repeat(60));
        
        hkiData.forEach((hki, index) => {
          console.log(`\n${index + 1}. HKI Record:`);
          console.log(`   ID: ${hki.id}`);
          console.log(`   Nomor Pendaftaran: ${hki.nomor_pendaftaran}`);
          console.log(`   Status: ${hki.status_sertifikat}`);
          console.log(`   Tahun: ${hki.tahun_fasilitasi}`);
          
          if (hki.ikm_binaan) {
            console.log(`   IKM Binaan Data:`);
            console.log(`     - ID: ${hki.ikm_binaan.id}`);
            console.log(`     - NIB: ${hki.ikm_binaan.nib}`);
            console.log(`     - NIK: ${hki.ikm_binaan.nik}`);
            console.log(`     - Nama Lengkap: ${hki.ikm_binaan.nama_lengkap}`);
            console.log(`     - Nama Usaha: ${hki.ikm_binaan.nama_usaha}`);
            console.log(`     - No HP: ${hki.ikm_binaan.nomor_hp}`);
          } else {
            console.log(`   ❌ IKM Binaan Data: NULL/MISSING`);
          }
        });
        
        console.log('\n' + '='.repeat(60));
        
        // Check for missing data
        const missingIkmData = hkiData.filter(hki => !hki.ikm_binaan);
        if (missingIkmData.length > 0) {
          console.log(`\n⚠️  WARNING: ${missingIkmData.length} HKI records missing IKM Binaan data`);
          missingIkmData.forEach(hki => {
            console.log(`   - ${hki.nomor_pendaftaran} (ID: ${hki.id})`);
          });
        } else {
          console.log('\n✅ All HKI records have complete IKM Binaan data');
        }
        
      } else {
        console.log('📋 No HKI Merek data found');
      }
      
    } else {
      console.log('❌ HKI Merek API FAILED');
      console.log('Response:', JSON.stringify(result.response, null, 2));
    }
    
  } catch (error) {
    console.log('\n❌ FAILED: Could not connect to HKI Merek API');
    console.log('🔍 Error:', error.message);
  }
}

runTest();