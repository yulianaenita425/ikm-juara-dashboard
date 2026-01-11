const http = require('http')

function makeRequest(path) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }

    const req = http.request(options, (res) => {
      let data = ''
      
      res.on('data', (chunk) => {
        data += chunk
      })
      
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data)
          resolve({ status: res.statusCode, data: jsonData })
        } catch (err) {
          resolve({ status: res.statusCode, data: data })
        }
      })
    })

    req.on('error', (err) => {
      reject(err)
    })

    req.end()
  })
}

async function testDisplayFix() {
  console.log('🧪 Testing Display Fix for All Layanan APIs...\n')
  
  const apis = [
    { name: 'TKDN IK', path: '/api/tkdn-ik' },
    { name: 'SIINas', path: '/api/siinas' },
    { name: 'Uji Nilai Gizi', path: '/api/uji-nilai-gizi' },
    { name: 'Kurasi Produk', path: '/api/kurasi-produk' }
  ]
  
  for (const api of apis) {
    try {
      console.log(`📊 Testing ${api.name} API...`)
      const result = await makeRequest(api.path)
      
      if (result.status === 200 && result.data.success) {
        const data = result.data.data
        console.log(`   ✅ ${api.name} - SUCCESS (${data.length} records)`)
        
        if (data.length > 0) {
          const sample = data[0]
          const hasIkmBinaan = sample.ikm_binaan ? true : false
          const hasNib = sample.ikm_binaan?.nib ? true : false
          const hasNik = sample.ikm_binaan?.nik ? true : false
          const hasNama = sample.ikm_binaan?.nama_lengkap ? true : false
          
          console.log(`   📋 IKM Binaan relation: ${hasIkmBinaan ? '✅' : '❌'}`)
          console.log(`   📋 NIB available: ${hasNib ? '✅' : '❌'}`)
          console.log(`   📋 NIK available: ${hasNik ? '✅' : '❌'}`)
          console.log(`   📋 Nama available: ${hasNama ? '✅' : '❌'}`)
          
          if (hasNib && hasNik && hasNama) {
            console.log(`   🎉 ${api.name} - All data fields available!`)
          }
        }
      } else {
        console.log(`   ❌ ${api.name} - ERROR: ${result.data.message || 'Unknown error'}`)
      }
    } catch (error) {
      console.log(`   ❌ ${api.name} - EXCEPTION: ${error.message}`)
    }
    console.log('')
  }
  
  console.log('🎯 SUMMARY:')
  console.log('All layanan APIs should now return complete IKM Binaan data including NIB, NIK, and names.')
  console.log('The table displays should show proper data instead of empty fields.')
}

testDisplayFix()