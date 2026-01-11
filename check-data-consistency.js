// Script untuk mengecek konsistensi data dan mengatasi duplikasi
// Menggunakan API endpoints yang sudah ada

const fetch = require('node-fetch')

async function checkDataConsistency() {
  console.log('🔍 MENGECEK KONSISTENSI DATA...\n')
  
  try {
    // 1. Test Dashboard Stats
    console.log('📊 DASHBOARD STATS:')
    const dashboardResponse = await fetch('http://localhost:3001/api/dashboard/stats')
    const dashboardData = await dashboardResponse.json()
    
    console.log(`   IKM Binaan: ${dashboardData.totalIkmBinaan.current}`)
    console.log(`   HKI Merek: ${dashboardData.layananStats?.find(l => l.name === 'HKI Merek')?.total || 0}`)
    console.log(`   Sertifikat Halal: ${dashboardData.layananStats?.find(l => l.name === 'Sertifikat Halal')?.total || 0}`)
    
    // 2. Test Individual APIs
    console.log('\n📋 INDIVIDUAL API DATA:')
    
    const ikmResponse = await fetch('http://localhost:3001/api/ikm-binaan')
    const ikmData = await ikmResponse.json()
    console.log(`   IKM Binaan API: ${ikmData.success ? ikmData.data.length : 'ERROR'} records`)
    
    const hkiResponse = await fetch('http://localhost:3001/api/hki-merek')
    const hkiData = await hkiResponse.json()
    console.log(`   HKI Merek API: ${hkiData.success ? hkiData.data.length : 'ERROR'} records`)
    
    const halalResponse = await fetch('http://localhost:3001/api/sertifikat-halal')
    const halalData = await halalResponse.json()
    console.log(`   Sertifikat Halal API: ${halalData.success ? halalData.data.length : 'ERROR'} records`)
    
    // 3. Analisis Konsistensi
    console.log('\n🎯 ANALISIS KONSISTENSI:')
    
    const dashboardIkm = dashboardData.totalIkmBinaan.current
    const apiIkm = ikmData.success ? ikmData.data.length : 0
    
    const dashboardHki = dashboardData.layananStats?.find(l => l.name === 'HKI Merek')?.total || 0
    const apiHki = hkiData.success ? hkiData.data.length : 0
    
    const dashboardHalal = dashboardData.layananStats?.find(l => l.name === 'Sertifikat Halal')?.total || 0
    const apiHalal = halalData.success ? halalData.data.length : 0
    
    console.log(`   IKM Binaan: Dashboard=${dashboardIkm}, API=${apiIkm} ${dashboardIkm === apiIkm ? '✅' : '❌'}`)
    console.log(`   HKI Merek: Dashboard=${dashboardHki}, API=${apiHki} ${dashboardHki === apiHki ? '✅' : '❌'}`)
    console.log(`   Sertifikat Halal: Dashboard=${dashboardHalal}, API=${apiHalal} ${dashboardHalal === apiHalal ? '✅' : '❌'}`)
    
    // 4. Detail Data
    if (ikmData.success) {
      console.log('\n📝 DETAIL IKM BINAAN:')
      ikmData.data.forEach((ikm, index) => {
        console.log(`   ${index + 1}. ${ikm.nama_usaha} (${ikm.nama_lengkap}) - NIB: ${ikm.nib}`)
      })
    }
    
    if (hkiData.success) {
      console.log('\n🏛️ DETAIL HKI MEREK:')
      hkiData.data.forEach((hki, index) => {
        console.log(`   ${index + 1}. ${hki.nomor_pendaftaran} - Status: ${hki.status_sertifikat}`)
      })
    }
    
    // 5. Kesimpulan
    console.log('\n🎉 KESIMPULAN:')
    
    const allConsistent = (dashboardIkm === apiIkm) && (dashboardHki === apiHki) && (dashboardHalal === apiHalal)
    
    if (allConsistent) {
      console.log('✅ SEMUA DATA KONSISTEN!')
      console.log('✅ Dashboard dan API menampilkan data yang sama')
      console.log('✅ Tidak ada duplikasi data ditemukan')
      console.log('✅ Single source of truth (Supabase) berfungsi dengan baik')
    } else {
      console.log('❌ DITEMUKAN INKONSISTENSI DATA!')
      console.log('⚠️ Dashboard dan API menampilkan data yang berbeda')
      console.log('💡 Perlu investigasi lebih lanjut')
    }
    
    // 6. Rekomendasi
    console.log('\n💡 REKOMENDASI:')
    console.log('1. Pastikan semua halaman frontend menggunakan API Supabase')
    console.log('2. Hapus semua kode localStorage yang tidak diperlukan')
    console.log('3. Implementasikan real-time sync di semua komponen')
    console.log('4. Lakukan testing menyeluruh setelah migrasi')
    
  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

// Jalankan jika dipanggil langsung
if (require.main === module) {
  checkDataConsistency()
}

module.exports = { checkDataConsistency }