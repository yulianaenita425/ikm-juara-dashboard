const http = require('http')

function makeRequest(path) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3001,
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
          const jsonData = JSON.parse(data)
          resolve({ status: res.statusCode, data: jsonData })
        } catch (err) {
          resolve({ status: res.statusCode, data: data })
        }
      })
    })

    req.on('error', (err) => {
      reject(err)
    })

    req.end()
  })
}

async function testMissingEndpoints() {
  console.log('🧪 Testing Missing API Endpoints...\n')
  
  const endpoints = [
    '/api/tkdn-ik',
    '/api/siinas', 
    '/api/uji-nilai-gizi',
    '/api/kurasi-produk'
  ]
  
  for (const endpoint of endpoints) {
    try {
      console.log(`📊 Testing ${endpoint}:`)
      const result = await makeRequest(endpoint)
      
      if (result.status === 200) {
        const count = result.data?.data?.length || 0
        console.log(`   ✅ ${endpoint} - SUCCESS (${count} records)`)
      } else {
        console.log(`   ❌ ${endpoint} - ERROR (${result.status}): ${result.data?.message || 'Unknown error'}`)
      }
    } catch (error) {
      console.log(`   ❌ ${endpoint} - EXCEPTION: ${error.message}`)
    }
    console.log('')
  }
  
  // Test dashboard stats
  console.log('📊 Testing Dashboard Stats:')
  try {
    const result = await makeRequest('/api/dashboard/stats')
    
    if (result.status === 200) {
      console.log('   ✅ Dashboard Stats - SUCCESS')
      console.log(`   🏢 Total IKM Binaan: ${result.data.totalIkmBinaan?.current || 0}`)
      console.log(`   ⚡ Total Layanan: ${result.data.layananIkmJuara?.current || 0}`)
      console.log(`   📋 Breakdown:`)
      if (result.data.layananIkmJuara?.breakdown) {
        const breakdown = result.data.layananIkmJuara.breakdown
        console.log(`      - HKI Merek: ${breakdown.hkiMerek}`)
        console.log(`      - Sertifikat Halal: ${breakdown.sertifikatHalal}`)
        console.log(`      - TKDN IK: ${breakdown.tkdnIk}`)
        console.log(`      - SIINas: ${breakdown.siinas}`)
        console.log(`      - Uji Nilai Gizi: ${breakdown.ujiNilaiGizi}`)
        console.log(`      - Kurasi Produk: ${breakdown.kurasiProduk}`)
      }
    } else {
      console.log(`   ❌ Dashboard Stats - ERROR (${result.status}): ${result.data?.message || 'Unknown error'}`)
    }
  } catch (error) {
    console.log(`   ❌ Dashboard Stats - EXCEPTION: ${error.message}`)
  }
}

testMissingEndpoints()