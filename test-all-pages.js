const http = require('http')

function makeRequest(path) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: 'GET',
      headers: {
        'Content-Type': 'text/html'
      }
    }

    const req = http.request(options, (res) => {
      let data = ''
      
      res.on('data', (chunk) => {
        data += chunk
      })
      
      res.on('end', () => {
        resolve({ 
          status: res.statusCode, 
          data: data,
          hasError: data.includes('Unhandled Runtime Error') || data.includes('TypeError')
        })
      })
    })

    req.on('error', (err) => {
      reject(err)
    })

    req.setTimeout(10000, () => {
      req.destroy()
      reject(new Error('Request timeout'))
    })

    req.end()
  })
}

async function testAllPages() {
  console.log('🧪 Testing All Pages for Errors...\n')
  
  const pages = [
    '/',
    '/website-preview',
    '/demo-interactive',
    '/fast-preview',
    '/login',
    '/ikm-binaan',
    '/layanan/hki-merek',
    '/layanan/sertifikat-halal',
    '/layanan/tkdn-ik',
    '/layanan/siinas',
    '/layanan/uji-nilai-gizi',
    '/layanan/kurasi-produk',
    '/pelatihan',
    '/penelusuran',
    '/laporan',
    '/recycle-bin'
  ]
  
  let totalPages = pages.length
  let successCount = 0
  let errorCount = 0
  
  for (const page of pages) {
    try {
      console.log(`📄 Testing ${page}...`)
      const result = await makeRequest(page)
      
      if (result.status === 200) {
        if (result.hasError) {
          console.log(`   ❌ ${page} - Has Runtime Error`)
          errorCount++
        } else {
          console.log(`   ✅ ${page} - OK`)
          successCount++
        }
      } else {
        console.log(`   ⚠️  ${page} - Status ${result.status}`)
        errorCount++
      }
    } catch (error) {
      console.log(`   ❌ ${page} - Exception: ${error.message}`)
      errorCount++
    }
  }
  
  console.log('\n📊 SUMMARY:')
  console.log('='.repeat(50))
  console.log(`✅ Success: ${successCount}/${totalPages} pages`)
  console.log(`❌ Errors: ${errorCount}/${totalPages} pages`)
  console.log(`📈 Success Rate: ${((successCount/totalPages)*100).toFixed(1)}%`)
  
  if (errorCount === 0) {
    console.log('\n🎉 ALL PAGES WORKING PERFECTLY!')
  } else {
    console.log(`\n⚠️  ${errorCount} pages need attention`)
  }
}

testAllPages()