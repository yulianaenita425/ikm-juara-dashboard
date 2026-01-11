// Test untuk melihat apakah ada duplikasi di tampilan dashboard
// Menggunakan Puppeteer untuk test browser

const puppeteer = require('puppeteer')

async function testDashboardDisplay() {
  console.log('🔍 TESTING DASHBOARD DISPLAY...\n')
  
  let browser
  try {
    browser = await puppeteer.launch({ 
      headless: false, // Set true untuk headless mode
      defaultViewport: { width: 1280, height: 720 }
    })
    
    const page = await browser.newPage()
    
    // Navigate to login page
    console.log('📱 Navigating to login page...')
    await page.goto('http://localhost:3001/login')
    
    // Login as admin
    console.log('🔐 Logging in as admin...')
    await page.type('input[name="username"]', 'admin')
    await page.type('input[name="password"]', 'admin123')
    await page.click('button[type="submit"]')
    
    // Wait for dashboard to load
    console.log('⏳ Waiting for dashboard to load...')
    await page.waitForNavigation()
    await page.waitForSelector('.grid', { timeout: 10000 })
    
    // Extract dashboard stats
    console.log('📊 Extracting dashboard statistics...')
    
    const stats = await page.evaluate(() => {
      const statCards = document.querySelectorAll('.grid .bg-white.rounded-lg.shadow')
      const results = []
      
      statCards.forEach((card, index) => {
        const nameElement = card.querySelector('.text-sm.font-medium.text-gray-600')
        const valueElement = card.querySelector('.text-2xl.font-bold.text-gray-900')
        
        if (nameElement && valueElement) {
          results.push({
            index: index + 1,
            name: nameElement.textContent.trim(),
            value: valueElement.textContent.trim()
          })
        }
      })
      
      return results
    })
    
    console.log('📋 DASHBOARD STATISTICS FOUND:')
    stats.forEach(stat => {
      console.log(`   ${stat.index}. ${stat.name}: ${stat.value}`)
    })
    
    // Check for duplicates
    console.log('\n🔍 CHECKING FOR DUPLICATES:')
    const names = stats.map(s => s.name)
    const duplicateNames = names.filter((name, index) => names.indexOf(name) !== index)
    
    if (duplicateNames.length > 0) {
      console.log('❌ DUPLICATE STATISTICS FOUND:')
      duplicateNames.forEach(name => {
        console.log(`   - ${name}`)
      })
    } else {
      console.log('✅ No duplicate statistics found')
    }
    
    // Check layanan stats in sidebar
    console.log('\n📋 CHECKING LAYANAN STATS IN SIDEBAR:')
    
    const layananStats = await page.evaluate(() => {
      const layananSection = document.querySelector('.bg-white.rounded-lg.shadow')
      if (!layananSection) return []
      
      const layananItems = layananSection.querySelectorAll('.flex.justify-between.items-center')
      const results = []
      
      layananItems.forEach(item => {
        const nameElement = item.querySelector('.text-sm.font-medium.text-gray-700')
        const valueElement = item.querySelector('.text-lg.font-semibold.text-blue-600')
        
        if (nameElement && valueElement) {
          results.push({
            name: nameElement.textContent.trim(),
            value: valueElement.textContent.trim()
          })
        }
      })
      
      return results
    })
    
    layananStats.forEach(layanan => {
      console.log(`   ${layanan.name}: ${layanan.value}`)
    })
    
    // Compare with API data
    console.log('\n🔄 COMPARING WITH API DATA:')
    
    const apiResponse = await page.evaluate(async () => {
      const response = await fetch('/api/dashboard/stats')
      return await response.json()
    })
    
    console.log(`   API IKM Binaan: ${apiResponse.totalIkmBinaan.current}`)
    console.log(`   API HKI Merek: ${apiResponse.layananStats?.find(l => l.name === 'HKI Merek')?.total || 0}`)
    
    // Find IKM Binaan stat from dashboard
    const ikmStat = stats.find(s => s.name === 'Total IKM Binaan')
    const hkiStat = stats.find(s => s.name === 'HKI Merek')
    
    console.log('\n🎯 CONSISTENCY CHECK:')
    if (ikmStat) {
      const dashboardIkm = parseInt(ikmStat.value)
      const apiIkm = apiResponse.totalIkmBinaan.current
      console.log(`   IKM Binaan: Dashboard=${dashboardIkm}, API=${apiIkm} ${dashboardIkm === apiIkm ? '✅' : '❌'}`)
    }
    
    if (hkiStat) {
      const dashboardHki = parseInt(hkiStat.value)
      const apiHki = apiResponse.layananStats?.find(l => l.name === 'HKI Merek')?.total || 0
      console.log(`   HKI Merek: Dashboard=${dashboardHki}, API=${apiHki} ${dashboardHki === apiHki ? '✅' : '❌'}`)
    }
    
    console.log('\n🎉 DASHBOARD TEST COMPLETED!')
    
  } catch (error) {
    console.error('❌ Error during dashboard test:', error.message)
  } finally {
    if (browser) {
      await browser.close()
    }
  }
}

// Run if called directly
if (require.main === module) {
  testDashboardDisplay()
}

module.exports = { testDashboardDisplay }