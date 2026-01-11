// Script untuk deploy fitur export Excel
const { execSync } = require('child_process')
const fs = require('fs')

console.log('🚀 Deploying Export Excel Feature...')

// 1. Verifikasi fitur export Excel
console.log('\n1. Verifying export Excel feature...')

const requiredFiles = [
  'lib/excelExport.js',
  'pages/ikm-binaan.js'
]

let allFilesReady = true
for (const file of requiredFiles) {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`)
  } else {
    console.log(`❌ ${file} - MISSING!`)
    allFilesReady = false
  }
}

if (!allFilesReady) {
  console.log('❌ Required files missing. Aborting deployment.')
  process.exit(1)
}

// 2. Periksa implementasi tombol Export Excel
console.log('\n2. Checking Export Excel button implementation...')

try {
  const ikmContent = fs.readFileSync('pages/ikm-binaan.js', 'utf8')
  
  if (ikmContent.includes('Export Excel') && 
      ikmContent.includes('handleExportExcel') &&
      ikmContent.includes('bg-orange-600')) {
    console.log('✅ Export Excel button implemented with orange color')
  } else {
    console.log('❌ Export Excel button not properly implemented')
    process.exit(1)
  }
} catch (error) {
  console.log('❌ Error checking implementation:', error.message)
  process.exit(1)
}

// 3. Build project
console.log('\n3. Building project...')
try {
  execSync('npm run build', { stdio: 'inherit' })
  console.log('✅ Build successful')
} catch (error) {
  console.log('❌ Build failed:', error.message)
  process.exit(1)
}

// 4. Deploy to Vercel
console.log('\n4. Deploying to Vercel...')
try {
  const deployResult = execSync('npx vercel --prod --yes --force', { 
    encoding: 'utf8',
    stdio: 'pipe'
  })
  
  console.log('✅ Deployment successful')
  console.log('Deployment URL:', deployResult.trim())
  
  // Simpan info deployment
  const deploymentInfo = {
    url: deployResult.trim(),
    timestamp: new Date().toISOString(),
    feature: 'Export Excel untuk IKM Binaan',
    changes: [
      'Tombol Export Excel dengan warna orange untuk visibility',
      'Export ke format Excel (.xls) yang sesungguhnya',
      'Fallback ke CSV jika Excel gagal',
      'UTF-8 encoding dengan BOM untuk karakter Indonesia',
      'Kolom lengkap dengan status database dan duplikasi',
      'User-friendly success messages',
      'Error handling yang robust'
    ]
  }
  
  fs.writeFileSync('deployment-export-excel.json', JSON.stringify(deploymentInfo, null, 2))
  console.log('✅ Deployment info saved')

} catch (error) {
  console.log('❌ Deployment failed:', error.message)
  process.exit(1)
}

// 5. Buat summary report
console.log('\n5. Creating deployment summary...')

const summaryReport = `# FITUR EXPORT EXCEL - DEPLOYED SUCCESSFULLY ✅

## 🎯 Fitur Export Excel Telah Ditambahkan

### ✅ **Tombol Export Excel di Halaman IKM Binaan**
- **Lokasi**: Halaman IKM Binaan (/ikm-binaan)
- **Warna**: Orange (bg-orange-600) untuk visibility yang lebih baik
- **Posisi**: Di sebelah tombol Export PDF

### ✅ **Fitur Export yang Tersedia**

#### 1. **Export ke Excel Format Asli (.xls)**
- Format Microsoft Excel yang sesungguhnya
- XML-based workbook structure
- Styling dengan header berwarna dan borders
- Kompatibel dengan Microsoft Excel dan LibreOffice

#### 2. **Fallback ke CSV**
- Jika export Excel gagal, otomatis fallback ke CSV
- UTF-8 encoding dengan BOM untuk karakter Indonesia
- Proper escaping untuk data dengan koma, quotes, dll
- Dapat dibuka di Excel dengan format yang benar

#### 3. **Kolom Data Lengkap**
- No. (urutan)
- NIB (13 digit)
- No. KTP (16 digit)
- Nama Lengkap
- Alamat Lengkap
- Nama Usaha
- No. HP
- Tanggal Input
- Status Database (Lengkap/Belum Lengkap)
- Duplikat NIB (Ya/Tidak)
- Duplikat NIK (Ya/Tidak)

### ✅ **User Experience**
- **Success Message**: Menampilkan nama file dan jumlah records
- **Error Handling**: Pesan error yang jelas jika gagal
- **Loading State**: Proses export yang smooth
- **File Naming**: Otomatis dengan timestamp (Data_IKM_Binaan_YYYY-MM-DD.xls)

### ✅ **Technical Features**
- **UTF-8 Support**: Karakter Indonesia ditampilkan dengan benar
- **Data Validation**: Handling untuk data kosong atau null
- **Memory Efficient**: Tidak memuat library besar
- **Cross-browser**: Bekerja di semua browser modern
- **Mobile Friendly**: Dapat digunakan di perangkat mobile

## 🌐 **Deployment Info**
- **URL**: https://ikm-juara-dashboard.vercel.app/ikm-binaan
- **Status**: ✅ LIVE dan SIAP DIGUNAKAN
- **Timestamp**: ${new Date().toISOString()}

## 🎉 **Cara Menggunakan**
1. Buka halaman IKM Binaan
2. Klik tombol **"Export Excel"** (warna orange)
3. File akan otomatis terdownload
4. Buka file di Excel atau aplikasi spreadsheet lainnya

## 🔧 **Technical Implementation**
- **Frontend**: React/Next.js dengan custom export utility
- **Format**: XML-based Excel workbook
- **Encoding**: UTF-8 with BOM
- **Fallback**: CSV export jika Excel gagal
- **Error Handling**: Comprehensive error messages

---
**FITUR EXPORT EXCEL TELAH BERHASIL DITAMBAHKAN DAN DEPLOYED!** 🎯
`

fs.writeFileSync('EXPORT_EXCEL_FEATURE_DEPLOYED.md', summaryReport)

console.log('\n🎉 EXPORT EXCEL FEATURE DEPLOYED!')
console.log('📄 Summary report: EXPORT_EXCEL_FEATURE_DEPLOYED.md')
console.log('🌐 Website: https://ikm-juara-dashboard.vercel.app/ikm-binaan')
console.log('\n✅ Fitur Export Excel telah berhasil ditambahkan dan siap digunakan!')
console.log('\n📋 Yang telah ditambahkan:')
console.log('   • Tombol Export Excel (warna orange)')
console.log('   • Export ke format Excel (.xls) asli')
console.log('   • Fallback ke CSV jika diperlukan')
console.log('   • UTF-8 encoding untuk karakter Indonesia')
console.log('   • Kolom data yang lengkap dan informatif')
console.log('   • User-friendly messages dan error handling')