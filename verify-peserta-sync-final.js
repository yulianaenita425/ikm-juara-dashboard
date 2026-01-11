// Script verifikasi final sinkronisasi peserta pelatihan
const { createClient } = require('@supabase/supabase-js')

// Baca environment variables dari .env.local
const fs = require('fs')
const path = require('path')

function loadEnvFile() {
  try {
    const envPath = path.join(__dirname, '.env.local')
    const envContent = fs.readFileSync(envPath, 'utf8')
    const envVars = {}
    
    envContent.split('\n').forEach(line => {
      const [key, value] = line.split('=')
      if (key && value) {
        envVars[key.trim()] = value.trim().replace(/^["']|["']$/g, '')
      }
    })
    
    return envVars
  } catch (error) {
    console.error('Error reading .env.local:', error.message)
    return {}
  }
}

const envVars = loadEnvFile()
const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = envVars.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Environment variables tidak lengkap')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function verifyFinalPesertaSync() {
  console.log('🏁 VERIFIKASI FINAL SINKRONISASI PESERTA PELATIHAN')
  console.log('=' .repeat(70))
  console.log('Tanggal:', new Date().toLocaleString('id-ID'))
  console.log('=' .repeat(70))

  try {
    const results = {
      database: false,
      apiJenis: false,
      apiPelatihan: false,
      sinkronisasi: false,
      frontend: false
    }

    // 1. Test Database Connection
    console.log('\n📊 1. TESTING DATABASE CONNECTION...')
    
    const { data: dbTest, error: dbError } = await supabase
      .from('jenis_pelatihan')
      .select('count', { count: 'exact' })
      .is('deleted_at', null)

    if (dbError) {
      console.log('❌ Database connection failed:', dbError.message)
    } else {
      console.log('✅ Database connection: OK')
      console.log(`   Jenis pelatihan: ${dbTest.count} records`)
      results.database = true
    }

    // 2. Test API Jenis Pelatihan
    console.log('\n🌐 2. TESTING API JENIS PELATIHAN...')
    
    try {
      const jenisResponse = await fetch('http://localhost:3000/api/jenis-pelatihan')
      const jenisResult = await jenisResponse.json()
      
      if (jenisResult.success) {
        console.log('✅ API jenis-pelatihan: OK')
        console.log(`   Data returned: ${jenisResult.data.length} records`)
        
        // Verifikasi field jumlah_peserta ada
        const hasJumlahPeserta = jenisResult.data.every(jenis => 
          jenis.hasOwnProperty('jumlah_peserta')
        )
        
        if (hasJumlahPeserta) {
          console.log('✅ Field jumlah_peserta: Present in all records')
          results.apiJenis = true
        } else {
          console.log('❌ Field jumlah_peserta: Missing in some records')
        }
      } else {
        console.log('❌ API jenis-pelatihan error:', jenisResult.error)
      }
    } catch (apiError) {
      console.log('❌ API jenis-pelatihan failed:', apiError.message)
    }

    // 3. Test API Pelatihan
    console.log('\n🌐 3. TESTING API PELATIHAN...')
    
    try {
      const pelatihanResponse = await fetch('http://localhost:3000/api/pelatihan')
      const pelatihanResult = await pelatihanResponse.json()
      
      if (pelatihanResult.success) {
        console.log('✅ API pelatihan: OK')
        console.log(`   Data returned: ${pelatihanResult.data.length} records`)
        results.apiPelatihan = true
      } else {
        console.log('❌ API pelatihan error:', pelatihanResult.error)
      }
    } catch (apiError) {
      console.log('❌ API pelatihan failed:', apiError.message)
    }

    // 4. Test Sinkronisasi Data
    console.log('\n🔄 4. TESTING SINKRONISASI DATA...')
    
    if (results.database && results.apiJenis && results.apiPelatihan) {
      // Ambil data dari database
      const { data: jenisDB } = await supabase
        .from('jenis_pelatihan')
        .select('*')
        .is('deleted_at', null)

      const { data: pelatihanDB } = await supabase
        .from('pelatihan')
        .select('*')
        .is('deleted_at', null)

      // Ambil data dari API
      const jenisAPI = await fetch('http://localhost:3000/api/jenis-pelatihan')
        .then(res => res.json())

      let allSynced = true
      
      console.log('   Verifying sync for each jenis pelatihan:')
      
      for (const jenis of jenisDB) {
        const actualCount = pelatihanDB.filter(p => p.jenis_pelatihan_id === jenis.id).length
        const apiJenis = jenisAPI.data.find(j => j.id === jenis.id)
        const apiCount = apiJenis ? apiJenis.jumlah_peserta : 0
        
        const synced = actualCount === apiCount
        if (!synced) allSynced = false
        
        console.log(`   - ${jenis.jenis_pelatihan.padEnd(30)}: DB=${actualCount}, API=${apiCount} ${synced ? '✅' : '❌'}`)
      }
      
      if (allSynced) {
        console.log('✅ Sinkronisasi data: Perfect')
        results.sinkronisasi = true
      } else {
        console.log('❌ Sinkronisasi data: Issues found')
      }
    } else {
      console.log('⚠️  Cannot test sync - prerequisite tests failed')
    }

    // 5. Test Frontend Code
    console.log('\n💻 5. TESTING FRONTEND CODE...')
    
    try {
      const frontendCode = fs.readFileSync('pages/pelatihan.js', 'utf8')
      
      // Check if frontend uses jenis.jumlah_peserta
      const usesApiData = frontendCode.includes('jenis.jumlah_peserta')
      const hasLoadData = frontendCode.includes('await loadData()') || frontendCode.includes('loadData()')
      
      if (usesApiData && hasLoadData) {
        console.log('✅ Frontend code: Uses API data correctly')
        console.log('✅ Frontend code: Calls loadData() after operations')
        results.frontend = true
      } else {
        console.log('❌ Frontend code: Issues found')
        if (!usesApiData) console.log('   - Not using jenis.jumlah_peserta')
        if (!hasLoadData) console.log('   - Not calling loadData()')
      }
    } catch (fileError) {
      console.log('❌ Frontend code: Cannot read file')
    }

    // 6. Overall Results
    console.log('\n🎯 HASIL VERIFIKASI FINAL:')
    console.log('=' .repeat(70))
    
    const allPassed = Object.values(results).every(result => result === true)
    
    console.log(`Database Connection    : ${results.database ? '✅ PASS' : '❌ FAIL'}`)
    console.log(`API Jenis Pelatihan    : ${results.apiJenis ? '✅ PASS' : '❌ FAIL'}`)
    console.log(`API Pelatihan          : ${results.apiPelatihan ? '✅ PASS' : '❌ FAIL'}`)
    console.log(`Data Synchronization   : ${results.sinkronisasi ? '✅ PASS' : '❌ FAIL'}`)
    console.log(`Frontend Implementation: ${results.frontend ? '✅ PASS' : '❌ FAIL'}`)
    
    console.log('=' .repeat(70))
    
    if (allPassed) {
      console.log('🎉 SEMUA TEST BERHASIL!')
      console.log('✅ Sinkronisasi peserta pelatihan berfungsi sempurna')
      console.log('✅ Masalah telah diperbaiki sepenuhnya')
      console.log('✅ Sistem siap untuk production')
    } else {
      console.log('⚠️  ADA BEBERAPA MASALAH YANG PERLU DIPERBAIKI')
      const failedTests = Object.entries(results)
        .filter(([key, value]) => !value)
        .map(([key]) => key)
      console.log('❌ Failed tests:', failedTests.join(', '))
    }

    // 7. Recommendations
    console.log('\n💡 REKOMENDASI:')
    console.log('=' .repeat(70))
    
    if (allPassed) {
      console.log('✅ Tidak ada rekomendasi - semua berfungsi dengan baik')
      console.log('🚀 Lanjutkan dengan deployment ke production')
      console.log('📝 Update dokumentasi jika diperlukan')
    } else {
      console.log('🔧 Perbaiki test yang gagal sebelum deployment')
      console.log('🧪 Jalankan ulang verifikasi setelah perbaikan')
      console.log('📞 Hubungi tim development jika masalah persisten')
    }

    // 8. Generate Report
    const reportData = {
      timestamp: new Date().toISOString(),
      results: results,
      allPassed: allPassed,
      summary: allPassed ? 'ALL TESTS PASSED' : 'SOME TESTS FAILED'
    }

    fs.writeFileSync('peserta-sync-verification-report.json', JSON.stringify(reportData, null, 2))
    console.log('\n📄 Report saved: peserta-sync-verification-report.json')

    return {
      success: true,
      allPassed: allPassed,
      results: results
    }

  } catch (error) {
    console.error('❌ Verification error:', error.message)
    return {
      success: false,
      error: error.message
    }
  }
}

// Jalankan verifikasi
if (require.main === module) {
  verifyFinalPesertaSync()
    .then(result => {
      if (result.success) {
        if (result.allPassed) {
          console.log('\n🏆 VERIFIKASI FINAL BERHASIL!')
          process.exit(0)
        } else {
          console.log('\n⚠️  VERIFIKASI SELESAI DENGAN BEBERAPA MASALAH')
          process.exit(1)
        }
      } else {
        console.log('\n💥 VERIFIKASI GAGAL!')
        process.exit(1)
      }
    })
    .catch(error => {
      console.error('💥 Unexpected error:', error)
      process.exit(1)
    })
}

module.exports = { verifyFinalPesertaSync }