// Script untuk test dashboard stats API
// Jalankan dengan: node test-dashboard-stats.js

const http = require('http');

function testDashboardStats() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/dashboard/stats',
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

async function runDashboardTest() {
  console.log('📊 Testing Dashboard Stats API...\n');
  
  try {
    const result = await testDashboardStats();
    
    console.log(`📊 Status Code: ${result.statusCode}`);
    
    if (result.statusCode === 200) {
      const stats = result.response;
      
      console.log('✅ Dashboard API is working!');
      console.log('\n📈 Dashboard Statistics:');
      console.log(`   🏢 Total IKM Binaan: ${stats.totalIkmBinaan?.current || 'N/A'}`);
      console.log(`   ⚡ Layanan Aktif: ${stats.layananAktif?.current || 'N/A'}`);
      console.log(`   🎓 Pelatihan Selesai: ${stats.pelatihanSelesai?.current ?? 'N/A'}`);
      console.log(`   👥 Pengguna Terdaftar: ${stats.penggunaTerdaftar?.current ?? 'N/A'}`);
      
      console.log('\n📋 Layanan Stats:');
      if (stats.layananStats && stats.layananStats.length > 0) {
        stats.layananStats.forEach(layanan => {
          console.log(`   ${layanan.name}: ${layanan.total} total`);
        });
      }
      
      console.log('\n📝 Recent Activities:');
      if (stats.recentActivities && stats.recentActivities.length > 0) {
        stats.recentActivities.slice(0, 3).forEach(activity => {
          console.log(`   • ${activity.message} (${activity.time})`);
        });
      }
      
      // Check if using real data or simulation
      console.log('\n🔍 Data Source Analysis:');
      if (stats.totalIkmBinaan?.current === 5) {
        console.log('   ✅ Likely using REAL Supabase data (matches test-supabase result)');
      } else {
        console.log('   ⚠️  Might be using simulation data');
      }
      
    } else {
      console.log('❌ Dashboard API failed');
      console.log('Response:', JSON.stringify(result.response, null, 2));
    }
    
  } catch (error) {
    console.log('\n❌ FAILED: Could not connect to dashboard stats endpoint');
    console.log('🔍 Error:', error.message);
  }
}

// Jalankan test
runDashboardTest();