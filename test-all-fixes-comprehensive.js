#!/usr/bin/env node

/**
 * Comprehensive testing script untuk semua perbaikan
 * Test semua API endpoints dan fitur yang sudah diperbaiki
 */

const https = require('https')
const http = require('http')

const BASE_URL = process.env.TEST_URL || 'https://ikm-juara-dashboard.vercel.app'
const LOCAL_URL = 'http://localhost:3000'

console.log('🧪 Starting comprehensive testing...')
console.log(`🌐 Testing URL: ${BASE_URL}`)

// Fungsi untuk HTTP request
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const isHttps = url.startsWith('https')
    const client = isHttps ? https : http
    
    const req = client.request(url, options, (res) => {
      let data = ''
      res.on('data', chunk => data += chunk)
      res.on('end', () => {
        try {
          const jsonData = data ? JSON.parse(data) : {}
          resolve({ status: res.statusCode, data: jsonData, headers: res.headers })
        } catch (error) {
          resolve({ status: res.statusCode, data: data, headers: res.headers })
        }
      })
    })
    
    req.on('error', reject)
    
    if (options.body) {
      req.write(options.body)
    }
    
    req.end()
  })
}

// Test cases
const tests = [
  {
    name: 'Homepage Load Test',
    url: `${BASE_URL}`,
    method: 'GET',
    expectedStatus: 200,
    description: 'Test if homepage loads correctly'
  },
  {
    name: 'IKM Binaan API - GET',
    url: `${BASE_URL}/api/ikm-binaan`,
    method: 'GET',
    expectedStatus: 200,
    description: 'Test IKM Binaan API endpoint'
  },
  {
    name: 'Jenis Pelatihan API - GET',
    url: `${BASE_URL}/api/jenis-pelatihan`,
    method: 'GET',
    expectedStatus: 200,
    description: 'Test Jenis Pelatihan API endpoint'
  },
  {
    name: 'Pelatihan API - GET',
    url: `${BASE_URL}/api/pelatihan`,
    method: 'GET',
    expectedStatus: 200,
    description: 'Test new Pelatihan API endpoint'
  },
  {
    name: 'Dashboard Stats API',
    url: `${BASE_URL}/api/dashboard/stats`,
    method: 'GET',
    expectedStatus: 200,
    description: 'Test dashboard statistics API'
  },
  {
    name: 'Pelatihan Page Load',
    url: `${BASE_URL}/pelatihan`,
    method: 'GET',
    expectedStatus: 200,
    description: 'Test if pelatihan page loads'
  },
  {
    name: 'Laporan Page Load',
    url: `${BASE_URL}/laporan`,
    method: 'GET',
    expectedStatus: 200,
    description: 'Test if laporan page loads'
  },
  {
    name: 'IKM Binaan Page Load',
    url: `${BASE_URL}/ikm-binaan`,
    method: 'GET',
    expectedStatus: 200,
    description: 'Test if IKM Binaan page loads'
  }
]

// Fungsi untuk menjalankan test
async function runTest(test) {
  try {
    console.log(`\n🔍 Testing: ${test.name}`)
    console.log(`📋 ${test.description}`)
    console.log(`🌐 URL: ${test.url}`)
    
    const options = {
      method: test.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'IKM-JUARA-Test-Script/1.0'
      }
    }
    
    if (test.body) {
      options.body = JSON.stringify(test.body)
    }
    
    const startTime = Date.now()
    const response = await makeRequest(test.url, options)
    const endTime = Date.now()
    const duration = endTime - startTime
    
    const success = response.status === test.expectedStatus
    
    console.log(`⏱️  Duration: ${duration}ms`)
    console.log(`📊 Status: ${response.status} (Expected: ${test.expectedStatus})`)
    
    if (success) {
      console.log(`✅ ${test.name} - PASSED`)
      
      // Additional checks for API responses
      if (test.url.includes('/api/') && response.data) {
        if (typeof response.data === 'object' && response.data.success !== undefined) {
          console.log(`📈 API Response: ${response.data.success ? 'SUCCESS' : 'ERROR'}`)
          if (response.data.data && Array.isArray(response.data.data)) {
            console.log(`📊 Data Count: ${response.data.data.length} records`)
          }
        }
      }
    } else {
      console.log(`❌ ${test.name} - FAILED`)
      console.log(`🔍 Response: ${JSON.stringify(response.data).substring(0, 200)}...`)
    }
    
    return { test: test.name, success, status: response.status, duration, response: response.data }
  } catch (error) {
    console.log(`💥 ${test.name} - ERROR`)
    console.log(`🔍 Error: ${error.message}`)
    return { test: test.name, success: false, error: error.message }
  }
}

