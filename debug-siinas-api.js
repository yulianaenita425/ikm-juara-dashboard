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

async function debugSiinasApi() {
  console.log('🔍 Debugging SIINas API Response...\n')
  
  try {
    const result = await makeRequest('/api/siinas')
    
    console.log(`📊 Status: ${result.status}`)
    console.log('📋 Response Data:')
    console.log(JSON.stringify(result.data, null, 2))
    
    if (result.data.success && result.data.data) {
      console.log('\n🔍 Data Structure Analysis:')
      if (result.data.data.length > 0) {
        const sample = result.data.data[0]
        console.log('Sample record structure:')
        console.log(Object.keys(sample))
        
        if (sample.ikm_binaan) {
          console.log('\nIKM Binaan relation found:')
          console.log(Object.keys(sample.ikm_binaan))
        }
      } else {
        console.log('No data records found')
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

debugSiinasApi()