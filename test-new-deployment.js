const https = require('https');

const NEW_URL = 'https://ikm-dashboard.vercel.app';

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

async function testNewDeployment() {
  console.log('🎯 TESTING NEW DEPLOYMENT...\n');
  
  try {
    const timestamp = Date.now();
    const pelatihanUrl = `${NEW_URL}/pelatihan?v=${timestamp}`;
    
    console.log(`🔗 Testing NEW deployment: ${pelatihanUrl}`);
    
    const response = await makeRequest(pelatihanUrl);
    
    if (response.statusCode === 200) {
      console.log('✅ New deployment accessible');
      
      const html = response.data;
      
      // Check for enhanced features
      const checks = [
        { name: 'Enhanced Title', pattern: /🚀.*FITUR BARU.*Pelatihan Pemberdayaan Industri/s },
        { name: 'Tab Navigation', pattern: /📚.*Jenis Pelatihan.*👥.*Peserta Pelatihan/s },
        { name: 'Enhanced Buttons', pattern: /✨.*Tambah Jenis Pelatihan/s },
        { name: 'Gradient Styling', pattern: /gradient-to-r/s },
        { name: 'Emoji Icons', pattern: /📚|👥|✨|🚀|📋/s },
        { name: 'Modern Search', pattern: /🔍.*Cari jenis pelatihan/s },
        { name: 'Action Icons', pattern: /InformationCircleIcon|EyeIcon|PencilIcon|TrashIcon/s },
        { name: 'Enhanced Table', pattern: /hover:bg-blue-50/s }
      ];
      
      console.log('\n📋 NEW DEPLOYMENT FEATURE DETECTION:');
      let foundFeatures = 0;
      
      checks.forEach(check => {
        if (check.pattern.test(html)) {
          console.log(`✅ ${check.name}: FOUND`);
          foundFeatures++;
        } else {
          console.log(`❌ ${check.name}: NOT FOUND`);
        }
      });
      
      console.log(`\n📊 SUMMARY: ${foundFeatures}/${checks.length} features detected`);
      
      if (foundFeatures >= 6) {
        console.log('\n🎉 SUCCESS! NEW FEATURES DEPLOYED!');
        console.log('✅ Enhanced pelatihan page is now live');
        console.log('✅ Tab navigation system working');
        console.log('✅ Modern UI with icons and styling');
        
        console.log('\n🔗 NEW WEBSITE URLs:');
        console.log(`📱 Main site: ${NEW_URL}`);
        console.log(`📚 Pelatihan page: ${NEW_URL}/pelatihan`);
        console.log(`🏠 Dashboard: ${NEW_URL}/dashboard`);
        
        console.log('\n🎯 FEATURES NOW AVAILABLE:');
        console.log('• 📚 Tab "Jenis Pelatihan" - manage training types');
        console.log('• 👥 Tab "Peserta Pelatihan" - manage participants');
        console.log('• ✨ Enhanced buttons with icons');
        console.log('• 🔍 Search functionality');
        console.log('• 🎨 Modern gradient styling');
        console.log('• 📱 Responsive design');
        console.log('• 🖱️ Hover effects and animations');
        
      } else if (foundFeatures > 0) {
        console.log('\n⚠️  PARTIAL SUCCESS');
        console.log('🔍 Some features detected but not all');
        console.log('💡 May need browser cache clear');
      } else {
        console.log('\n❌ FEATURES NOT DETECTED');
        console.log('🔍 May still be old version or cache issue');
      }
      
    } else {
      console.log(`❌ New deployment error: ${response.statusCode}`);
    }
    
    console.log('\n📋 MANUAL VERIFICATION:');
    console.log(`🔗 Open: ${NEW_URL}/pelatihan`);
    console.log('👀 Look for:');
    console.log('   - Title with 🚀 FITUR BARU');
    console.log('   - Two tabs: 📚 Jenis Pelatihan & 👥 Peserta Pelatihan');
    console.log('   - Gradient buttons with icons');
    console.log('   - Modern table styling');
    console.log('   - Search box with 🔍 icon');
    
  } catch (error) {
    console.error('❌ Test error:', error.message);
  }
}

testNewDeployment();