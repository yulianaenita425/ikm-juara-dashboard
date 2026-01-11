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
  console.log('NEXT_PUBLIC_SUPABASE_URL:', !!supabaseUrl)
  console.log('SUPABASE_SERVICE_ROLE_KEY:', !!supabaseServiceKey)
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function fixPesertaSyncIssue() {
  console.log('🔧 Memperbaiki masalah sinkronisasi jumlah peserta pelatihan...\n')

  try {
    // 1. Ambil semua data jenis pelatihan
    console.log('📊 Mengambil data jenis pelatihan...')
    const { data: jenisData, error: jenisError } = await supabase
      .from('jenis_pelatihan')
      .select('*')
      .is('deleted_at', null)
      .order('created_at', { ascending: false })

    if (jenisError) {
      throw new Error(`Error mengambil jenis pelatihan: ${jenisError.message}`)
    }

    console.log(`✅ Ditemukan ${jenisData.length} jenis pelatihan`)

    // 2. Ambil semua data peserta pelatihan
    console.log('📊 Mengambil data peserta pelatihan...')
    const { data: pesertaData, error: pesertaError } = await supabase
      .from('pelatihan')
      .select('*')
      .is('deleted_at', null)

    if (pesertaError) {
      throw new Error(`Error mengambil peserta pelatihan: ${pesertaError.message}`)
    }

    console.log(`✅ Ditemukan ${pesertaData.length} peserta pelatihan`)

    // 3. Verifikasi dan perbaiki sinkronisasi
    console.log('\n🔍 Memverifikasi sinkronisasi jumlah peserta...')
    
    let syncIssues = []
    let totalPesertaPerJenis = {}

    for (const jenis of jenisData) {
      // Hitung jumlah peserta aktual untuk jenis pelatihan ini
      const actualCount = pesertaData.filter(peserta => 
        peserta.jenis_pelatihan_id === jenis.id
      ).length

      totalPesertaPerJenis[jenis.id] = actualCount

      console.log(`📋 ${jenis.jenis_pelatihan}:`)
      console.log(`   - Jumlah peserta aktual: ${actualCount}`)
      
      // Cek apakah ada field jumlah_peserta yang tidak sinkron
      if (jenis.jumlah_peserta !== undefined && jenis.jumlah_peserta !== actualCount) {
        console.log(`   ⚠️  Tidak sinkron! Database menunjukkan: ${jenis.jumlah_peserta}`)
        syncIssues.push({
          id: jenis.id,
          nama: jenis.jenis_pelatihan,
          actualCount: actualCount,
          reportedCount: jenis.jumlah_peserta
        })
      } else {
        console.log(`   ✅ Sinkronisasi benar`)
      }
    }

    // 4. Tampilkan ringkasan
    console.log('\n📈 RINGKASAN JUMLAH PESERTA PER JENIS PELATIHAN:')
    console.log('=' .repeat(60))
    
    for (const jenis of jenisData) {
      const count = totalPesertaPerJenis[jenis.id]
      console.log(`${jenis.jenis_pelatihan.padEnd(40)} : ${count} peserta`)
    }

    // 5. Perbaiki masalah sinkronisasi jika ada
    if (syncIssues.length > 0) {
      console.log(`\n⚠️  Ditemukan ${syncIssues.length} masalah sinkronisasi:`)
      
      for (const issue of syncIssues) {
        console.log(`   - ${issue.nama}: Aktual ${issue.actualCount}, Tercatat ${issue.reportedCount}`)
      }

      console.log('\n🔧 Memperbaiki sinkronisasi...')
      
      // Update field jumlah_peserta di database (jika ada)
      // Catatan: Sebenarnya API sudah menghitung real-time, jadi ini hanya untuk memastikan
      for (const issue of syncIssues) {
        const { error: updateError } = await supabase
          .from('jenis_pelatihan')
          .update({ 
            jumlah_peserta: issue.actualCount,
            updated_at: new Date().toISOString()
          })
          .eq('id', issue.id)

        if (updateError) {
          console.log(`   ❌ Gagal update ${issue.nama}: ${updateError.message}`)
        } else {
          console.log(`   ✅ Berhasil update ${issue.nama}`)
        }
      }
    } else {
      console.log('\n✅ Semua sinkronisasi sudah benar!')
    }

    // 6. Test API endpoint untuk memastikan sinkronisasi
    console.log('\n🧪 Testing API endpoint jenis-pelatihan...')
    
    try {
      const response = await fetch('http://localhost:3000/api/jenis-pelatihan')
      const result = await response.json()
      
      if (result.success) {
        console.log('✅ API jenis-pelatihan berfungsi normal')
        
        // Verifikasi data dari API
        let apiSyncCorrect = true
        for (const jenis of result.data) {
          const expectedCount = totalPesertaPerJenis[jenis.id] || 0
          const apiCount = jenis.jumlah_peserta || 0
          
          if (expectedCount !== apiCount) {
            console.log(`⚠️  API sync issue: ${jenis.jenis_pelatihan} - Expected: ${expectedCount}, API: ${apiCount}`)
            apiSyncCorrect = false
          }
        }
        
        if (apiSyncCorrect) {
          console.log('✅ API mengembalikan data yang sinkron')
        } else {
          console.log('❌ API masih mengembalikan data yang tidak sinkron')
        }
      } else {
        console.log('❌ API jenis-pelatihan error:', result.error)
      }
    } catch (apiError) {
      console.log('⚠️  Tidak bisa test API (server mungkin tidak berjalan):', apiError.message)
    }

    // 7. Rekomendasi perbaikan
    console.log('\n💡 REKOMENDASI PERBAIKAN:')
    console.log('=' .repeat(60))
    console.log('1. Pastikan frontend melakukan refresh data setelah menambah peserta')
    console.log('2. API jenis-pelatihan sudah menghitung jumlah peserta secara real-time')
    console.log('3. Masalah mungkin di frontend yang tidak memanggil loadData() setelah submit')
    console.log('4. Periksa function handlePesertaSubmit di pages/pelatihan.js')

    console.log('\n✅ Perbaikan sinkronisasi selesai!')
    
    return {
      success: true,
      totalJenisPelatihan: jenisData.length,
      totalPeserta: pesertaData.length,
      syncIssuesFound: syncIssues.length,
      syncIssuesFixed: syncIssues.length,
      pesertaPerJenis: totalPesertaPerJenis
    }

  } catch (error) {
    console.error('❌ Error:', error.message)
    return {
      success: false,
      error: error.message
    }
  }
}

// Jalankan perbaikan
if (require.main === module) {
  fixPesertaSyncIssue()
    .then(result => {
      if (result.success) {
        console.log('\n🎉 Perbaikan berhasil!')
        process.exit(0)
      } else {
        console.log('\n💥 Perbaikan gagal!')
        process.exit(1)
      }
    })
    .catch(error => {
      console.error('💥 Unexpected error:', error)
      process.exit(1)
    })
}

module.exports = { fixPesertaSyncIssue }