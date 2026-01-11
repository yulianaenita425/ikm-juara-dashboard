// Test script to add NIB 1909210016219 via API
async function testAddIkm() {
  const baseUrl = 'http://localhost:3000'
  
  try {
    // Add IKM Binaan
    console.log('Adding IKM Binaan with NIB 1909210016219...')
    
    const ikmData = {
      nib: '1909210016219',
      nik: '3573012345678905',
      nama_lengkap: 'Rina Sari',
      alamat_lengkap: 'Jl. Ahmad Yani No. 45, Kelurahan Demangan, Kota Madiun',
      nama_usaha: 'CV. Makmur Sejahtera',
      nomor_hp: '081234567894'
    }

    const ikmResponse = await fetch(`${baseUrl}/api/ikm-binaan`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(ikmData)
    })

    const ikmResult = await ikmResponse.json()
    console.log('IKM Binaan result:', ikmResult)

    if (ikmResult.success) {
      const ikmId = ikmResult.data.id
      console.log('IKM ID:', ikmId)

      // Add HKI Merek
      console.log('Adding HKI Merek...')
      const hkiData = {
        ikm_id: ikmId,
        nomor_pendaftaran: 'HKI-2024-005',
        link_bukti_daftar: 'https://drive.google.com/file/d/hki005/view',
        status_sertifikat: 'Telah Didaftar',
        tahun_fasilitasi: 2024,
        link_sertifikat: 'https://drive.google.com/file/d/hki005cert/view'
      }

      const hkiResponse = await fetch(`${baseUrl}/api/hki-merek`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(hkiData)
      })

      const hkiResult = await hkiResponse.json()
      console.log('HKI Merek result:', hkiResult)

      // Add Sertifikat Halal
      console.log('Adding Sertifikat Halal...')
      const halalData = {
        ikm_id: ikmId,
        nomor_sertifikat: 'HALAL-2024-005',
        link_sertifikat: 'https://drive.google.com/file/d/halal005/view',
        tahun_fasilitasi: 2024
      }

      const halalResponse = await fetch(`${baseUrl}/api/sertifikat-halal`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(halalData)
      })

      const halalResult = await halalResponse.json()
      console.log('Sertifikat Halal result:', halalResult)

      console.log('All data successfully added for NIB 1909210016219')
    }

  } catch (error) {
    console.error('Error:', error)
  }
}

// Run the test
testAddIkm()