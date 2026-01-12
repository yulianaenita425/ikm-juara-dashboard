const https = require('https');

const BASE_URL = 'https://ikm-juara-dashboard.vercel.app';

function makeRequest(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
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

async function testPelatihanFeatures() {
  console.log('🎯 TESTING PELATIHAN FEATURES LIVE...\n');
  
  try {
    // Test halaman pelatihan
    console.log('1️⃣ Testing halaman pelatihan...');
    const pelatihanPage = await makeRequest(`${BASE_URL}/pelatihan`);
    
    if (pelatihanPage.statusCode === 200) {
      console.log('✅ Halaman pelatihan: ACCESSIBLE');
      
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
      
      // Check for detail modal features
      if (html.includes('Detail Lengkap') || html.includes('Lihat Detail')) {
        console.log('✅ Detail modal features: FOUND');
      } else {
        console.log('❌ Detail modal features: NOT FOUND');
      }
      
    } else {
      console.log(`❌ Halaman pelatihan: ERROR ${pelatihanPage.statusCode}`);
    }
    
    // Test API endpoints
    console.log('\n2️⃣ Testing API endpoints...');
    
    // Test jenis pelatihan API
    const jenisResponse = await makeRequest(`${BASE_URL}/api/jenis-pelatihan`);
    if (jenisResponse.statusCode === 200) {
      console.log('✅ Jenis Pelatihan API: WORKING');
      try {
        const jenisData = JSON.parse(jenisResponse.data);
        if (jenisData.success && jenisData.data) {
          console.log(`📋 Jenis pelatihan count: ${jenisData.data.length}`);
          if (jenisData.data.length > 0) {
            const sample = jenisData.data[0];
            console.log('📋 Sample jenis pelatihan:', {
              jenis_pelatihan: sample.jenis_pelatihan,
              sub_kegiatan: sample.sub_kegiatan,
              jumlah_peserta: sample.jumlah_peserta || 0
            });
          }
        }
      } catch (e) {
        console.log('⚠️ Jenis pelatihan data parsing error');
      }
    } else {
      console.log(`❌ Jenis Pelatihan API: ERROR ${jenisResponse.statusCode}`);
    }
    
    // Test pelatihan API
    const pelatihanResponse = await makeRequest(`${BASE_URL}/api/pelatihan`);
    if (pelatihanResponse.statusCode === 200) {
      console.log('✅ Pelatihan API: WORKING');
      try {
        const pelatihanData = JSON.parse(pelatihanResponse.data);
        if (pelatihanData.success && pelatihanData.data) {
          console.log(`📋 Peserta pelatihan count: ${pelatihanData.data.length}`);
          if (pelatihanData.data.length > 0) {
            const sample = pelatihanData.data[0];
            console.log('📋 Sample peserta pelatihan:', {
              nama_lengkap: sample.ikm_binaan?.nama_lengkap || sample.nama_lengkap,
              jenis_pelatihan: sample.jenis_pelatihan?.jenis_pelatihan || sample.nama_pelatihan,
              sertifikat: sample.sertifikat ? 'Ada' : 'Belum ada'
            });
          }
        }
      } catch (e) {
        console.log('⚠️ Pelatihan data parsing error');
      }
    } else {
      console.log(`❌ Pelatihan API: ERROR ${pelatihanResponse.statusCode}`);
    }
    
    console.log('\n🎉 PELATIHAN FEATURES TEST COMPLETE!');
    console.log('\n📋 MANUAL VERIFICATION STEPS:');
    console.log(`🔗 Buka: ${BASE_URL}/pelatihan`);
    console.log('1. ✅ Pastikan ada 2 tab: "Jenis Pelatihan" dan "Peserta Pelatihan"');
    console.log('2. ✅ Tab Jenis Pelatihan: tombol "Tambah Jenis Pelatihan"');
    console.log('3. ✅ Tab Peserta Pelatihan: tombol "Tambah Peserta Pelatihan"');
    console.log('4. ✅ Kolom "Jumlah Peserta" bisa diklik untuk lihat detail');
    console.log('5. ✅ Tombol aksi: Detail, Lihat Peserta, Edit, Hapus');
    console.log('6. ✅ Modal detail dengan export Excel/PDF');
    console.log('7. ✅ Form tambah peserta dengan pencarian IKM Binaan');
    console.log('8. ✅ Multiple selection jenis pelatihan');
    
    console.log('\n🚀 Jika semua fitur terlihat = DEPLOYMENT SUCCESS!');
    
  } catch (error) {
    console.error('❌ Test error:', error.message);
  }
}

testPelatihanFeatures();