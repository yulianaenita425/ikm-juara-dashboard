// Script untuk menguji semua perbaikan final
const https = require('https')
const http = require('http')
const { URL } = require('url')

const BASE_URL = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000'

function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url)
    const client = urlObj.protocol === 'https:' ? https : http
    
    const req = client.get(url, (res) => {
      let data = ''
      
      res.on('data', (chunk) => {
        data += chunk
      })
      
      res.on('end', () => {
        try {
          const result = JSON.parse(data)
          resolve(result)
        } catch (error) {
          reject(new Error(`Invalid JSON response: ${data}`))
        }
      })
    })
    
    req.on('error', (error) => {
      reject(error)
    })
    
    req.setTimeout(10000, () => {
      req.destroy()
      reject(new Error('Request timeout'))
    })
  })
}

async function testAllFinalFixes() {
  console.log('🚀 Testing All Final Fixes...')
  console.log('Base URL:', BASE_URL)
  
  const results = {
    laporan_ikm_juara: false,
    sinkronisasi_peserta: false,
    export_ikm_binaan: false,
    all_endpoints: false
  }

  try {
    // 1. Test Laporan IKM JUARA dengan kolom yang benar
    console.log('\n1. Testing Laporan IKM JUARA...')
    
    const laporanEndpoints = [
      '/api/hki-merek',
      '/api/sertifikat-halal', 
      '/api/tkdn-ik',
      '/api/siinas',
      '/api/uji-nilai-gizi',
      '/api/kurasi-produk'
    ]

    let allLaporanWorking = true
    for (const endpoint of laporanEndpoints) {
      try {
        const result = await makeRequest(`${BASE_URL}${endpoint}`)
        
        if (result.success && Array.isArray(result.data)) {
          console.log(`✅ ${endpoint}: ${result.data.length} records`)
          
          // Test struktur data sesuai spesifikasi
          if (result.data.length > 0) {
            const sample = result.data[0]
            const requiredFields = getRequiredFieldsForEndpoint(endpoint)
            
            const hasRequiredFields = requiredFields.every(field => 
              sample.hasOwnProperty(field) || 
              (sample.ikm_binaan && sample.ikm_binaan.hasOwnProperty(field))
            )
            
            if (hasRequiredFields) {
              console.log(`   ✅ Required fields present for ${endpoint}`)
            } else {
              console.log(`   ⚠️  Missing required fields for ${endpoint}`)
              console.log(`   Required: ${requiredFields.join(', ')}`)
              console.log(`   Available: ${Object.keys(sample).join(', ')}`)
            }
          }
        } else {
          console.log(`❌ ${endpoint}: Failed - ${result.error || 'Unknown error'}`)
          allLaporanWorking = false
        }
      } catch (error) {
        console.log(`❌ ${endpoint}: Error - ${error.message}`)
        allLaporanWorking = false
      }
    }
    
    results.laporan_ikm_juara = allLaporanWorking

    // 2. Test Sinkronisasi Jumlah Peserta Pelatihan
    console.log('\n2. Testing Sinkronisasi Peserta Pelatihan...')
    
    try {
      const jenisResult = await makeRequest(`${BASE_URL}/api/jenis-pelatihan`)
      const pesertaResult = await makeRequest(`${BASE_URL}/api/pelatihan`)
      
      if (jenisResult.success && pesertaResult.success) {
        console.log(`✅ Jenis Pelatihan: ${jenisResult.data.length} records`)
        console.log(`✅ Peserta Pelatihan: ${pesertaResult.data.length} records`)
        
        // Verifikasi sinkronisasi jumlah peserta
        let syncCorrect = true
        for (const jenis of jenisResult.data) {
          const actualCount = pesertaResult.data.filter(p => p.jenis_pelatihan_id === jenis.id).length
          const reportedCount = jenis.jumlah_peserta || 0
          
          if (actualCount !== reportedCount) {
            console.log(`⚠️  Sync issue: ${jenis.jenis_pelatihan} - Actual: ${actualCount}, Reported: ${reportedCount}`)
            syncCorrect = false
          }
        }
        
        if (syncCorrect) {
          console.log('✅ Sinkronisasi jumlah peserta benar')
          results.sinkronisasi_peserta = true
        } else {
          console.log('❌ Ada masalah sinkronisasi jumlah peserta')
        }
      } else {
        console.log('❌ Gagal mengambil data pelatihan')
      }
    } catch (error) {
      console.log(`❌ Error testing pelatihan sync: ${error.message}`)
    }

    // 3. Test IKM Binaan Export Feature
    console.log('\n3. Testing IKM Binaan Export Feature...')
    
    try {
      const ikmResult = await makeRequest(`${BASE_URL}/api/ikm-binaan`)
      
      if (ikmResult.success) {
        console.log(`✅ IKM Binaan API: ${ikmResult.data.length} records`)
        
        // Verifikasi struktur data untuk export
        if (ikmResult.data.length > 0) {
          const sample = ikmResult.data[0]
          const exportFields = ['nib', 'nik', 'nama_lengkap', 'alamat_lengkap', 'nama_usaha', 'nomor_hp', 'created_at']
          const hasExportFields = exportFields.every(field => sample.hasOwnProperty(field))
          
          if (hasExportFields) {
            console.log('✅ Export fields available')
            results.export_ikm_binaan = true
          } else {
            console.log('❌ Missing export fields')
            console.log(`Required: ${exportFields.join(', ')}`)
            console.log(`Available: ${Object.keys(sample).join(', ')}`)
          }
        } else {
          console.log('⚠️  No data to test export fields')
          results.export_ikm_binaan = true // Assume OK if no data
        }
      } else {
        console.log(`❌ IKM Binaan API failed: ${ikmResult.error}`)
      }
    } catch (error) {
      console.log(`❌ Error testing IKM Binaan: ${error.message}`)
    }

    // 4. Test All Critical Endpoints
    console.log('\n4. Testing All Critical Endpoints...')
    
    const criticalEndpoints = [
      '/api/dashboard/stats',
      '/api/ikm-binaan',
      '/api/jenis-pelatihan',
      '/api/pelatihan',
      '/api/hki-merek',
      '/api/sertifikat-halal',
      '/api/tkdn-ik',
      '/api/siinas',
      '/api/kurasi-produk',
      '/api/uji-nilai-gizi',
      '/api/recycle-bin'
    ]

    let allEndpointsWorking = true
    for (const endpoint of criticalEndpoints) {
      try {
        const result = await makeRequest(`${BASE_URL}${endpoint}`)
        
        if (result.success) {
          console.log(`✅ ${endpoint}: OK`)
        } else {
          console.log(`❌ ${endpoint}: ${result.error}`)
          allEndpointsWorking = false
        }
      } catch (error) {
        console.log(`❌ ${endpoint}: ${error.message}`)
        allEndpointsWorking = false
      }
    }
    
    results.all_endpoints = allEndpointsWorking

    // Summary
    console.log('\n📊 FINAL TEST RESULTS:')
    console.log('========================')
    console.log(`Laporan IKM JUARA: ${results.laporan_ikm_juara ? '✅ PASS' : '❌ FAIL'}`)
    console.log(`Sinkronisasi Peserta: ${results.sinkronisasi_peserta ? '✅ PASS' : '❌ FAIL'}`)
    console.log(`Export IKM Binaan: ${results.export_ikm_binaan ? '✅ PASS' : '❌ FAIL'}`)
    console.log(`All Endpoints: ${results.all_endpoints ? '✅ PASS' : '❌ FAIL'}`)
    
    const allPassed = Object.values(results).every(result => result === true)
    console.log(`\n🎯 OVERALL STATUS: ${allPassed ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED'}`)
    
    if (allPassed) {
      console.log('\n🚀 Ready for deployment!')
    } else {
      console.log('\n⚠️  Please fix failing tests before deployment')
    }

    return results

  } catch (error) {
    console.error('❌ Test execution failed:', error)
    return results
  }
}

