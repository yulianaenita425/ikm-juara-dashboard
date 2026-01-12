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
          data: data,
          headers: res.headers
        });
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

async function testCacheBuster() {
  console.log('🎯 TESTING CACHE BUSTER...\n');
  
  try {
    // Add timestamp to bust cache
    const timestamp = Date.now();
    const pelatihanUrl = `${BASE_URL}/pelatihan?v=${timestamp}`;
    
    console.log(`🔗 Testing URL: ${pelatihanUrl}`);
    
    const response = await makeRequest(pelatihanUrl);
    
    if (response.statusCode === 200) {
      console.log('✅ Page accessible');
      
      const html = response.data;
      
      // Check for specific new features
      const checks = [
        { name: 'Tab Navigation', pattern: /Jenis Pelatihan.*Peserta Pelatihan/s },
        { name: 'Tab Buttons', pattern: /onClick.*setActiveTab/s },
        { name: 'Plus Icon', pattern: /PlusIcon/s },
        { name: 'Search Icon', pattern: /MagnifyingGlassIcon/s },
        { name: 'Action Icons', pattern: /InformationCircleIcon|EyeIcon|PencilIcon|TrashIcon/s },
        { name: 'Tab Content Conditional', pattern: /activeTab === 'jenis'/s },
        { name: 'Tambah Jenis Button', pattern: /Tambah Jenis Pelatihan/s },
        { name: 'Tambah Peserta Button', pattern: /Tambah Peserta Pelatihan/s }
      ];
      
      console.log('\n📋 FEATURE DETECTION:');
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
      
      if (foundFeatures === 0) {
        console.log('\n⚠️  NO NEW FEATURES DETECTED!');
        console.log('🔍 Possible issues:');
        console.log('   - Browser cache not cleared');
        console.log('   - Deployment not updated');
        console.log('   - JavaScript not executing');
        console.log('   - File not properly uploaded');
        
        // Check if it's the old version
        if (html.includes('Kelola jenis pelatihan dan peserta pelatihan untuk IKM Binaan')) {
          console.log('\n🎯 DETECTED: Old version still cached');
          console.log('💡 SOLUTION: Clear browser cache or try incognito mode');
        }
      } else if (foundFeatures < checks.length) {
        console.log('\n⚠️  PARTIAL FEATURES DETECTED');
        console.log('🔍 Some features may not be rendering properly');
      } else {
        console.log('\n🎉 ALL FEATURES DETECTED!');
        console.log('✅ New version successfully deployed');
      }
      
      // Check deployment timestamp
      const deploymentId = response.headers['x-vercel-id'];
      if (deploymentId) {
        console.log(`\n🚀 Deployment ID: ${deploymentId}`);
      }
      
    } else {
      console.log(`❌ Page error: ${response.statusCode}`);
    }
    
    console.log('\n📋 MANUAL STEPS TO VERIFY:');
    console.log('1. 🔄 Hard refresh browser (Ctrl+F5 or Cmd+Shift+R)');
    console.log('2. 🕵️ Try incognito/private browsing mode');
    console.log('3. 🧹 Clear browser cache completely');
    console.log('4. 📱 Try different browser or device');
    console.log(`5. 🔗 Direct link: ${BASE_URL}/pelatihan`);
    
  } catch (error) {
    console.error('❌ Test error:', error.message);
  }
}

testCacheBuster();