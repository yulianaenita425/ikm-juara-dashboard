// Test API TKDN yang sudah diperbaiki

const API_BASE = 'http://localhost:3000'

async function testTkdnApi() {
  console.log('🧪 Testing TKDN API yang sudah diperbaiki...')
  
  try {
    // 1. Test GET - ambil data yang ada
    console.log('\n1️⃣ Testing GET /api/tkdn-ik')
    const getResponse = await fetch(`${API_BASE}/api/tkdn-ik`)
    const getData = await getResponse.json()
    
    if (getData.success) {
      console.log('✅ GET berhasil, data count:', getData.data.length)
      if (getData.data.length > 0) {
        console.log('📋 Sample data:', {
          id: getData.data[0].id,
          nomor_sertifikat: getData.data[0].nomor_sertifikat,
          persentase_tkdn: getData.data[0].persentase_tkdn,
          status_sertifikat: getData.data[0].status_sertifikat
        })
      }
    } else {
      console.error('❌ GET failed:', getData.message)
    }

    // 2. Test POST - tambah data baru
    console.log('\n2️⃣ Testing POST /api/tkdn-ik')
    
    // Ambil IKM pertama untuk testing
    const ikmResponse = await fetch(`${API_BASE}/api/ikm-binaan`)
    const ikmData = await ikmResponse.json()
    
    if (!ikmData.success || ikmData.data.length === 0) {
      console.log('⚠️  No IKM data for testing POST')
      return
    }

    const testPostData = {
      ikm_id: ikmData.data[0].id,
      nomor_sertifikat: 'TEST-API-' + Date.now(),
      persentase_tkdn: 67.5,
      status_sertifikat: 'Telah Didaftar',
      link_sertifikat: 'https://example.com/test-api',
      tahun_terbit: 2024
    }

    const postResponse = await fetch(`${API_BASE}/api/tkdn-ik`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testPostData)
    })

    const postData = await postResponse.json()
    
    if (postData.success) {
      console.log('✅ POST berhasil, created ID:', postData.data.id)
      console.log('📋 Created data:', {
        nomor_sertifikat: postData.data.nomor_sertifikat,
        persentase_tkdn: postData.data.persentase_tkdn,
        status_sertifikat: postData.data.status_sertifikat
      })

      // 3. Test PUT - update data
      console.log('\n3️⃣ Testing PUT /api/tkdn-ik')
      const updateData = {
        id: postData.data.id,
        ikm_id: postData.data.ikm_id,
        nomor_sertifikat: postData.data.nomor_sertifikat,
        persentase_tkdn: 75.0,
        status_sertifikat: 'Proses',
        link_sertifikat: postData.data.link_sertifikat,
        tahun_terbit: postData.data.tahun_terbit
      }

      const putResponse = await fetch(`${API_BASE}/api/tkdn-ik`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData)
      })

      const putData = await putResponse.json()
      
      if (putData.success) {
        console.log('✅ PUT berhasil')
        console.log('📋 Updated data:', {
          persentase_tkdn: putData.data.persentase_tkdn,
          status_sertifikat: putData.data.status_sertifikat
        })
      } else {
        console.error('❌ PUT failed:', putData.error)
      }

      // 4. Test DELETE - hapus data test
      console.log('\n4️⃣ Testing DELETE /api/tkdn-ik')
      const deleteResponse = await fetch(`${API_BASE}/api/tkdn-ik`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: postData.data.id })
      })

      const deleteData = await deleteResponse.json()
      
      if (deleteData.success) {
        console.log('✅ DELETE berhasil')
      } else {
        console.error('❌ DELETE failed:', deleteData.message)
      }

    } else {
      console.error('❌ POST failed:', postData.error)
    }

    console.log('\n🎉 Test TKDN API selesai!')

  } catch (error) {
    console.error('❌ Error testing API:', error.message)
  }
}

// Jalankan test
testTkdnApi()