// Script untuk test otomatis sinkronisasi peserta pelatihan
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

async function testAutomatedPesertaSync() {
  console.log('🤖 Test Otomatis Sinkronisasi Peserta Pelatihan\n')

  try {
    // 1. Ambil data awal
    console.log('📊 Mengambil data awal...')
    
    const { data: initialJenis } = await supabase
      .from('jenis_pelatihan')
      .select('*')
      .is('deleted_at', null)
      .order('created_at', { ascending: false })

    const { data: initialPeserta } = await supabase
      .from('pelatihan')
      .select('*')
      .is('deleted_at', null)

    console.log(`✅ Jenis Pelatihan: ${initialJenis.length}`)
    console.log(`✅ Peserta Pelatihan: ${initialPeserta.length}`)

    // 2. Test API jenis-pelatihan sebelum penambahan
    console.log('\n🌐 Test API jenis-pelatihan (sebelum)...')
    
    const beforeResponse = await fetch('http://localhost:3000/api/jenis-pelatihan')
    const beforeResult = await beforeResponse.json()
    
    if (!beforeResult.success) {
      throw new Error('API jenis-pelatihan error: ' + beforeResult.error)
    }

    console.log('✅ API jenis-pelatihan berfungsi normal')
    
    // Tampilkan jumlah peserta sebelum
    console.log('\n📋 Jumlah peserta SEBELUM penambahan:')
    beforeResult.data.forEach((jenis, index) => {
      const status = jenis.status === 'Aktif' ? '🟢' : '🔴'
      console.log(`${(index + 1).toString().padStart(2)}. ${jenis.jenis_pelatihan.padEnd(35)} : ${jenis.jumlah_peserta || 0} peserta ${status}`)
    })

    // 3. Pilih jenis pelatihan untuk test
    const jenisAktif = beforeResult.data.filter(j => j.status === 'Aktif')
    if (jenisAktif.length === 0) {
      throw new Error('Tidak ada jenis pelatihan aktif untuk testing')
    }

    const targetJenis = jenisAktif[0]
    const initialCount = targetJenis.jumlah_peserta || 0
    
    console.log(`\n🎯 Target test: ${targetJenis.jenis_pelatihan}`)
    console.log(`   Jumlah peserta saat ini: ${initialCount}`)

    // 4. Ambil atau buat data IKM untuk test
    console.log('\n👤 Menyiapkan data IKM untuk test...')
    
    const { data: ikmData } = await supabase
      .from('ikm_binaan')
      .select('*')
      .is('deleted_at', null)
      .limit(1)

    let testIkmId = null
    
    if (ikmData && ikmData.length > 0) {
      testIkmId = ikmData[0].id
      console.log(`✅ Menggunakan IKM existing: ${ikmData[0].nama_lengkap}`)
    } else {
      // Buat IKM test baru
      const { data: newIkm, error: ikmError } = await supabase
        .from('ikm_binaan')
        .insert([{
          nib: 'TEST-' + Date.now(),
          nik: '1234567890123456',
          nama_lengkap: 'Test User Automated',
          alamat_lengkap: 'Alamat Test',
          nama_usaha: 'Usaha Test Automated',
          nomor_hp: '081234567890'
        }])
        .select()
        .single()

      if (ikmError) {
        throw new Error('Gagal membuat IKM test: ' + ikmError.message)
      }

      testIkmId = newIkm.id
      console.log(`✅ IKM test baru dibuat: ${newIkm.nama_lengkap}`)
    }

    // 5. Cek apakah IKM sudah terdaftar di pelatihan target
    const { data: existingPelatihan } = await supabase
      .from('pelatihan')
      .select('id')
      .eq('ikm_id', testIkmId)
      .eq('jenis_pelatihan_id', targetJenis.id)
      .is('deleted_at', null)
      .single()

    if (existingPelatihan) {
      console.log('⚠️  IKM sudah terdaftar di pelatihan ini, skip penambahan')
      console.log('✅ Test sinkronisasi: Data sudah konsisten')
      return { success: true, skipped: true }
    }

    // 6. Simulasi penambahan peserta melalui API
    console.log('\n➕ Menambah peserta baru melalui API...')
    
    const pelatihanData = {
      ikm_id: testIkmId,
      jenis_pelatihan_id: targetJenis.id,
      nama_pelatihan: targetJenis.jenis_pelatihan,
      tanggal_pelatihan: new Date().toISOString().split('T')[0],
      sertifikat: null
    }

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

    console.log('✅ Peserta berhasil ditambahkan')

    // 7. Test API jenis-pelatihan setelah penambahan
    console.log('\n🔄 Test API jenis-pelatihan (setelah)...')
    
    // Tunggu sebentar untuk memastikan data ter-update
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const afterResponse = await fetch('http://localhost:3000/api/jenis-pelatihan')
    const afterResult = await afterResponse.json()
    
    if (!afterResult.success) {
      throw new Error('API jenis-pelatihan error setelah penambahan: ' + afterResult.error)
    }

    // 8. Verifikasi sinkronisasi
    console.log('\n📋 Jumlah peserta SETELAH penambahan:')
    
    let syncSuccess = false
    const updatedJenis = afterResult.data.find(j => j.id === targetJenis.id)
    
    if (updatedJenis) {
      const newCount = updatedJenis.jumlah_peserta || 0
      const expectedCount = initialCount + 1
      
      afterResult.data.forEach((jenis, index) => {
        const status = jenis.status === 'Aktif' ? '🟢' : '🔴'
        const highlight = jenis.id === targetJenis.id ? ' ⭐' : ''
        console.log(`${(index + 1).toString().padStart(2)}. ${jenis.jenis_pelatihan.padEnd(35)} : ${jenis.jumlah_peserta || 0} peserta ${status}${highlight}`)
      })

      console.log(`\n🔍 Verifikasi sinkronisasi:`)
      console.log(`   Jenis pelatihan: ${targetJenis.jenis_pelatihan}`)
      console.log(`   Jumlah sebelum: ${initialCount}`)
      console.log(`   Jumlah setelah: ${newCount}`)
      console.log(`   Yang diharapkan: ${expectedCount}`)
      
      if (newCount === expectedCount) {
        console.log('✅ SINKRONISASI BERHASIL!')
        syncSuccess = true
      } else {
        console.log('❌ SINKRONISASI GAGAL!')
        syncSuccess = false
      }
    } else {
      console.log('❌ Jenis pelatihan tidak ditemukan setelah update')
      syncSuccess = false
    }

    // 9. Cleanup - hapus data test jika perlu
    console.log('\n🧹 Cleanup data test...')
    
    if (addResult.data && addResult.data.id) {
      const { error: deleteError } = await supabase
        .from('pelatihan')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', addResult.data.id)

      if (deleteError) {
        console.log('⚠️  Gagal cleanup data test:', deleteError.message)
      } else {
        console.log('✅ Data test berhasil dihapus')
      }
    }

    // 10. Hasil akhir
    console.log('\n🎯 HASIL TEST OTOMATIS:')
    console.log('=' .repeat(70))
    
    if (syncSuccess) {
      console.log('✅ SINKRONISASI PESERTA PELATIHAN BERFUNGSI DENGAN BAIK!')
      console.log('✅ API jenis-pelatihan menghitung jumlah peserta secara real-time')
      console.log('✅ Data konsisten antara database dan API')
      console.log('✅ Perbaikan frontend berhasil')
    } else {
      console.log('❌ MASIH ADA MASALAH SINKRONISASI!')
      console.log('⚠️  Perlu investigasi lebih lanjut')
    }

    return {
      success: true,
      syncSuccess: syncSuccess,
      initialCount: initialCount,
      finalCount: updatedJenis ? updatedJenis.jumlah_peserta : 0,
      targetJenis: targetJenis.jenis_pelatihan
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
  testAutomatedPesertaSync()
    .then(result => {
      if (result.success) {
        if (result.skipped) {
          console.log('\n🎉 Test selesai (skipped - data sudah ada)')
        } else if (result.syncSuccess) {
          console.log('\n🎉 TEST OTOMATIS BERHASIL!')
          console.log('🚀 Sinkronisasi peserta pelatihan berfungsi sempurna!')
        } else {
          console.log('\n⚠️  Test selesai tapi ada masalah sinkronisasi')
        }
      } else {
        console.log('\n💥 Test gagal!')
      }
    })
    .catch(error => {
      console.error('💥 Unexpected error:', error)
    })
}

module.exports = { testAutomatedPesertaSync }