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

async function addTestData() {
  console.log('🧪 Adding test data for layanan services...\n')
  
  try {
    // Get IKM Binaan IDs first
    const { data: ikmData, error: ikmError } = await supabase
      .from('ikm_binaan')
      .select('id, nama_lengkap, nama_usaha')
      .limit(3)
    
    if (ikmError) throw ikmError
    
    if (ikmData.length === 0) {
      console.log('❌ No IKM Binaan data found. Please add IKM Binaan first.')
      return
    }
    
    console.log(`📋 Found ${ikmData.length} IKM Binaan records`)
    
    // Add TKDN IK data
    console.log('📊 Adding TKDN IK test data...')
    const tkdnData = [
      {
        ikm_id: ikmData[0].id,
        nomor_sertifikat: 'TKDN-2024-001',
        link_sertifikat: 'https://drive.google.com/file/d/tkdn001/view',
        tahun_terbit: 2024
      }
    ]
    
    const { data: tkdnResult, error: tkdnError } = await supabase
      .from('tkdn_ik')
      .insert(tkdnData)
      .select()
    
    if (tkdnError) {
      console.log('❌ Error adding TKDN IK:', tkdnError.message)
    } else {
      console.log('✅ Added 1 TKDN IK record')
    }
    
    // Add SIINas data
    console.log('📊 Adding SIINas test data...')
    const siinasData = [
      {
        ikm_id: ikmData[0].id,
        nomor_bukti_akun: 'SIINAS-2024-001',
        tahun_registrasi: 2024,
        link_bukti: 'https://drive.google.com/file/d/siinas001/view'
      },
      {
        ikm_id: ikmData[1].id,
        nomor_bukti_akun: 'SIINAS-2024-002', 
        tahun_registrasi: 2024,
        link_bukti: 'https://drive.google.com/file/d/siinas002/view'
      }
    ]
    
    const { data: siinasResult, error: siinasError } = await supabase
      .from('siinas')
      .insert(siinasData)
      .select()
    
    if (siinasError) {
      console.log('❌ Error adding SIINas:', siinasError.message)
    } else {
      console.log('✅ Added 2 SIINas records')
    }
    
    // Add Uji Nilai Gizi data
    console.log('📊 Adding Uji Nilai Gizi test data...')
    const ujiData = [
      {
        ikm_id: ikmData[0].id,
        nomor_lhu: 'LHU-2024-001',
        tanggal_hasil_uji: '2024-01-15',
        tahun_fasilitasi: 2024,
        link_lhu: 'https://drive.google.com/file/d/lhu001/view'
      }
    ]
    
    const { data: ujiResult, error: ujiError } = await supabase
      .from('uji_nilai_gizi')
      .insert(ujiData)
      .select()
    
    if (ujiError) {
      console.log('❌ Error adding Uji Nilai Gizi:', ujiError.message)
    } else {
      console.log('✅ Added 1 Uji Nilai Gizi record')
    }
    
    // Add Kurasi Produk data
    console.log('📊 Adding Kurasi Produk test data...')
    const kurasiData = [
      {
        ikm_id: ikmData[1].id,
        nomor_sertifikat: 'KURASI-2024-001',
        link_sertifikat: 'https://drive.google.com/file/d/kurasi001/view'
      },
      {
        ikm_id: ikmData[2].id,
        nomor_sertifikat: 'KURASI-2024-002',
        link_sertifikat: 'https://drive.google.com/file/d/kurasi002/view'
      }
    ]
    
    const { data: kurasiResult, error: kurasiError } = await supabase
      .from('kurasi_produk')
      .insert(kurasiData)
      .select()
    
    if (kurasiError) {
      console.log('❌ Error adding Kurasi Produk:', kurasiError.message)
    } else {
      console.log('✅ Added 2 Kurasi Produk records')
    }
    
    console.log('\n🎉 Test data added successfully!')
    console.log('📊 Summary:')
    console.log('   - TKDN IK: 1 record')
    console.log('   - SIINas: 2 records') 
    console.log('   - Uji Nilai Gizi: 1 record')
    console.log('   - Kurasi Produk: 2 records')
    
  } catch (error) {
    console.error('❌ Error adding test data:', error)
  }
}

addTestData()