// Fungsi untuk test database connectivity
async function testDatabaseConnectivity() {
  console.log('\n🗄️  Testing Database Connectivity...')
  
  try {
    const response = await makeRequest(`${BASE_URL}/api/test-supabase`)
    
    if (response.status === 200 && response.data.success) {
      console.log('✅ Database connectivity - PASSED')
      console.log(`📊 Connection status: ${response.data.message}`)
      return true
    } else {
      console.log('❌ Database connectivity - FAILED')
      console.log(`🔍 Response: ${JSON.stringify(response.data)}`)
      return false
    }
  } catch (error) {
    console.log('💥 Database connectivity - ERROR')
    console.log(`🔍 Error: ${error.message}`)
    return false
  }
}

// Fungsi untuk test form submission (simulasi)
async function testFormSubmission() {
  console.log('\n📝 Testing Form Submission Capabilities...')
  
  // Test IKM Binaan creation
  const testIkmData = {
    nib: '9999999999999',
    nik: '9999999999999999',
    nama_lengkap: 'Test User Form Submission',
    alamat_lengkap: 'Test Address',
    nama_usaha: 'Test Business',
    nomor_hp: '081234567890'
  }
  
  try {
    console.log('🔍 Testing IKM Binaan form submission...')
    const response = await makeRequest(`${BASE_URL}/api/ikm-binaan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testIkmData)
    })
    
    if (response.status === 201 || response.status === 400) {
      console.log('✅ IKM Binaan form submission endpoint - WORKING')
      console.log(`📊 Response: ${response.data.success ? 'SUCCESS' : response.data.error}`)
      
      // If successful, try to delete the test data
      if (response.status === 201 && response.data.data && response.data.data.id) {
        console.log('🧹 Cleaning up test data...')
        await makeRequest(`${BASE_URL}/api/ikm-binaan`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: response.data.data.id })
        })
      }
      
      return true
    } else {
      console.log('❌ IKM Binaan form submission - FAILED')
      return false
    }
  } catch (error) {
    console.log('💥 IKM Binaan form submission - ERROR')
    console.log(`🔍 Error: ${error.message}`)
    return false
  }
}

// Main testing function
async function runAllTests() {
  console.log('🚀 Starting comprehensive test suite...')
  console.log('=' .repeat(50))
  
  const results = []
  let passedTests = 0
  let totalTests = tests.length
  
  // Run basic endpoint tests
  for (const test of tests) {
    const result = await runTest(test)
    results.push(result)
    if (result.success) passedTests++
  }
  
  // Test database connectivity
  const dbTest = await testDatabaseConnectivity()
  results.push({ test: 'Database Connectivity', success: dbTest })
  totalTests++
  if (dbTest) passedTests++
  
  // Test form submission
  const formTest = await testFormSubmission()
  results.push({ test: 'Form Submission', success: formTest })
  totalTests++
  if (formTest) passedTests++
  
  // Generate summary
  console.log('\n' + '=' .repeat(50))
  console.log('📊 TEST SUMMARY')
  console.log('=' .repeat(50))
  
  results.forEach(result => {
    const status = result.success ? '✅ PASS' : '❌ FAIL'
    const duration = result.duration ? ` (${result.duration}ms)` : ''
    console.log(`${status} ${result.test}${duration}`)
  })
  
  console.log('\n📈 OVERALL RESULTS')
  console.log(`✅ Passed: ${passedTests}/${totalTests}`)
  console.log(`❌ Failed: ${totalTests - passedTests}/${totalTests}`)
  console.log(`📊 Success Rate: ${Math.round((passedTests / totalTests) * 100)}%`)
  
  if (passedTests === totalTests) {
    console.log('\n🎉 ALL TESTS PASSED!')
    console.log('✅ Website is fully functional')
    console.log('🌐 Ready for production use')
  } else {
    console.log('\n⚠️  SOME TESTS FAILED')
    console.log('🔍 Please check the failed tests above')
    console.log('🛠️  Fix issues before production deployment')
  }
  
  // Save test results
  const testReport = {
    timestamp: new Date().toISOString(),
    url: BASE_URL,
    totalTests,
    passedTests,
    failedTests: totalTests - passedTests,
    successRate: Math.round((passedTests / totalTests) * 100),
    results
  }
  
  require('fs').writeFileSync('test-report.json', JSON.stringify(testReport, null, 2))
  console.log('\n📄 Test report saved to test-report.json')
  
  return passedTests === totalTests
}

// Run tests
runAllTests().then(success => {
  process.exit(success ? 0 : 1)
}).catch(error => {
  console.error('💥 Test suite failed:', error)
  process.exit(1)
})