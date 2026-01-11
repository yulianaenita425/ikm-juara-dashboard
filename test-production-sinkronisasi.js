// Script untuk test sinkronisasi peserta pelatihan di production
async function testProductionSinkronisasi() {
  console.log('🌐 TESTING SINKRONISASI PESERTA PELATIHAN DI PRODUCTION')
  console.log('=' .repeat(80))
  console.log('🎯 Target: https://ikm-juara-dashboard.vercel.app')
  console.log('🕐 Waktu:', new Date().toLocaleString('id-ID'))
  console.log('=' .repeat(80))

  const productionUrl = 'https://ikm-juara-dashboard.vercel.app'
  const testResults = []

  try {
    // 1. Test homepage
    console.log('\n🏠 LANGKAH 1: TESTING HOMEPAGE')
    console.log('-' .repeat(60))

    try {
      const homeResponse = await fetch(productionUrl)
      const homeSuccess = homeResponse.ok
      
      console.log(`🌐 Homepage (${productionUrl}): ${homeSuccess ? '✅ OK' : '❌ FAILED'}`)
      console.log(`   Status: ${homeResponse.status} ${homeResponse.statusText}`)
      
      testResults.push({ test: 'Homepage', success: homeSuccess, status: homeResponse.status })
    } catch (error) {
      console.log('❌ Homepage test failed:', error.message)
      testResults.push({ test: 'Homepage', success: false, error: error.message })
    }

    // 2. Test API jenis-pelatihan
    console.log('\n📊 LANGKAH 2: TESTING API JENIS PELATIHAN')
    console.log('-' .repeat(60))

    try {
      const apiUrl = `${productionUrl}/api/jenis-pelatihan`
      const apiResponse = await fetch(apiUrl)
      const apiSuccess = apiResponse.ok
      
      console.log(`🔗 API Jenis Pelatihan: ${apiSuccess ? '✅ OK' : '❌ FAILED'}`)
      console.log(`   Status: ${apiResponse.status} ${apiResponse.statusText}`)
      
      if (apiSuccess) {
        const apiData = await apiResponse.json()
        console.log(`   Success: ${apiData.success}`)
        console.log(`   Data count: ${apiData.data ? apiData.data.length : 0}`)
        
        // Check if jumlah_peserta field exists
        if (apiData.data && apiData.data.length > 0) {
          const hasJumlahPeserta = apiData.data.every(jenis => 
            jenis.hasOwnProperty('jumlah_peserta')
          )
          console.log(`   Field jumlah_peserta: ${hasJumlahPeserta ? '✅ Present' : '❌ Missing'}`)
          
          // Show sample data
          console.log('\n   📋 Sample data:')
          apiData.data.slice(0, 3).forEach((jenis, index) => {
            console.log(`   ${index + 1}. ${jenis.jenis_pelatihan}: ${jenis.jumlah_peserta || 0} peserta`)
          })
        }
      }
      
      testResults.push({ test: 'API Jenis Pelatihan', success: apiSuccess, status: apiResponse.status })
    } catch (error) {
      console.log('❌ API Jenis Pelatihan test failed:', error.message)
      testResults.push({ test: 'API Jenis Pelatihan', success: false, error: error.message })
    }

    // 3. Test API pelatihan
    console.log('\n📊 LANGKAH 3: TESTING API PELATIHAN')
    console.log('-' .repeat(60))

    try {
      const pelatihanApiUrl = `${productionUrl}/api/pelatihan`
      const pelatihanResponse = await fetch(pelatihanApiUrl)
      const pelatihanSuccess = pelatihanResponse.ok
      
      console.log(`🔗 API Pelatihan: ${pelatihanSuccess ? '✅ OK' : '❌ FAILED'}`)
      console.log(`   Status: ${pelatihanResponse.status} ${pelatihanResponse.statusText}`)
      
      if (pelatihanSuccess) {
        const pelatihanData = await pelatihanResponse.json()
        console.log(`   Success: ${pelatihanData.success}`)
        console.log(`   Data count: ${pelatihanData.data ? pelatihanData.data.length : 0}`)
      }
      
      testResults.push({ test: 'API Pelatihan', success: pelatihanSuccess, status: pelatihanResponse.status })
    } catch (error) {
      console.log('❌ API Pelatihan test failed:', error.message)
      testResults.push({ test: 'API Pelatihan', success: false, error: error.message })
    }

    // 4. Test pelatihan page
    console.log('\n📱 LANGKAH 4: TESTING PELATIHAN PAGE')
    console.log('-' .repeat(60))

    try {
      const pelatihanPageUrl = `${productionUrl}/pelatihan`
      const pageResponse = await fetch(pelatihanPageUrl)
      const pageSuccess = pageResponse.ok
      
      console.log(`🔗 Pelatihan Page: ${pageSuccess ? '✅ OK' : '❌ FAILED'}`)
      console.log(`   Status: ${pageResponse.status} ${pageResponse.statusText}`)
      
      testResults.push({ test: 'Pelatihan Page', success: pageSuccess, status: pageResponse.status })
    } catch (error) {
      console.log('❌ Pelatihan Page test failed:', error.message)
      testResults.push({ test: 'Pelatihan Page', success: false, error: error.message })
    }

    // 5. Results summary
    console.log('\n🎯 HASIL TEST PRODUCTION')
    console.log('=' .repeat(80))

    const successfulTests = testResults.filter(t => t.success).length
    const totalTests = testResults.length
    const allPassed = successfulTests === totalTests

    testResults.forEach((result, index) => {
      const status = result.success ? '✅ PASS' : '❌ FAIL'
      const details = result.status ? `(${result.status})` : ''
      console.log(`${(index + 1).toString().padStart(2)}. ${result.test.padEnd(20)} : ${status} ${details}`)
    })

    console.log('=' .repeat(80))
    console.log(`📊 Summary: ${successfulTests}/${totalTests} tests passed`)

    if (allPassed) {
      console.log('🎉 SEMUA TEST PRODUCTION BERHASIL!')
      console.log('✅ Sinkronisasi peserta pelatihan sudah live')
      console.log('✅ API endpoints berfungsi dengan baik')
      console.log('✅ Website dapat diakses normal')
      
      console.log('\n🧪 MANUAL TESTING GUIDE:')
      console.log(`1. 🌐 Buka: ${productionUrl}/pelatihan`)
      console.log('2. 🔐 Login sebagai admin')
      console.log('3. 📊 Tab "Jenis Pelatihan" - lihat jumlah peserta')
      console.log('4. ➕ Tab "Peserta Pelatihan" - tambah peserta baru')
      console.log('5. 🔄 Kembali ke "Jenis Pelatihan" - jumlah harus bertambah!')
      console.log('6. ✅ Verifikasi sinkronisasi real-time berfungsi')
      
    } else {
      console.log('⚠️  BEBERAPA TEST PRODUCTION GAGAL!')
      const failedTests = testResults.filter(t => !t.success)
      console.log(`❌ ${failedTests.length} test gagal:`)
      failedTests.forEach(test => {
        console.log(`   - ${test.test}: ${test.error || 'HTTP error'}`)
      })
      
      console.log('\n🔧 TROUBLESHOOTING:')
      console.log('1. ⏳ Tunggu beberapa menit untuk propagasi deployment')
      console.log('2. 🔑 Periksa environment variables di Vercel dashboard')
      console.log('3. 📊 Monitor Vercel function logs untuk error details')
      console.log('4. 🌐 Test manual di browser untuk konfirmasi')
    }

    // 6. Generate report
    const productionTestReport = {
      timestamp: new Date().toISOString(),
      productionUrl: productionUrl,
      totalTests: totalTests,
      successfulTests: successfulTests,
      allPassed: allPassed,
      testResults: testResults,
      summary: allPassed ? 'ALL PRODUCTION TESTS PASSED' : 'SOME PRODUCTION TESTS FAILED'
    }

    require('fs').writeFileSync('production-test-report.json', JSON.stringify(productionTestReport, null, 2))
    console.log('\n📄 Production test report saved: production-test-report.json')

    return {
      success: allPassed,
      totalTests: totalTests,
      successfulTests: successfulTests,
      results: testResults
    }

  } catch (error) {
    console.error('💥 Production test error:', error.message)
    return {
      success: false,
      error: error.message
    }
  }
}

// Jalankan test
if (require.main === module) {
  testProductionSinkronisasi()
    .then(result => {
      if (result.success) {
        console.log('\n🎊 PRODUCTION TEST BERHASIL!')
        console.log('🚀 Sinkronisasi peserta pelatihan sudah live di production!')
        process.exit(0)
      } else {
        console.log('\n⚠️  PRODUCTION TEST ADA MASALAH!')
        console.log('🔧 Check logs and manual test in browser')
        process.exit(1)
      }
    })
    .catch(error => {
      console.error('💥 Unexpected error:', error)
      process.exit(1)
    })
}

module.exports = { testProductionSinkronisasi }