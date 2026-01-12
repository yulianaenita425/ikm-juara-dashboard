const https = require('https');

const BASE_URL = 'https://ikm-juara-dashboard.vercel.app';

function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    };
    
    https.get(url, options, (res) => {
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

async function testNewPelatihanPage() {
  console.log('🎯 TESTING NEW PELATIHAN PAGE...\n');
  
  try {
    // Test new pelatihan page
    const timestamp = Date.now();
    const newPageUrl = `${BASE_URL}/pelatihan-new?v=${timestamp}`;
    
    console.log(`🔗 Testing NEW page: ${newPageUrl}`);
    
    const response = await makeRequest(newPageUrl);
    
    if (response.statusCode === 200) {
      console.log('✅ New page accessible');
      
      const html = response.data;
      
      // Check for new features
      const checks = [
        { name: 'New Title', pattern: /FITUR BARU.*Pelatihan Pemberdayaan Industri/s },
        { name: 'Tab Navigation', pattern: /Jenis Pelatihan.*Peserta Pelatihan/s },
        { name: 'Emoji Icons', pattern: /📚|👥|✨|🚀/s },
        { name: 'Gradient Styling', pattern: /gradient-to-r/s },
        { name: 'Enhanced Buttons', pattern: /Tambah Jenis Pelatihan.*Tambah Peserta Pelatihan/s }
      ];
      
      console.log('\n📋 NEW PAGE FEATURE DETECTION:');
      let foundFeatures = 0;
      
      checks.forEach(check => {
        if (check.pattern.test(html)) {
          console.log(`✅ ${check.name}: FOUND`);
          foundFeatures++;
        } else {
          console.log(`❌ ${check.name}: NOT FOUND`);
        }
      });
      
      console.log(`\n📊 NEW PAGE SUMMARY: ${foundFeatures}/${checks.length} features detected`);
      
      if (foundFeatures > 0) {
        console.log('\n🎉 NEW PAGE WORKING!');
        console.log('✅ Deployment system is functional');
        console.log('💡 Issue is with the original pelatihan.js file');
      } else {
        console.log('\n⚠️  NEW PAGE ALSO NOT WORKING');
        console.log('🔍 Deployment system may have issues');
      }
      
    } else {
      console.log(`❌ New page error: ${response.statusCode}`);
    }
    
    // Also test original page for comparison
    console.log('\n🔄 COMPARING WITH ORIGINAL PAGE...');
    const originalUrl = `${BASE_URL}/pelatihan?v=${timestamp}`;
    const originalResponse = await makeRequest(originalUrl);
    
    if (originalResponse.statusCode === 200) {
      const originalHtml = originalResponse.data;
      
      if (originalHtml.includes('FITUR BARU') || originalHtml.includes('🚀')) {
        console.log('✅ Original page also updated');
      } else {
        console.log('❌ Original page still old version');
      }
    }
    
    console.log('\n📋 NEXT STEPS:');
    console.log(`🔗 Test new page: ${BASE_URL}/pelatihan-new`);
    console.log(`🔗 Compare with original: ${BASE_URL}/pelatihan`);
    console.log('🔄 If new page works, replace original file');
    
  } catch (error) {
    console.error('❌ Test error:', error.message);
  }
}

testNewPelatihanPage();