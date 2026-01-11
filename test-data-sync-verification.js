// Script untuk verifikasi sinkronisasi data dashboard vs halaman
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

async function runSyncVerification() {
  console.log('🔍 VERIFIKASI SINKRONISASI DATA DASHBOARD vs HALAMAN\n');
  
  try {
    // 1. Get Dashboard Stats
    console.log('📊 Mengambil data Dashboard Stats...');
    const dashboardResult = await makeRequest('/api/dashboard/stats');
    
    // 2. Get Individual API Data
    console.log('📋 Mengambil data dari API individual...');
    const ikmResult = await makeRequest('/api/ikm-binaan');
    const hkiResult = await makeRequest('/api/hki-merek');
    const halalResult = await makeRequest('/api/sertifikat-halal');
    const pelatihanResult = await makeRequest('/api/pelatihan');
    
    if (dashboardResult.response.success && 
        ikmResult.response.success && 
        hkiResult.response.success && 
        halalResult.response.success && 
        pelatihanResult.response.success) {
      
      console.log('\n✅ Semua API berhasil diakses\n');
      
      // Extract data counts
      const dashboardData = dashboardResult.response;
      const ikmCount = ikmResult.response.data.length;
      const hkiCount = hkiResult.response.data.length;
      const halalCount = halalResult.response.data.length;
      const pelatihanCount = pelatihanResult.response.data.length;
      
      // Dashboard stats
      const dashboardIkm = dashboardData.totalIkmBinaan?.current || 0;
      const dashboardHki = dashboardData.layananStats?.find(l => l.name === 'HKI Merek')?.total || 0;
      const dashboardHalal = dashboardData.layananStats?.find(l => l.name === 'Sertifikat Halal')?.total || 0;
      const dashboardPelatihan = dashboardData.layananStats?.find(l => l.name === 'Pelatihan')?.total || 0;
      
      console.log('📊 PERBANDINGAN DATA:');
      console.log('='.repeat(70));
      console.log('| LAYANAN          | DASHBOARD | HALAMAN | STATUS     |');
      console.log('|------------------|-----------|---------|------------|');
      
      // IKM Binaan
      const ikmStatus = dashboardIkm === ikmCount ? '✅ SINKRON' : '❌ TIDAK SINKRON';
      console.log(`| IKM Binaan       | ${dashboardIkm.toString().padEnd(9)} | ${ikmCount.toString().padEnd(7)} | ${ikmStatus.padEnd(10)} |`);
      
      // HKI Merek
      const hkiStatus = dashboardHki === hkiCount ? '✅ SINKRON' : '❌ TIDAK SINKRON';
      console.log(`| HKI Merek        | ${dashboardHki.toString().padEnd(9)} | ${hkiCount.toString().padEnd(7)} | ${hkiStatus.padEnd(10)} |`);
      
      // Sertifikat Halal
      const halalStatus = dashboardHalal === halalCount ? '✅ SINKRON' : '❌ TIDAK SINKRON';
      console.log(`| Sertifikat Halal | ${dashboardHalal.toString().padEnd(9)} | ${halalCount.toString().padEnd(7)} | ${halalStatus.padEnd(10)} |`);
      
      // Pelatihan
      const pelatihanStatus = dashboardPelatihan === pelatihanCount ? '✅ SINKRON' : '❌ TIDAK SINKRON';
      console.log(`| Pelatihan        | ${dashboardPelatihan.toString().padEnd(9)} | ${pelatihanCount.toString().padEnd(7)} | ${pelatihanStatus.padEnd(10)} |`);
      
      console.log('='.repeat(70));
      
      // Overall status
      const allSynced = (dashboardIkm === ikmCount) && 
                       (dashboardHki === hkiCount) && 
                       (dashboardHalal === halalCount) && 
                       (dashboardPelatihan === pelatihanCount);
      
      if (allSynced) {
        console.log('\n🎉 SEMUA DATA TERSINKRONISASI DENGAN SEMPURNA!');
        console.log('✅ Dashboard menampilkan data yang sama dengan halaman individual');
        console.log('✅ Real-time sync berfungsi dengan baik');
      } else {
        console.log('\n⚠️  ADA DATA YANG TIDAK SINKRON!');
        console.log('🔧 Perlu perbaikan pada API atau query database');
      }
      
      // Detailed breakdown
      console.log('\n📋 DETAIL DATA:');
      console.log(`   🏢 IKM Binaan: ${ikmCount} records`);
      console.log(`   🏛️  HKI Merek: ${hkiCount} records`);
      console.log(`   📜 Sertifikat Halal: ${halalCount} records`);
      console.log(`   🎓 Pelatihan: ${pelatihanCount} records`);
      
      // Dashboard layanan stats detail
      console.log('\n📊 STATISTIK LAYANAN DASHBOARD:');
      if (dashboardData.layananStats) {
        dashboardData.layananStats.forEach(layanan => {
          console.log(`   ${layanan.name}: ${layanan.total} total`);
        });
      }
      
    } else {
      console.log('❌ Gagal mengakses beberapa API endpoint');
    }
    
  } catch (error) {
    console.log('\n❌ FAILED: Could not complete sync verification');
    console.log('🔍 Error:', error.message);
  }
}

runSyncVerification();