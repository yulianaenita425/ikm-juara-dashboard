const http = require('http');

const LOCAL_URL = 'http://localhost:3001';

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

async function testLocalFinal() {
  console.log('🎯 TESTING LOCAL DEVELOPMENT SERVER...\n');
  
  try {
    const pelatihanUrl = `${LOCAL_URL}/pelatihan`;
    
    console.log(`🔗 Testing local: ${pelatihanUrl}`);
    
    const response = await makeRequest(pelatihanUrl);
    
    if (response.statusCode === 200) {
      console.log('✅ Local server accessible');
      
      const html = response.data;
      
      // Check for enhanced features
      const checks = [
        { name: 'Enhanced Title', pattern: /🚀.*FITUR BARU.*Pelatihan/s },
        { name: 'Tab Navigation', pattern: /📚.*Jenis Pelatihan.*👥.*Peserta/s },
        { name: 'Enhanced Buttons', pattern: /✨.*Tambah.*Pelatihan/s },
        { name: 'Gradient Styling', pattern: /gradient-to-r/s },
        { name: 'Emoji Icons', pattern: /📚|👥|✨|🚀/s },
        { name: 'Modern Search', pattern: /🔍.*Cari/s },
        { name: 'React State', pattern: /activeTab|setActiveTab/s },
        { name: 'Heroicons', pattern: /PlusIcon|MagnifyingGlassIcon/s }
      ];
      
      console.log('\n📋 LOCAL FEATURE DETECTION:');
      let foundFeatures = 0;
      
      checks.forEach(check => {
        if (check.pattern.test(html)) {
          console.log(`✅ ${check.name}: FOUND`);
          foundFeatures++;
        } else {
          console.log(`❌ ${check.name}: NOT FOUND`);
        }
      });
      
      console.log(`\n📊 LOCAL SUMMARY: ${foundFeatures}/${checks.length} features detected`);
      
      if (foundFeatures >= 4) {
        console.log('\n🎉 LOCAL SUCCESS!');
        console.log('✅ Features working in development');
        console.log('🔧 Issue is with production deployment');
        
        console.log('\n🚀 DEPLOYMENT SOLUTIONS:');
        console.log('1. 🔄 Try different deployment method');
        console.log('2. 📁 Check if files are properly uploaded');
        console.log('3. 🧹 Clear all caches');
        console.log('4. 🔗 Use new domain for fresh deployment');
        
      } else {
        console.log('\n⚠️  LOCAL ISSUES DETECTED');
        console.log('🔍 Features not working even locally');
        console.log('💡 Need to debug code issues first');
      }
      
      // Show a sample of the HTML for debugging
      console.log('\n📄 HTML SAMPLE (first 500 chars):');
      console.log(html.substring(0, 500) + '...');
      
    } else {
      console.log(`❌ Local server error: ${response.statusCode}`);
    }
    
    console.log('\n📋 MANUAL LOCAL TEST:');
    console.log(`🔗 Open browser: ${LOCAL_URL}/pelatihan`);
    console.log('👀 Check if you can see:');
    console.log('   - Enhanced title with emojis');
    console.log('   - Tab navigation system');
    console.log('   - Modern styling and buttons');
    
  } catch (error) {
    console.error('❌ Local test error:', error.message);
    console.log('\n🔧 TROUBLESHOOTING:');
    console.log('1. Make sure dev server is running');
    console.log('2. Check if port 3001 is accessible');
    console.log('3. Verify no compilation errors');
  }
}

testLocalFinal();