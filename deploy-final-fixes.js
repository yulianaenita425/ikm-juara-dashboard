// Script untuk deploy semua perbaikan ke Vercel
console.log('🚀 Deploying final fixes to Vercel...')

const { execSync } = require('child_process')

async function deployToVercel() {
  console.log('\n📋 RINGKASAN PERBAIKAN YANG TELAH DILAKUKAN:')
  
  console.log('\n1️⃣ PERBAIKAN TKDN-IK:')
  console.log('✅ API diperbaiki dengan fallback handling untuk kolom status_sertifikat')
  console.log('✅ Error handling yang lebih baik')
  console.log('✅ Default value untuk status_sertifikat')
  console.log('⚠️  Perlu manual SQL: ALTER TABLE tkdn_ik ADD COLUMN status_sertifikat VARCHAR(20) DEFAULT \'Proses\';')
  
  console.log('\n2️⃣ PERBAIKAN PELATIHAN:')
  console.log('✅ Error handling dan logging detail ditambahkan')
  console.log('✅ Auto-create IKM Binaan jika tidak ditemukan')
  console.log('✅ Validasi form yang lebih baik')
  console.log('✅ Multiple pelatihan handling diperbaiki')
  
  console.log('\n3️⃣ PERBAIKAN LAPORAN:')
  console.log('✅ Filter IKM Binaan ditambahkan')
  console.log('✅ Kolom sesuai spesifikasi:')
  console.log('   - HKI Merek: NIB, NIK, Nama, Usaha, No.HP, No.Pendaftaran, Status, Tahun, Dokumen')
  console.log('   - Sertifikat Halal: NIB, NIK, Nama, Usaha, No.HP, No.Sertifikat, Status, Tahun, Link Sertifikat, Link Logo')
  console.log('   - TKDN IK: NIB, NIK, Nama, Usaha, No.HP, No.Sertifikat, TKDN%, Status, Tahun, Link Dokumen')
  console.log('   - SIINas: NIB, NIK, Nama, Usaha, No.HP, No.Bukti Akun, Tahun Registrasi, Link Dokumen')
  console.log('   - Uji Nilai Gizi: NIB, NIK, Nama, Usaha, No.HP, No.LHU, Tahun, Link Dokumen')
  console.log('   - Kurasi Produk: NIB, NIK, Nama, Usaha, No.HP, No.Sertifikat, Link Dokumen')
  console.log('✅ Export Excel/PDF dengan kolom lengkap')
  
  console.log('\n🔧 MEMULAI DEPLOYMENT...')
  
  try {
    // Check if vercel CLI is available
    console.log('📋 Checking Vercel CLI...')
    try {
      execSync('vercel --version', { stdio: 'pipe' })
      console.log('✅ Vercel CLI tersedia')
    } catch (error) {
      console.log('❌ Vercel CLI tidak ditemukan')
      console.log('📥 Install dengan: npm i -g vercel')
      console.log('🔗 Atau deploy manual di: https://vercel.com/dashboard')
      return
    }
    
    // Deploy to Vercel
    console.log('🚀 Deploying to Vercel...')
    console.log('⏳ Ini mungkin memakan waktu beberapa menit...')
    
    const deployOutput = execSync('vercel --prod --yes', { 
      encoding: 'utf8',
      stdio: 'pipe'
    })
    
    console.log('✅ Deployment berhasil!')
    console.log('📋 Output:', deployOutput)
    
    // Extract URL from output
    const urlMatch = deployOutput.match(/https:\/\/[^\s]+/)
    if (urlMatch) {
      console.log('🌐 Website URL:', urlMatch[0])
    }
    
    console.log('\n🎉 DEPLOYMENT SELESAI!')
    console.log('🔗 Website: https://ikm-juara-dashboard.vercel.app/')
    
    console.log('\n📋 LANGKAH SELANJUTNYA:')
    console.log('1. Buka Supabase Dashboard')
    console.log('2. Jalankan SQL untuk menambah kolom status_sertifikat:')
    console.log('   ALTER TABLE tkdn_ik ADD COLUMN status_sertifikat VARCHAR(20) DEFAULT \'Proses\';')
    console.log('3. Test semua fitur di website')
    console.log('4. Verifikasi bahwa semua perbaikan berfungsi')
    
  } catch (error) {
    console.error('❌ Deployment error:', error.message)
    console.log('\n🔧 ALTERNATIF DEPLOYMENT:')
    console.log('1. Push ke GitHub repository')
    console.log('2. Buka https://vercel.com/dashboard')
    console.log('3. Import project dari GitHub')
    console.log('4. Deploy otomatis akan berjalan')
  }
}

deployToVercel()