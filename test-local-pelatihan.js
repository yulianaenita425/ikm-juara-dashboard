const http = require('http');

const BASE_URL = 'http://localhost:3001';

function makeRequest(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          data: data
        });
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

async function testLocalPelatihan() {
  console.log('🎯 TESTING LOCAL PELATIHAN FEATURES...\n');
  
  try {
    // Test halaman pelatihan
    console.log('1️⃣ Testing halaman pelatihan lokal...');
    const pelatihanPage = await makeRequest(`${BASE_URL}/pelatihan`);
    
    if (pelatihanPage.statusCode === 200) {
      console.log('✅ Halaman pelatihan lokal: ACCESSIBLE');
      
      // Check for new features in HTML
      const html = pelatihanPage.data;
      
      // Check for tab navigation
      if (html.includes('Jenis Pelatihan') && html.includes('Peserta Pelatihan')) {
        console.log('✅ Tab navigation: FOUND');
      } else {
        console.log('❌ Tab navigation: NOT FOUND');
      }
      
      // Check for action buttons
      if (html.includes('Tambah Jenis Pelatihan') && html.includes('Tambah Peserta Pelatihan')) {
        console.log('✅ Action buttons: FOUND');
      } else {
        console.log('❌ Action buttons: NOT FOUND');
      }
      
      // Check for export features
      if (html.includes('Export Excel') || html.includes('Export PDF')) {
        console.log('✅ Export features: FOUND');
      } else {
        console.log('❌ Export features: NOT FOUND');
      }
      
      // Check for heroicons
      if (html.includes('PlusIcon') || html.includes('DocumentArrowDownIcon')) {
        console.log('✅ Heroicons imports: FOUND');
      } else {
        console.log('❌ Heroicons imports: NOT FOUND');
      }
      
      // Check for specific components
      if (html.includes('activeTab') || html.includes('setActiveTab')) {
        console.log('✅ Tab state management: FOUND');
      } else {
        console.log('❌ Tab state management: NOT FOUND');
      }
      
    } else {
      console.log(`❌ Halaman pelatihan lokal: ERROR ${pelatihanPage.statusCode}`);
    }
    
    console.log('\n📋 NEXT STEPS:');
    console.log(`🔗 Buka browser: ${BASE_URL}/pelatihan`);
    console.log('🔍 Periksa apakah fitur-fitur baru sudah muncul di lokal');
    console.log('🔄 Jika sudah muncul di lokal, masalah ada di deployment');
    console.log('🔄 Jika belum muncul di lokal, masalah ada di kode');
    
  } catch (error) {
    console.error('❌ Test error:', error.message);
  }
}

testLocalPelatihan();