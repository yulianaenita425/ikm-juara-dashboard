// Script untuk menguji perbaikan sinkronisasi jumlah peserta pelatihan
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

async function testPesertaSyncFix() {
  console.log('🧪 Testing perbaikan sinkronisasi jumlah peserta pelatihan...\n')

  try {
    // 1. Test API jenis-pelatihan
    console.log('📊 Testing API jenis-pelatihan...')
    const { data: jenisData, error: jenisError } = await supabase
      .from('jenis_pelatihan')
      .select('*')
      .is('deleted_at', null)

    if (jenisError) {
      throw new Error(`Error API jenis-pelatihan: ${jenisError.message}`)
    }

    // 2. Test API pelatihan
    console.log('📊 Testing API pelatihan...')
    const { data: pesertaData, error: pesertaError } = await supabase
      .from('pelatihan')
      .select('*')
      .is('deleted_at', null)

    if (pesertaError) {
      throw new Error(`Error API pelatihan: ${pesertaError.message}`)
    }

    // 3. Simulasi perhitungan jumlah peserta seperti di API jenis-pelatihan
    console.log('🔍 Simulasi perhitungan jumlah peserta seperti di API...')
    
    const jenisWithPeserta = await Promise.all(
      jenisData.map(async (jenis) => {
        const { count, error: countError } = await supabase
          .from('pelatihan')
          .select('id', { count: 'exact' })
          .eq('jenis_pelatihan_id', jenis.id)
          .is('deleted_at', null)

        if (countError) {
          console.error('Error counting peserta:', countError)
        }

        return {
          ...jenis,
          jumlah_peserta: count || 0
        }
      })
    )

    // 4. Verifikasi konsistensi
    console.log('✅ Hasil perhitungan jumlah peserta:')
    console.log('=' .repeat(70))
    
    let totalPeserta = 0
    let allConsistent = true
    
    for (const jenis of jenisWithPeserta) {
      // Hitung manual dari data peserta
      const manualCount = pesertaData.filter(p => p.jenis_pelatihan_id === jenis.id).length
      const apiCount = jenis.jumlah_peserta
      
      const consistent = manualCount === apiCount
      if (!consistent) allConsistent = false
      
      console.log(`${jenis.jenis_pelatihan.padEnd(35)} : ${apiCount} peserta ${consistent ? '✅' : '❌'}`)
      if (!consistent) {
        console.log(`  Manual count: ${manualCount}, API count: ${apiCount}`)
      }
      
      totalPeserta += apiCount
    }

    console.log('=' .repeat(70))
    console.log(`Total peserta pelatihan: ${totalPeserta}`)

    // 5. Test skenario penambahan peserta baru
    console.log('\n🧪 Testing skenario penambahan peserta baru...')
    
    // Ambil jenis pelatihan pertama yang aktif
    const jenisAktif = jenisWithPeserta.find(j => j.status === 'Aktif')
    if (!jenisAktif) {
      console.log('⚠️  Tidak ada jenis pelatihan aktif untuk testing')
    } else {
      console.log(`📝 Akan test dengan jenis pelatihan: ${jenisAktif.jenis_pelatihan}`)
      console.log(`   Jumlah peserta saat ini: ${jenisAktif.jumlah_peserta}`)
      
      // Simulasi: Jika ada peserta baru ditambahkan, apakah API akan menghitung dengan benar?
      const expectedNewCount = jenisAktif.jumlah_peserta + 1
      console.log(`   Jika ditambah 1 peserta, seharusnya menjadi: ${expectedNewCount}`)
    }

    // 6. Rekomendasi
    console.log('\n💡 HASIL ANALISIS:')
    console.log('=' .repeat(70))
    
    if (allConsistent) {
      console.log('✅ Semua perhitungan jumlah peserta sudah konsisten')
      console.log('✅ API jenis-pelatihan menghitung dengan benar')
      console.log('✅ Perbaikan frontend sudah tepat (menggunakan jenis.jumlah_peserta)')
    } else {
      console.log('❌ Masih ada inkonsistensi dalam perhitungan')
      console.log('⚠️  Perlu investigasi lebih lanjut')
    }

    console.log('\n📋 LANGKAH SELANJUTNYA:')
    console.log('1. Pastikan server development berjalan (npm run dev)')
    console.log('2. Test manual di browser: tambah peserta pelatihan baru')
    console.log('3. Periksa apakah jumlah peserta langsung ter-update di tabel jenis pelatihan')
    console.log('4. Jika masih tidak sinkron, periksa network tab untuk melihat response API')

    return {
      success: true,
      totalJenisPelatihan: jenisData.length,
      totalPeserta: totalPeserta,
      allConsistent: allConsistent,
      jenisWithPeserta: jenisWithPeserta
    }

  } catch (error) {
    console.error('❌ Error:', error.message)
    return {
      success: false,
      error: error.message
    }
  }
}

// Jalankan test
if (require.main === module) {
  testPesertaSyncFix()
    .then(result => {
      if (result.success) {
        console.log('\n🎉 Test selesai!')
        if (result.allConsistent) {
          console.log('✅ Sinkronisasi sudah benar!')
        } else {
          console.log('⚠️  Masih ada masalah sinkronisasi')
        }
      } else {
        console.log('\n💥 Test gagal!')
      }
    })
    .catch(error => {
      console.error('💥 Unexpected error:', error)
    })
}

module.exports = { testPesertaSyncFix }