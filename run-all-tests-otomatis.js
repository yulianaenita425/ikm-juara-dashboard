// Script untuk menjalankan semua test otomatis sinkronisasi peserta pelatihan
const { spawn } = require('child_process')

async function runCommand(command, description) {
  return new Promise((resolve, reject) => {
    console.log(`\n🚀 ${description}`)
    console.log(`📝 Command: ${command}`)
    console.log('-' .repeat(60))

    const child = spawn('node', [command], { 
      stdio: 'inherit',
      shell: true 
    })

    child.on('close', (code) => {
      if (code === 0) {
        console.log(`✅ ${description} - BERHASIL`)
        resolve(true)
      } else {
        console.log(`❌ ${description} - GAGAL (exit code: ${code})`)
        resolve(false)
      }
    })

    child.on('error', (error) => {
      console.error(`💥 Error running ${command}:`, error.message)
      resolve(false)
    })
  })
}

async function runAllTestsOtomatis() {
  console.log('🎯 MENJALANKAN SEMUA TEST OTOMATIS SINKRONISASI PESERTA PELATIHAN')
  console.log('=' .repeat(80))
  console.log('🕐 Waktu mulai:', new Date().toLocaleString('id-ID'))
  console.log('🎪 Server development sudah berjalan di http://localhost:3000')
  console.log('=' .repeat(80))

  const tests = [
    {
      command: 'fix-peserta-sync-issue.js',
      description: 'ANALISIS DATABASE & PERBAIKAN KONSISTENSI'
    },
    {
      command: 'test-peserta-sync-fix.js', 
      description: 'TEST PERBAIKAN & VERIFIKASI API'
    },
    {
      command: 'test-peserta-sync-complete.js',
      description: 'TEST KOMPREHENSIF SEMUA KOMPONEN'
    },
    {
      command: 'test-peserta-sync-automated.js',
      description: 'TEST OTOMATIS END-TO-END DENGAN SIMULASI'
    },
    {
      command: 'demo-sinkronisasi-otomatis.js',
      description: 'DEMO INTERAKTIF SINKRONISASI REAL-TIME'
    },
    {
      command: 'verify-peserta-sync-final.js',
      description: 'VERIFIKASI FINAL SEMUA KOMPONEN'
    }
  ]

  const results = []
  let allPassed = true

  for (let i = 0; i < tests.length; i++) {
    const test = tests[i]
    console.log(`\n📊 TEST ${i + 1}/${tests.length}`)
    
    const success = await runCommand(test.command, test.description)
    results.push({
      name: test.description,
      command: test.command,
      success: success
    })

    if (!success) {
      allPassed = false
    }

    // Jeda sebentar antar test
    if (i < tests.length - 1) {
      console.log('\n⏳ Menunggu 2 detik sebelum test berikutnya...')
      await new Promise(resolve => setTimeout(resolve, 2000))
    }
  }

  // Tampilkan ringkasan hasil
  console.log('\n🎯 RINGKASAN HASIL SEMUA TEST')
  console.log('=' .repeat(80))
  console.log('🕐 Waktu selesai:', new Date().toLocaleString('id-ID'))
  console.log('=' .repeat(80))

  results.forEach((result, index) => {
    const status = result.success ? '✅ PASS' : '❌ FAIL'
    console.log(`${(index + 1).toString().padStart(2)}. ${result.name.padEnd(50)} : ${status}`)
  })

  console.log('=' .repeat(80))

  if (allPassed) {
    console.log('🏆 SEMUA TEST BERHASIL!')
    console.log('✅ Sinkronisasi peserta pelatihan berfungsi sempurna')
    console.log('✅ Masalah telah diperbaiki 100%')
    console.log('✅ Sistem siap untuk production')
    console.log('🚀 Deployment dapat dilanjutkan')
  } else {
    console.log('⚠️  BEBERAPA TEST GAGAL!')
    const failedTests = results.filter(r => !r.success)
    console.log(`❌ ${failedTests.length} dari ${results.length} test gagal:`)
    failedTests.forEach(test => {
      console.log(`   - ${test.name}`)
    })
    console.log('🔧 Perbaiki masalah sebelum deployment')
  }

  // Generate laporan
  const report = {
    timestamp: new Date().toISOString(),
    totalTests: results.length,
    passedTests: results.filter(r => r.success).length,
    failedTests: results.filter(r => !r.success).length,
    allPassed: allPassed,
    results: results,
    summary: allPassed ? 'ALL TESTS PASSED - READY FOR PRODUCTION' : 'SOME TESTS FAILED - NEEDS ATTENTION'
  }

  require('fs').writeFileSync('all-tests-report.json', JSON.stringify(report, null, 2))
  console.log('\n📄 Laporan lengkap disimpan: all-tests-report.json')

  // Rekomendasi
  console.log('\n💡 REKOMENDASI:')
  console.log('=' .repeat(80))
  
  if (allPassed) {
    console.log('🎉 Tidak ada rekomendasi - semua berfungsi sempurna!')
    console.log('📱 Test manual: http://localhost:3000/pelatihan')
    console.log('🚀 Lanjutkan dengan deployment ke production')
    console.log('📚 Update dokumentasi jika diperlukan')
  } else {
    console.log('🔧 Perbaiki test yang gagal')
    console.log('🧪 Jalankan ulang test setelah perbaikan')
    console.log('📞 Konsultasi dengan tim development jika perlu')
  }

  return {
    success: allPassed,
    totalTests: results.length,
    passedTests: results.filter(r => r.success).length,
    results: results
  }
}

// Jalankan semua test
if (require.main === module) {
  runAllTestsOtomatis()
    .then(result => {
      if (result.success) {
        console.log('\n🎊 SEMUA TEST OTOMATIS BERHASIL!')
        console.log(`🏆 ${result.passedTests}/${result.totalTests} test berhasil`)
        process.exit(0)
      } else {
        console.log('\n⚠️  ADA TEST YANG GAGAL!')
        console.log(`📊 ${result.passedTests}/${result.totalTests} test berhasil`)
        process.exit(1)
      }
    })
    .catch(error => {
      console.error('💥 Unexpected error:', error)
      process.exit(1)
    })
}

module.exports = { runAllTestsOtomatis }