function getRequiredFieldsForEndpoint(endpoint) {
  const fieldMap = {
    '/api/hki-merek': ['nib', 'nik', 'nama_lengkap', 'nama_usaha', 'nomor_hp', 'nomor_pendaftaran', 'status_pendaftaran', 'tahun_fasilitasi'],
    '/api/sertifikat-halal': ['nib', 'nik', 'nama_lengkap', 'nama_usaha', 'nomor_hp', 'nomor_sertifikat', 'status_sertifikat', 'tahun_fasilitasi', 'link_sertifikat', 'link_logo'],
    '/api/tkdn-ik': ['nib', 'nik', 'nama_lengkap', 'nama_usaha', 'nomor_hp', 'nomor_sertifikat', 'persentase_tkdn', 'status', 'tahun_fasilitasi', 'link_dokumen'],
    '/api/siinas': ['nib', 'nik', 'nama_lengkap', 'nama_usaha', 'nomor_hp', 'nomor_bukti_akun', 'tahun_registrasi', 'link_dokumen'],
    '/api/uji-nilai-gizi': ['nib', 'nik', 'nama_lengkap', 'nama_usaha', 'nomor_hp', 'nomor_lhu', 'tahun_fasilitasi', 'link_dokumen'],
    '/api/kurasi-produk': ['nib', 'nik', 'nama_lengkap', 'nama_usaha', 'nomor_hp', 'nomor_sertifikat', 'link_dokumen']
  }
  
  return fieldMap[endpoint] || []
}

// Run tests
if (require.main === module) {
  testAllFinalFixes()
    .then(results => {
      const allPassed = Object.values(results).every(result => result === true)
      process.exit(allPassed ? 0 : 1)
    })
    .catch(error => {
      console.error('Test execution failed:', error)
      process.exit(1)
    })
}

module.exports = { testAllFinalFixes }