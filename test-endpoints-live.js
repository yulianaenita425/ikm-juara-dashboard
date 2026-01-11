// Test API endpoints yang sedang berjalan
const testEndpoints = [
  '/api/ikm-binaan',
  '/api/sertifikat-halal', 
  '/api/tkdn-ik',
  '/api/uji-nilai-gizi',
  '/api/kurasi-produk',
  '/api/recycle-bin',
  '/api/jenis-pelatihan'
]

async function testLiveEndpoints() {
  console.log('🧪 Testing live API endpoints...\n')
  
  for (const endpoint of testEndpoints) {
    try {
      console.log(`Testing ${endpoint}...`)
      const response = await fetch(`http://localhost:3000${endpoint}`)
      
      if (response.ok) {
        const result = await response.json()
        if (result.success !== false) {
          console.log(`✅ ${endpoint} - OK (${result.data?.length || 0} records)`)
        } else {
          console.log(`⚠️ ${endpoint} - API Error: ${result.error}`)
        }
      } else {
        console.log(`❌ ${endpoint} - HTTP ${response.status}`)
      }
    } catch (error) {
      console.log(`❌ ${endpoint} - Error: ${error.message}`)
    }
  }
  
  console.log('\n🎯 Testing specific functionality...')
  
  // Test POST to jenis-pelatihan
  try {
    console.log('\nTesting POST /api/jenis-pelatihan...')
    const response = await fetch('http://localhost:3000/api/jenis-pelatihan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jenis_pelatihan: 'Test Pelatihan',
        sub_kegiatan: 'Test Sub Kegiatan',
        waktu_pelaksanaan: 'Test Waktu',
        tempat: 'Test Tempat',
        tahun_pelaksanaan: 2024
      })
    })
    
    if (response.ok) {
      const result = await response.json()
      console.log('✅ POST jenis-pelatihan - OK')
    } else {
      console.log('⚠️ POST jenis-pelatihan - May need database setup')
    }
  } catch (error) {
    console.log('⚠️ POST jenis-pelatihan - Error:', error.message)
  }
  
  console.log('\n🎉 Live endpoint testing completed!')
}

testLiveEndpoints()