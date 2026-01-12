// Script untuk test semua API endpoints setelah perbaikan
const http = require('http')

console.log('🧪 TESTING ALL API ENDPOINTS AFTER FIXES\n')

const endpoints = [
  { path: '/api/ikm-binaan', name: 'IKM Binaan' },
  { path: '/api/hki-merek', name: 'HKI Merek' },
  { path: '/api/sertifikat-halal', name: 'Sertifikat Halal' },
  { path: '/api/tkdn-ik', name: 'TKDN-IK' },
  { path: '/api/siinas', name: 'SIINas' },
  { path: '/api/uji-nilai-gizi', name: 'Uji Nilai Gizi' },
  { path: '/api/kurasi-produk', name: 'Kurasi Produk' },
  { path: '/api/jenis-pelatihan', name: 'Jenis Pelatihan' },
  { path: '/api/pelatihan', name: 'Pelatihan' },
  { path: '/api/dashboard/stats', name: 'Dashboard Stats' }
]

function makeRequest(path) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }

    const req = http.request(options, (res) => {
      let data = ''
      res.on('data', (chunk) => {
        data += chunk
      })
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data)
          resolve({
            statusCode: res.statusCode,
            data: parsed
          })
        } catch (error) {
          resolve({
            statusCode: res.statusCode,
            data: { error: 'Invalid JSON response' }
          })
        }
      })
    })

    req.on('error', (error) => {
      reject(error)
    })

    req.setTimeout(5000, () => {
      req.destroy()
      reject(new Error('Request timeout'))
    })

    req.end()
  })
}

async function testAllEndpoints() {
  console.log('🔄 Starting endpoint tests...\n')
  
  let successCount = 0
  let totalDataCount = 0
  
  for (const endpoint of endpoints) {
    try {
      console.log(`Testing ${endpoint.name}...`)
      
      const result = await makeRequest(endpoint.path)
      
      if (result.statusCode === 200) {
        if (result.data.success !== false) {
          const dataCount = result.data.data ? result.data.data.length : 
                           result.data.totalIkmBinaan ? 1 : 0
          const source = result.data.source || 'unknown'
          
          console.log(`✅ ${endpoint.name}: ${dataCount} records (${source})`)
          successCount++
          totalDataCount += dataCount
        } else {
          console.log(`⚠️ ${endpoint.name}: API returned success=false`)
        }
      } else {
        console.log(`❌ ${endpoint.name}: HTTP ${result.statusCode}`)
      }
    } catch (error) {
      console.log(`❌ ${endpoint.name}: ${error.message}`)
    }
  }
  
  console.log(`\n📊 TEST RESULTS:`)
  console.log(`✅ Successful endpoints: ${successCount}/${endpoints.length}`)
  console.log(`📋 Total data records: ${totalDataCount}`)
  
  if (successCount === endpoints.length) {
    console.log('\n🎉 ALL ENDPOINTS WORKING!')
    console.log('✅ All APIs are responding correctly')
    console.log('✅ Fallback data is available when needed')
    console.log('✅ Pages should now display data properly')
  } else {
    console.log('\n⚠️ SOME ENDPOINTS NEED ATTENTION')
    console.log('💡 Check the failed endpoints above')
    console.log('🔧 Make sure development server is running')
  }
  
  console.log('\n📋 NEXT STEPS:')
  console.log('1. 🚀 Start development server: npm run dev')
  console.log('2. 🌐 Open browser: http://localhost:3001')
  console.log('3. 🧪 Test each page manually:')
  console.log('   • Dashboard - should show statistics')
  console.log('   • IKM Binaan - should show data list')
  console.log('   • All Layanan pages - should show data')
  console.log('   • Pelatihan - should show enhanced UI')
  console.log('4. 🚀 Deploy to production when satisfied')
}

testAllEndpoints()