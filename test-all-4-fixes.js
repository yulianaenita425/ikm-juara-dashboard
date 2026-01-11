// Test semua 4 perbaikan kritis
console.log('🧪 TESTING ALL 4 CRITICAL FIXES')
console.log('='.repeat(50))

async function testAllFixes() {
  const baseUrl = 'https://ikm-juara-dashboard.vercel.app'
  
  console.log('1. 🔧 Testing TKDN Percentage Fix...')
  try {
    const tkdnResponse = await fetch(`${baseUrl}/api/tkdn-ik`)
    const tkdnResult = await tkdnResponse.json()
    
    if (tkdnResponse.ok && tkdnResult.success) {
      console.log('   ✅ TKDN API working')
      console.log(`   📊 Found ${tkdnResult.data.length} TKDN records`)
      
      // Test if persentase_tkdn field exists
      if (tkdnResult.data.length > 0) {
        const hasPersentase = tkdnResult.data[0].hasOwnProperty('persentase_tkdn')
        console.log(`   ${hasPersentase ? '✅' : '❌'} persentase_tkdn field: ${hasPersentase ? 'EXISTS' : 'MISSING'}`)
      }
    } else {
      console.log('   ❌ TKDN API failed:', tkdnResult.error)
    }
  } catch (error) {
    console.log('   ❌ TKDN API error:', error.message)
  }
  
  console.log('\n2. 💾 Testing Pelatihan Data Persistence...')
  try {
    const pelatihanResponse = await fetch(`${baseUrl}/api/pelatihan`)
    const pelatihanResult = await pelatihanResponse.json()
    
    if (pelatihanResponse.ok && pelatihanResult.success) {
      console.log('   ✅ Pelatihan API working')
      console.log(`   📊 Found ${pelatihanResult.data.length} pelatihan records`)
      
      // Test jenis pelatihan integration
      const jenisResponse = await fetch(`${baseUrl}/api/jenis-pelatihan`)
      const jenisResult = await jenisResponse.json()
      
      if (jenisResponse.ok && jenisResult.success) {
        console.log('   ✅ Jenis Pelatihan API working')
        console.log(`   📊 Found ${jenisResult.data.length} jenis pelatihan`)
      }
    } else {
      console.log('   ❌ Pelatihan API failed:', pelatihanResult.error)
    }
  } catch (error) {
    console.log('   ❌ Pelatihan API error:', error.message)
  }
  
  console.log('\n3. 🔍 Testing Penelusuran Data Accuracy...')
  try {
    const ikmResponse = await fetch(`${baseUrl}/api/ikm-binaan`)
    const ikmResult = await ikmResponse.json()
    
    if (ikmResponse.ok && ikmResult.success) {
      console.log('   ✅ IKM Binaan API working')
      console.log(`   📊 Found ${ikmResult.data.length} IKM records`)
      
      // Check for NIB 1909210016219
      const targetNib = '1909210016219'
      const targetIkm = ikmResult.data.find(ikm => ikm.nib === targetNib)
      
      if (targetIkm) {
        console.log(`   ✅ NIB ${targetNib} found`)
        console.log(`   👤 Name: ${targetIkm.nama_lengkap}`)
        console.log(`   🏢 Business: ${targetIkm.nama_usaha}`)
        
        if (targetIkm.nama_lengkap === 'HERLIN PURNAWATI') {
          console.log('   ✅ Correct data displayed')
        } else {
          console.log('   ❌ Wrong data - should be HERLIN PURNAWATI')
        }
      } else {
        console.log(`   ❌ NIB ${targetNib} not found`)
      }
    } else {
      console.log('   ❌ IKM Binaan API failed:', ikmResult.error)
    }
  } catch (error) {
    console.log('   ❌ IKM Binaan API error:', error.message)
  }
  
  console.log('\n4. 🥗 Testing Sertifikat Halal Save...')
  try {
    const sertifikatResponse = await fetch(`${baseUrl}/api/sertifikat-halal`)
    const sertifikatResult = await sertifikatResponse.json()
    
    if (sertifikatResponse.ok && sertifikatResult.success) {
      console.log('   ✅ Sertifikat Halal API working')
      console.log(`   📊 Found ${sertifikatResult.data.length} sertifikat records`)
      
      // Test if logo_halal field exists
      if (sertifikatResult.data.length > 0) {
        const hasLogoHalal = sertifikatResult.data[0].hasOwnProperty('logo_halal')
        console.log(`   ${hasLogoHalal ? '✅' : '❌'} logo_halal field: ${hasLogoHalal ? 'EXISTS' : 'MISSING'}`)
      }
    } else {
      console.log('   ❌ Sertifikat Halal API failed:', sertifikatResult.error)
    }
  } catch (error) {
    console.log('   ❌ Sertifikat Halal API error:', error.message)
  }
  
  console.log('\n' + '='.repeat(50))
  console.log('🎯 TESTING SUMMARY:')
  console.log('1. TKDN Percentage - Check API response')
  console.log('2. Pelatihan Persistence - Check form behavior')
  console.log('3. Penelusuran Accuracy - Check NIB 1909210016219')
  console.log('4. Sertifikat Halal Save - Check form submission')
  
  console.log('\n📋 NEXT STEPS:')
  console.log('1. Execute SQL fix for TKDN schema in Supabase')
  console.log('2. Test form persistence manually')
  console.log('3. Verify penelusuran shows correct data')
  console.log('4. Test sertifikat halal form submission')
  console.log('5. Deploy all fixes to production')
  
  return {
    status: 'TESTING_COMPLETE',
    timestamp: new Date().toISOString()
  }
}

testAllFixes().then(result => {
  console.log('\n🎉 TESTING RESULT:', result)
})