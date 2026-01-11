#!/usr/bin/env node

/**
 * SETUP GIT REPOSITORY - IKM JUARA DASHBOARD
 * Script untuk menginisialisasi Git repository dan push ke GitHub
 */

const { execSync } = require('child_process')
const fs = require('fs')

console.log('🚀 SETUP GIT REPOSITORY - IKM JUARA DASHBOARD')
console.log('=' .repeat(60))

// 1. Initialize Git if not exists
console.log('📝 Initializing Git repository...')
try {
  if (!fs.existsSync('.git')) {
    execSync('git init', { stdio: 'inherit' })
    console.log('✅ Git repository initialized')
  } else {
    console.log('✅ Git repository already exists')
  }
} catch (error) {
  console.log('❌ Failed to initialize Git:', error.message)
  process.exit(1)
}

// 2. Create .gitignore if not exists
console.log('📝 Creating .gitignore...')
const gitignoreContent = `# Dependencies
node_modules/
/.pnp
.pnp.js

# Testing
/coverage

# Next.js
/.next/
/out/

# Production
/build

# Misc
.DS_Store
*.tsbuildinfo
next-env.d.ts

# Debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Local env files
.env*.local
.env

# Vercel
.vercel

# IDE
.vscode/
.idea/

# Logs
*.log

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Temporary folders
tmp/
temp/

# OS generated files
Thumbs.db
ehthumbs.db

# Deployment files
deployment-*.json
*.deploy.log

# Test files (keep structure but ignore results)
test-report*.json
production-test-report.json
all-tests-report.json
peserta-sync-verification-report.json
deployment-*.json
`

if (!fs.existsSync('.gitignore')) {
  fs.writeFileSync('.gitignore', gitignoreContent)
  console.log('✅ .gitignore created')
} else {
  console.log('✅ .gitignore already exists')
}

// 3. Create README.md if not comprehensive
console.log('📝 Updating README.md...')
const readmeContent = `# 🏢 IKM JUARA Dashboard

Dashboard sistem database IKM JUARA untuk DisnakerKUKM Kota Madiun.

## 🌐 Live Demo
**Production:** https://ikm-juara-dashboard.vercel.app

## ✨ Fitur Utama

### 📊 Export Excel
- Export data IKM Binaan ke format Excel
- Tombol export berwarna orange
- Support Excel (.xls) dan CSV fallback

### 📈 Laporan Komprehensif
- Filter berdasarkan jenis layanan, tahun, bulan, status
- Export data per jenis layanan
- Statistik realtime

### 🎓 Manajemen Pelatihan
- Detail peserta per jenis pelatihan
- Pencarian IKM Binaan terintegrasi
- Export Excel/PDF untuk peserta
- Tombol edit untuk setiap peserta

### 📱 Dashboard Realtime
- Statistik live dari database
- Counter animasi
- Indikator koneksi realtime

## 🛠️ Teknologi

- **Frontend:** Next.js 14, React 18, Tailwind CSS
- **Backend:** Supabase PostgreSQL
- **Deployment:** Vercel
- **Export:** jsPDF, Custom Excel export

## 🚀 Development

\`\`\`bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
\`\`\`

## 📁 Struktur Project

\`\`\`
├── pages/              # Next.js pages
│   ├── api/           # API routes
│   ├── dashboard.js   # Dashboard utama
│   ├── ikm-binaan.js  # Manajemen IKM Binaan
│   ├── pelatihan.js   # Manajemen Pelatihan
│   └── laporan.js     # Laporan komprehensif
├── components/        # React components
├── lib/              # Utilities
│   ├── supabase.js   # Database connection
│   ├── excelExport.js # Excel export utilities
│   └── pdfExport.js  # PDF export utilities
└── styles/           # CSS styles
\`\`\`

## 🔧 Environment Variables

\`\`\`bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
\`\`\`

## 📊 Database Schema

- **ikm_binaan:** Data IKM Binaan utama
- **jenis_pelatihan:** Master jenis pelatihan
- **pelatihan:** Data peserta pelatihan
- **hki_merek:** Data HKI Merek
- **sertifikat_halal:** Data Sertifikat Halal
- **tkdn_ik:** Data TKDN IK
- **siinas:** Data SIINas
- **kurasi_produk:** Data Kurasi Produk
- **uji_nilai_gizi:** Data Uji Nilai Gizi

## 🎯 Fitur Export

### Excel Export
- Format .xls yang dapat dibuka di Microsoft Excel
- UTF-8 encoding untuk karakter Indonesia
- Fallback ke CSV jika Excel gagal

### PDF Export
- Layout profesional dengan header/footer
- Tabel responsif dengan styling
- Summary statistik

## 🔒 Security

- Row Level Security (RLS) di Supabase
- Authentication middleware
- Environment variables untuk sensitive data

## 📱 Responsive Design

- Mobile-first approach
- Tablet dan desktop optimization
- Touch-friendly interface

## 🚀 Deployment

Otomatis deploy ke Vercel saat push ke main branch.

Manual deployment:
\`\`\`bash
npm run build
vercel --prod
\`\`\`

## 📞 Support

Untuk pertanyaan atau dukungan teknis, hubungi tim development.

---

© 2024 DisnakerKUKM Kota Madiun - IKM JUARA Dashboard
`

fs.writeFileSync('README.md', readmeContent)
console.log('✅ README.md updated')

// 4. Add all files
console.log('📝 Adding files to Git...')
try {
  execSync('git add .', { stdio: 'inherit' })
  console.log('✅ Files added to Git')
} catch (error) {
  console.log('❌ Failed to add files:', error.message)
  process.exit(1)
}

// 5. Initial commit
console.log('📝 Creating initial commit...')
try {
  execSync('git commit -m "🎉 Initial commit - IKM JUARA Dashboard with all features"', { stdio: 'inherit' })
  console.log('✅ Initial commit created')
} catch (error) {
  console.log('⚠️ Commit may already exist or no changes to commit')
}

console.log('')
console.log('=' .repeat(60))
console.log('🎉 GIT REPOSITORY SETUP COMPLETE!')
console.log('=' .repeat(60))
console.log('')
console.log('📋 NEXT STEPS:')
console.log('1. Create a new repository on GitHub/GitLab')
console.log('2. Copy the repository URL')
console.log('3. Run: git remote add origin <repository-url>')
console.log('4. Run: git branch -M main')
console.log('5. Run: git push -u origin main')
console.log('')
console.log('🔗 CONNECT TO VERCEL:')
console.log('1. Go to Vercel dashboard')
console.log('2. Click "Connect Git Repository"')
console.log('3. Select your GitHub repository')
console.log('4. Configure build settings (should auto-detect)')
console.log('5. Deploy!')
console.log('')
console.log('✅ Your project will then auto-deploy on every push!')