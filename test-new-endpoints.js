const fetch = require('node-fetch')

async function testNewEndpoints() {
  console.log('🧪 Testing New API Endpoints...\n')
  
  const baseUrl = 'http://localhost:3001/api'
  const endpoints = [
    'tkdn-ik',
    'siinas', 
    'uji-nilai-gizi',
    'kurasi-produk'
  ]
  
  for (const endpoint of endpoints) {
    try {
      console.log(`📊 Testing ${endpoint}:`)
      const response = await fetch(`${baseUrl}/${endpoint}`)
      const data = await response.json()
      
      if (response.ok) {
        console.log(`   ✅ ${endpoint} - SUCCESS (${data.data?.length || 0} records)`)
      } else {
        console.log(`   ❌ ${endpoint} - ERROR: ${data.message}`)
      }
    } catch (error) {
      console.log(`   ❌ ${endpoint} - EXCEPTION: ${error.message}`)
    }
    console.log('')
  }
  
  // Test dashboard stats after new endpoints
  console.log('📊 Testing Dashboard Stats after new endpoints:')
  try {
    const response = await fetch(`${baseUrl}/dashboard/stats`)
    const data = await response.json()
    
    if (response.ok) {
      console.log('   ✅ Dashboard Stats - SUCCESS')
      console.log(`   🏢 Total IKM Binaan: ${data.totalIkmBinaan?.current || 0}`)
      console.log(`   ⚡ Total Layanan: ${data.layananIkmJuara?.current || 0}`)
      console.log(`   📋 Breakdown:`)
      if (data.layananIkmJuara?.breakdown) {
        console.log(`      - HKI Merek: ${data.layananIkmJuara.breakdown.hkiMerek}`)
        console.log(`      - Sertifikat Halal: ${data.layananIkmJuara.breakdown.sertifikatHalal}`)
        console.log(`      - TKDN IK: ${data.layananIkmJuara.breakdown.tkdnIk}`)
        console.log(`      - SIINas: ${data.layananIkmJuara.breakdown.siinas}`)
        console.log(`      - Uji Nilai Gizi: ${data.layananIkmJuara.breakdown.ujiNilaiGizi}`)
        console.log(`      - Kurasi Produk: ${data.layananIkmJuara.breakdown.kurasiProduk}`)
      }
    } else {
      console.log(`   ❌ Dashboard Stats - ERROR: ${data.message}`)
    }
  } catch (error) {
    console.log(`   ❌ Dashboard Stats - EXCEPTION: ${error.message}`)
  }
}

testNewEndpoints()