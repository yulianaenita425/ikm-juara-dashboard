// Script untuk test count pelatihan
// Jalankan dengan: node test-pelatihan-count.js

const http = require('http');

function testPelatihanCount() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/test-supabase',
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

async function runTest() {
  console.log('🧪 Testing Pelatihan Count...\n');
  
  try {
    // Test dengan endpoint khusus untuk pelatihan
    const { supabaseAdmin } = require('./lib/supabase');
    
    if (!supabaseAdmin) {
      console.log('❌ Supabase admin client not configured');
      return;
    }

    console.log('✅ Supabase admin client configured');
    
    // Test query pelatihan
    const { count: totalPelatihan, error: pelatihanError } = await supabaseAdmin
      .from('pelatihan')
      .select('*', { count: 'exact', head: true })
      .is('deleted_at', null);

    if (pelatihanError) {
      console.log('❌ Error querying pelatihan table:', pelatihanError.message);
      console.log('💡 Possible solution: Run database-setup.sql to create pelatihan table');
    } else {
      console.log(`✅ Pelatihan count: ${totalPelatihan || 0}`);
    }
    
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

// Jalankan test
runTest();