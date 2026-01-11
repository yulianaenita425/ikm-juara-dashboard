const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')

// Baca environment variables dari .env.local
let envVars = {}
try {
  const envContent = fs.readFileSync('.env.local', 'utf8')
  envContent.split('\n').forEach(line => {
    if (line.includes('=')) {
      const [key, value] = line.split('=')
      envVars[key.trim()] = value.trim()
    }
  })
} catch (err) {
  console.error('Error reading .env.local:', err.message)
  process.exit(1)
}

const supabase = createClient(
  envVars.NEXT_PUBLIC_SUPABASE_URL,
  envVars.SUPABASE_SERVICE_ROLE_KEY
)

async function checkAllTableData() {
  console.log('📊 Checking data in all tables...\n')
  
  const tables = [
    'ikm_binaan',
    'hki_merek', 
    'sertifikat_halal',
    'tkdn_ik',
    'siinas',
    'uji_nilai_gizi',
    'kurasi_produk',
    'pelatihan',
    'buku_tamu'
  ]
  
  const results = {}
  
  for (const table of tables) {
    try {
      const { data, error, count } = await supabase
        .from(table)
        .select('*', { count: 'exact' })
        .is('deleted_at', null)
      
      if (error) {
        console.log(`❌ ${table}: Error - ${error.message}`)
        results[table] = 0
      } else {
        console.log(`📋 ${table}: ${count || data.length} records`)
        results[table] = count || data.length
        
        // Tampilkan sample data jika ada
        if (data && data.length > 0) {
          console.log(`   Sample: ${JSON.stringify(data[0], null, 2).substring(0, 100)}...`)
        }
      }
    } catch (err) {
      console.log(`❌ ${table}: Exception - ${err.message}`)
      results[table] = 0
    }
    console.log('')
  }
  
  // Summary
  console.log('📊 SUMMARY:')
  console.log('='.repeat(50))
  Object.entries(results).forEach(([table, count]) => {
    console.log(`${table.padEnd(20)}: ${count} records`)
  })
  
  // Calculate totals for dashboard
  const totalIkm = results.ikm_binaan || 0
  const totalLayanan = (results.hki_merek || 0) + 
                      (results.sertifikat_halal || 0) + 
                      (results.tkdn_ik || 0) + 
                      (results.siinas || 0) + 
                      (results.uji_nilai_gizi || 0) + 
                      (results.kurasi_produk || 0)
  const totalPelatihan = results.pelatihan || 0
  
  console.log('\n🎯 DASHBOARD CALCULATIONS:')
  console.log(`Total IKM Binaan: ${totalIkm}`)
  console.log(`Total Layanan IKM Juara: ${totalLayanan}`)
  console.log(`Total Pelatihan: ${totalPelatihan}`)
  
  return results
}

checkAllTableData()