# 🏢 IKM JUARA Dashboard

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

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 📁 Struktur Project

```
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
```

## 🔧 Environment Variables

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

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
```bash
npm run build
vercel --prod
```

## 📞 Support

Untuk pertanyaan atau dukungan teknis, hubungi tim development.

---

© 2024 DisnakerKUKM Kota Madiun - IKM JUARA Dashboard
