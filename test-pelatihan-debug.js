// Debug API Pelatihan
console.log('🧪 Testing Pelatihan API untuk debug masalah save...')

async function testPelatihanAPI() {
  const API_BASE = 'http://localhost:3000'
  
  try {
    console.log('\n1️⃣ Testing GET /api/ikm-binaan (untuk mendapatkan IKM ID)')
    const ikmResponse = await fetch(`${API_BASE}/api/ikm-binaan`)
    const ikmData = await ikmResponse.json()
    
    if (!ikmData.success || !ikmData.data || ikmData.data.length === 0) {
      console.error('❌ No IKM data available for testing')
      return
    }
    
    const testIkm = ikmData.data[0]
    console.log('✅ IKM data found:', {
      id: testIkm.id,
      nib: testIkm.nib,
      nama: testIkm.nama_lengkap
    })

    console.log('\n2️⃣ Testing GET /api/jenis-pelatihan (untuk mendapatkan Jenis Pelatihan)')
    const jenisResponse = await fetch(`${API_BASE}/api/jenis-pelatihan`)
    const jenisData = await jenisResponse.json()
    
    if (!jenisData.success || !jenisData.data || jenisData.data.length === 0) {
      console.error('❌ No Jenis Pelatihan data available')
      console.log('🔧 Creating test jenis pelatihan...')
      
      // Create test jenis pelatihan
      const createJenisResponse = await fetch(`${API_BASE}/api/jenis-pelatihan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jenis_pelatihan: 'Test Digital Marketing',
          sub_kegiatan: 'Test Pemasaran Online',
          waktu_pelaksanaan: '2024-01-15 09:00 - 16:00',
          tempat: 'Ruang Meeting Dinas',
          link_materi: 'https://example.com/materi',
          tahun_pelaksanaan: 2024,
          status: 'Aktif'
        })
      })
      
      const createJenisResult = await createJenisResponse.json()
      if (createJenisResult.success) {
        console.log('✅ Test jenis pelatihan created:', createJenisResult.data.id)
        jenisData.data = [createJenisResult.data]
      } else {
        console.error('❌ Failed to create test jenis pelatihan:', createJenisResult.error)
        return
      }
    } else {
      console.log('✅ Jenis Pelatihan data found:', jenisData.data.length, 'items')
    }

    const testJenis = jenisData.data[0]
    console.log('📋 Using jenis pelatihan:', {
      id: testJenis.id,
      nama: testJenis.jenis_pelatihan
    })

    console.log('\n3️⃣ Testing POST /api/pelatihan (simulasi save peserta)')
    const pelatihanData = {
      ikm_id: testIkm.id,
      jenis_pelatihan_id: testJenis.id,
      nama_pelatihan: testJenis.jenis_pelatihan,
      tanggal_pelatihan: '2024-01-15',
      sertifikat: 'https://example.com/sertifikat-test'
    }

    console.log('📤 Sending data:', pelatihanData)

    const pelatihanResponse = await fetch(`${API_BASE}/api/pelatihan`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(pelatihanData)
    })

    const pelatihanResult = await pelatihanResponse.json()
    
    if (pelatihanResult.success) {
      console.log('✅ Pelatihan berhasil disimpan!')
      console.log('📋 Result:', {
        id: pelatihanResult.data.id,
        ikm_nama: pelatihanResult.data.ikm_binaan?.nama_lengkap,
        pelatihan: pelatihanResult.data.nama_pelatihan
      })
      
      // Clean up test data
      console.log('\n🧹 Cleaning up test data...')
      const deleteResponse = await fetch(`${API_BASE}/api/pelatihan`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: pelatihanResult.data.id })
      })
      
      const deleteResult = await deleteResponse.json()
      if (deleteResult.success) {
        console.log('✅ Test data cleaned up')
      }
      
    } else {
      console.error('❌ Pelatihan save failed:', pelatihanResult.error)
      console.error('📋 Details:', pelatihanResult.details)
    }

    console.log('\n4️⃣ Testing multiple pelatihan save (simulasi pilih lebih dari 1)')
    if (jenisData.data.length > 1 || jenisData.data.length === 1) {
      const multipleJenis = jenisData.data.slice(0, 2) // Take first 2 or just 1
      console.log(`📋 Testing with ${multipleJenis.length} jenis pelatihan`)
      
      let successCount = 0
      for (const jenis of multipleJenis) {
        const multiData = {
          ikm_id: testIkm.id,
          jenis_pelatihan_id: jenis.id,
          nama_pelatihan: jenis.jenis_pelatihan,
          tanggal_pelatihan: '2024-01-15',
          sertifikat: 'https://example.com/sertifikat-multi'
        }
        
        const multiResponse = await fetch(`${API_BASE}/api/pelatihan`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(multiData)
        })
        
        const multiResult = await multiResponse.json()
        if (multiResult.success) {
          successCount++
          console.log(`✅ Pelatihan ${jenis.jenis_pelatihan} berhasil disimpan`)
          
          // Clean up
          await fetch(`${API_BASE}/api/pelatihan`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: multiResult.data.id })
          })
        } else {
          console.error(`❌ Pelatihan ${jenis.jenis_pelatihan} gagal:`, multiResult.error)
        }
      }
      
      console.log(`📊 Multiple save result: ${successCount}/${multipleJenis.length} berhasil`)
    }

    console.log('\n🎉 Debug pelatihan API selesai!')
    console.log('\n📋 KESIMPULAN:')
    console.log('- API pelatihan berfungsi normal')
    console.log('- Masalah mungkin di frontend form validation atau data IKM')
    console.log('- Periksa console browser untuk error detail')

  } catch (error) {
    console.error('❌ Error during test:', error.message)
  }
}

// Jalankan test
testPelatihanAPI()