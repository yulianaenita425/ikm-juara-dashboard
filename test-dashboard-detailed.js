// Test Dashboard Stats dengan detail lengkap
const fetch = require('node-fetch')

async function testDashboardDetailed() {
  console.log('🔍 Testing Dashboard Stats - Detailed Analysis...\n')
  
  try {
    // Test dashboard stats
    const response = await fetch('http://localhost:3001/api/dashboard/stats')
    const data = await response.json()
    
    console.log('📊 DASHBOARD STATS RESPONSE:')
    console.log(JSON.stringify(data, null, 2))
    console.log('\n')
    
    // Test individual APIs
    console.log('🔍 TESTING INDIVIDUAL APIs:')
    
    // Test IKM Binaan API
    try {
      const ikmResponse = await fetch('http://localhost:3001/api/ikm-binaan')
      const ikmData = await ikmResponse.json()
      console.log(`📋 IKM Binaan API: ${ikmData.length} records`)
      ikmData.forEach((item, index) => {
        console.log(`   ${index + 1}. ${item.nama_usaha} (${item.nama_lengkap})`)
      })
    } catch (err) {
      console.log('❌ IKM Binaan API Error:', err.message)
    }
    
    console.log('')
    
    // Test HKI Merek API
    try {
      const hkiResponse = await fetch('http://localhost:3001/api/hki-merek')
      const hkiData = await hkiResponse.json()
      console.log(`🏛️ HKI Merek API: ${hkiData.length} records`)
      hkiData.forEach((item, index) => {
        console.log(`   ${index + 1}. ${item.nomor_pendaftaran} - ${item.status_sertifikat}`)
      })
    } catch (err) {
      console.log('❌ HKI Merek API Error:', err.message)
    }
    
    console.log('')
    
    // Test Sertifikat Halal API
    try {
      const halalResponse = await fetch('http://localhost:3001/api/sertifikat-halal')
      const halalData = await halalResponse.json()
      console.log(`📜 Sertifikat Halal API: ${halalData.length} records`)
      halalData.forEach((item, index) => {
        console.log(`   ${index + 1}. ${item.nomor_sertifikat}`)
      })
    } catch (err) {
      console.log('❌ Sertifikat Halal API Error:', err.message)
    }
    
    console.log('\n')
    console.log('🎯 ANALYSIS:')
    console.log('Dashboard shows:', data.totalIkmBinaan.current, 'IKM Binaan')
    console.log('Dashboard shows:', data.layananStats?.find(l => l.name === 'HKI Merek')?.total || 0, 'HKI Merek')
    console.log('Dashboard shows:', data.layananStats?.find(l => l.name === 'Sertifikat Halal')?.total || 0, 'Sertifikat Halal')
    
  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

testDashboardDetailed()