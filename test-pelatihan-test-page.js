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

async function testPelatihanTestPage() {
  console.log('🎯 TESTING PELATIHAN TEST PAGE...\n');
  
  try {
    // Test halaman pelatihan-test
    console.log('1️⃣ Testing halaman pelatihan-test...');
    const pelatihanPage = await makeRequest(`${BASE_URL}/pelatihan-test`);
    
    if (pelatihanPage.statusCode === 200) {
      console.log('✅ Halaman pelatihan-test: ACCESSIBLE');
      
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
      
      // Check for tab state
      if (html.includes('activeTab') || html.includes('setActiveTab')) {
        console.log('✅ Tab state: FOUND');
      } else {
        console.log('❌ Tab state: NOT FOUND');
      }
      
    } else {
      console.log(`❌ Halaman pelatihan-test: ERROR ${pelatihanPage.statusCode}`);
    }
    
    console.log('\n📋 COMPARISON TEST:');
    console.log(`🔗 Test page: ${BASE_URL}/pelatihan-test`);
    console.log(`🔗 Original page: ${BASE_URL}/pelatihan`);
    console.log('🔍 Bandingkan kedua halaman untuk melihat perbedaan');
    
  } catch (error) {
    console.error('❌ Test error:', error.message);
  }
}

testPelatihanTestPage();