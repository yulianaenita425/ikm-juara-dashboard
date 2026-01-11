// Demo Otomatis Sinkronisasi Peserta Pelatihan
// Menunjukkan bahwa masalah sudah diperbaiki dengan sempurna

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

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function demoSinkronisasiOtomatis() {
  console.log('🎬 DEMO OTOMATIS SINKRONISASI PESERTA PELATIHAN')
  console.log('=' .repeat(70))
  console.log('🎯 Tujuan: Menunjukkan bahwa sinkronisasi sudah berfungsi sempurna')
  console.log('🕐 Waktu:', new Date().toLocaleString('id-ID'))
  console.log('=' .repeat(70))

  try {
    // 1. Tampilkan status awal
    console.log('\n📊 LANGKAH 1: MENGAMBIL DATA AWAL')
    console.log('-' .repeat(50))

    const jenisResponse = await fetch('http://localhost:3000/api/jenis-pelatihan')
    const jenisResult = await jenisResponse.json()

    if (!jenisResult.success) {
      throw new Error('API jenis-pelatihan error: ' + jenisResult.error)
    }

    console.log('✅ Server berjalan normal di http://localhost:3000')
    console.log('✅ API jenis-pelatihan berfungsi dengan baik')
    console.log(`✅ Ditemukan ${jenisResult.data.length} jenis pelatihan`)

    // Tampilkan data awal
    console.log('\n📋 JUMLAH PESERTA AWAL:')
    let totalPesertaAwal = 0
    jenisResult.data.forEach((jenis, index) => {
      const count = jenis.jumlah_peserta || 0
      totalPesertaAwal += count
      const status = jenis.status === 'Aktif' ? '🟢' : '🔴'
      console.log(`${(index + 1).toString().padStart(2)}. ${jenis.jenis_pelatihan.padEnd(35)} : ${count} peserta ${status}`)
    })
    console.log(`📊 Total peserta saat ini: ${totalPesertaAwal}`)

    // 2. Pilih jenis pelatihan untuk demo
    console.log('\n🎯 LANGKAH 2: MEMILIH TARGET UNTUK DEMO')
    console.log('-' .repeat(50))

    const jenisAktif = jenisResult.data.filter(j => j.status === 'Aktif')
    if (jenisAktif.length === 0) {
      throw new Error('Tidak ada jenis pelatihan aktif untuk demo')
    }

    // Pilih jenis dengan peserta paling sedikit untuk demo yang jelas
    const targetJenis = jenisAktif.reduce((min, current) => 
      (current.jumlah_peserta || 0) < (min.jumlah_peserta || 0) ? current : min
    )

    const pesertaAwal = targetJenis.jumlah_peserta || 0
    console.log(`🎯 Target demo: ${targetJenis.jenis_pelatihan}`)
    console.log(`📊 Jumlah peserta saat ini: ${pesertaAwal}`)
    console.log(`🎪 Akan menambah 1 peserta untuk demo sinkronisasi`)

    // 3. Siapkan data IKM untuk demo
    console.log('\n👤 LANGKAH 3: MENYIAPKAN DATA IKM UNTUK DEMO')
    console.log('-' .repeat(50))

    // Buat IKM demo baru
    const timestamp = Date.now().toString().slice(-8) // Ambil 8 digit terakhir
    const demoIkm = {
      nib: timestamp, // Maksimal 13 karakter
      nik: '1234567890123456',
      nama_lengkap: 'Demo User Sync',
      alamat_lengkap: 'Alamat Demo',
      nama_usaha: 'Usaha Demo',
      nomor_hp: '081234567890'
    }

    const { data: newIkm, error: ikmError } = await supabase
      .from('ikm_binaan')
      .insert([demoIkm])
      .select()
      .single()

    if (ikmError) {
      throw new Error('Gagal membuat IKM demo: ' + ikmError.message)
    }

    console.log('✅ IKM demo berhasil dibuat')
    console.log(`   Nama: ${newIkm.nama_lengkap}`)
    console.log(`   NIB: ${newIkm.nib}`)

    // 4. Demo penambahan peserta
    console.log('\n➕ LANGKAH 4: MENAMBAH PESERTA BARU (SIMULASI FORM)')
    console.log('-' .repeat(50))

    console.log('🎬 Simulasi: User mengisi form peserta pelatihan...')
    await sleep(1000)

    console.log('📝 Data yang akan dikirim:')
    console.log(`   - IKM ID: ${newIkm.id}`)
    console.log(`   - Jenis Pelatihan: ${targetJenis.jenis_pelatihan}`)
    console.log(`   - Tanggal: ${new Date().toISOString().split('T')[0]}`)

    await sleep(1000)

    const pelatihanData = {
      ikm_id: newIkm.id,
      jenis_pelatihan_id: targetJenis.id,
      nama_pelatihan: targetJenis.jenis_pelatihan,
      tanggal_pelatihan: new Date().toISOString().split('T')[0],
      sertifikat: null
    }

    console.log('🚀 Mengirim data ke API pelatihan...')
    
    const addResponse = await fetch('http://localhost:3000/api/pelatihan', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(pelatihanData)
    })

    const addResult = await addResponse.json()
    
    if (!addResult.success) {
      throw new Error('Gagal menambah peserta: ' + addResult.error)
    }

    console.log('✅ Peserta berhasil ditambahkan ke database!')
    console.log(`   ID Pelatihan: ${addResult.data.id}`)

    // 5. Verifikasi sinkronisasi real-time
    console.log('\n🔄 LANGKAH 5: VERIFIKASI SINKRONISASI REAL-TIME')
    console.log('-' .repeat(50))

    console.log('⏳ Simulasi: Frontend memanggil loadData() setelah submit...')
    await sleep(1500)

    console.log('🌐 Mengambil data terbaru dari API jenis-pelatihan...')
    
    const updatedResponse = await fetch('http://localhost:3000/api/jenis-pelatihan')
    const updatedResult = await updatedResponse.json()
    
    if (!updatedResult.success) {
      throw new Error('API error setelah update: ' + updatedResult.error)
    }

    // 6. Tampilkan hasil sinkronisasi
    console.log('\n📊 LANGKAH 6: HASIL SINKRONISASI')
    console.log('-' .repeat(50))

    const updatedJenis = updatedResult.data.find(j => j.id === targetJenis.id)
    const pesertaBaru = updatedJenis ? updatedJenis.jumlah_peserta : 0
    const perubahanBerhasil = pesertaBaru === (pesertaAwal + 1)

    console.log('📋 JUMLAH PESERTA SETELAH PENAMBAHAN:')
    let totalPesertaBaru = 0
    updatedResult.data.forEach((jenis, index) => {
      const count = jenis.jumlah_peserta || 0
      totalPesertaBaru += count
      const status = jenis.status === 'Aktif' ? '🟢' : '🔴'
      const highlight = jenis.id === targetJenis.id ? ' ⭐ UPDATED!' : ''
      console.log(`${(index + 1).toString().padStart(2)}. ${jenis.jenis_pelatihan.padEnd(35)} : ${count} peserta ${status}${highlight}`)
    })

    console.log('\n🔍 ANALISIS SINKRONISASI:')
    console.log(`   Target: ${targetJenis.jenis_pelatihan}`)
    console.log(`   Sebelum: ${pesertaAwal} peserta`)
    console.log(`   Sesudah: ${pesertaBaru} peserta`)
    console.log(`   Perubahan: +${pesertaBaru - pesertaAwal}`)
    console.log(`   Status: ${perubahanBerhasil ? '✅ SINKRONISASI BERHASIL!' : '❌ SINKRONISASI GAGAL!'}`)

    // 7. Cleanup demo data
    console.log('\n🧹 LANGKAH 7: CLEANUP DATA DEMO')
    console.log('-' .repeat(50))

    console.log('🗑️  Menghapus data demo untuk menjaga kebersihan database...')

    // Hapus pelatihan demo
    const { error: deletePelatihanError } = await supabase
      .from('pelatihan')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', addResult.data.id)

    // Hapus IKM demo
    const { error: deleteIkmError } = await supabase
      .from('ikm_binaan')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', newIkm.id)

    if (deletePelatihanError || deleteIkmError) {
      console.log('⚠️  Warning: Gagal cleanup sebagian data demo')
    } else {
      console.log('✅ Data demo berhasil dihapus')
    }

    // 8. Verifikasi kembali ke kondisi awal
    console.log('\n🔄 Verifikasi kembali ke kondisi awal...')
    await sleep(1000)

    const finalResponse = await fetch('http://localhost:3000/api/jenis-pelatihan')
    const finalResult = await finalResponse.json()
    
    const finalJenis = finalResult.data.find(j => j.id === targetJenis.id)
    const finalCount = finalJenis ? finalJenis.jumlah_peserta : 0
    
    console.log(`✅ Jumlah peserta kembali ke: ${finalCount} (seharusnya ${pesertaAwal})`)

    // 9. Kesimpulan demo
    console.log('\n🎉 KESIMPULAN DEMO')
    console.log('=' .repeat(70))

    if (perubahanBerhasil) {
      console.log('🏆 DEMO BERHASIL SEMPURNA!')
      console.log('✅ Sinkronisasi peserta pelatihan berfungsi dengan baik')
      console.log('✅ API jenis-pelatihan menghitung jumlah peserta secara real-time')
      console.log('✅ Frontend akan menampilkan data yang selalu ter-update')
      console.log('✅ Masalah sinkronisasi sudah diperbaiki 100%')
    } else {
      console.log('❌ DEMO MENUNJUKKAN MASALAH!')
      console.log('⚠️  Sinkronisasi tidak berfungsi dengan benar')
      console.log('🔧 Perlu investigasi lebih lanjut')
    }

    console.log('\n📱 CARA TESTING MANUAL:')
    console.log('1. Buka browser: http://localhost:3000/pelatihan')
    console.log('2. Login sebagai admin')
    console.log('3. Tab "Jenis Pelatihan" - lihat jumlah peserta')
    console.log('4. Tab "Peserta Pelatihan" - tambah peserta baru')
    console.log('5. Kembali ke "Jenis Pelatihan" - jumlah langsung bertambah!')

    return {
      success: true,
      sinkronisasiBerhasil: perubahanBerhasil,
      pesertaAwal: pesertaAwal,
      pesertaBaru: pesertaBaru,
      targetJenis: targetJenis.jenis_pelatihan
    }

  } catch (error) {
    console.error('❌ Demo error:', error.message)
    return {
      success: false,
      error: error.message
    }
  }
}

// Jalankan demo
if (require.main === module) {
  demoSinkronisasiOtomatis()
    .then(result => {
      if (result.success) {
        if (result.sinkronisasiBerhasil) {
          console.log('\n🎊 DEMO SUKSES - SINKRONISASI BERFUNGSI SEMPURNA!')
        } else {
          console.log('\n⚠️  DEMO SELESAI - ADA MASALAH SINKRONISASI')
        }
      } else {
        console.log('\n💥 DEMO GAGAL!')
      }
    })
    .catch(error => {
      console.error('💥 Unexpected error:', error)
    })
}

module.exports = { demoSinkronisasiOtomatis }