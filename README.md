# Database IKM JUARA - DisnakerKUKM Kota Madiun

Website sistem informasi Database IKM JUARA untuk Dinas Tenaga Kerja dan KUKM Kota Madiun dengan fitur **Dashboard Real-Time** menggunakan Next.js Pages Router dan Tailwind CSS.

## 🚀 Fitur Utama

### 📊 Dashboard Real-Time (NEW!)
- **Auto-refresh**: Data diperbarui otomatis setiap 15 detik
- **Live indicator**: Status koneksi dan waktu update terakhir  
- **Animated counters**: Perubahan angka dengan animasi smooth
- **Real-time statistics**: Statistik layanan dan aktivitas terbaru
- **Manual refresh**: Tombol refresh untuk update instant

### Sistem Login
- **Mode Admin**: `admin` / `admin123` - Akses penuh ke semua fitur manajemen
- **Mode Pengguna**: `user` / `user123` - Akses terbatas dengan popup buku tamu

### Dashboard Admin
- 📊 **Dashboard IKM Binaan**: Statistik real-time dan overview
- 🏭 **IKM Binaan**: Manajemen data IKM dengan NIB, NIK, dan detail lengkap
- 🛠️ **Layanan IKM Juara**:
  - Pendaftaran HKI Merek
  - Pendaftaran Sertifikat Halal  
  - Pendaftaran TKDN IK
  - Pendaftaran dan Pendampingan SIINas
  - Pendaftaran Uji Nilai Gizi
  - Kurasi Produk
- 🎓 **Pelatihan Pemberdayaan Industri**
- 🔍 **Penelusuran Data IKM Binaan**: Pencarian komprehensif
- 🗑️ **Recycle Bin**: Manajemen data terhapus

### Fitur Khusus
- **Real-Time Dashboard**: Update otomatis setiap 15 detik dengan indikator live
- **Auto-fill Data**: Input NIB/NIK/Nama otomatis mengisi data dari database IKM Binaan
- **Database Indicator**: Status otomatis berdasarkan kelengkapan layanan
- **Link Management**: Integrasi dengan Google Drive untuk dokumen
- **Soft Delete**: Data terhapus dapat dikembalikan
- **Responsive Design**: Optimal di desktop dan mobile

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 dengan Pages Router
- **Database**: Supabase (PostgreSQL)
- **Real-Time**: Custom hooks dengan auto-refresh
- **Styling**: Tailwind CSS
- **Icons**: Heroicons
- **Deployment**: Vercel Ready

## 📋 Setup Development

### 1. Clone dan Install
```bash
git clone <repository-url>
cd ikm-juara
npm install
```

### 2. Setup Environment Variables
```bash
cp .env.local.example .env.local
```

Edit `.env.local`:
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Dashboard Real-Time Configuration
NEXT_PUBLIC_DASHBOARD_REFRESH_INTERVAL=15000
```

### 3. Setup Database
1. Buat project di [Supabase](https://supabase.com)
2. Jalankan script `database-setup.sql` di SQL Editor
3. Update environment variables

### 4. Jalankan Development Server
```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

## 🔐 Demo Login

### Admin Mode
- **Username**: `admin`
- **Password**: `admin123`
- **Akses**: Dashboard real-time + semua fitur manajemen

### User Mode  
- **Username**: `user`
- **Password**: `user123`
- **Akses**: Popup buku tamu, akses terbatas

## 📊 Dashboard Real-Time Features

### Auto-Refresh Statistics
- **Total IKM Binaan**: Jumlah IKM terdaftar (update real-time)
- **Layanan Aktif**: Layanan dalam proses (auto-sync)
- **Pelatihan Selesai**: Pelatihan completed (live count)
- **Pengguna Terdaftar**: Total users (real-time)

### Live Indicators
- 🟢 **Live**: Koneksi aktif, data ter-sync
- 🔴 **Terputus**: Koneksi bermasalah
- ⏱️ **Timer**: Countdown refresh berikutnya
- 🔄 **Manual Refresh**: Update instant

### Animated Features
- **Smooth Counters**: Angka berubah dengan animasi
- **Color Coding**: Hijau (naik), Merah (turun)
- **Loading States**: Skeleton loading yang smooth

## 🚀 Deployment ke Vercel

### 1. Push ke GitHub
```bash
git add .
git commit -m "Add real-time dashboard"
git push origin main
```

### 2. Deploy di Vercel
1. Login ke [vercel.com](https://vercel.com)
2. Import repository dari GitHub
3. Tambahkan environment variables di Vercel dashboard
4. Deploy otomatis akan berjalan

## 📁 Struktur Project

```
├── pages/                       # Next.js Pages Router
│   ├── api/
│   │   └── dashboard/
│   │       └── stats.js        # Real-time API endpoint
│   ├── _app.js                 # App wrapper
│   ├── index.js                # Home redirect
│   ├── login.js                # Login system
│   ├── dashboard.js            # Real-time dashboard
│   ├── ikm-binaan.js          # IKM Binaan management
│   ├── layanan/               # Layanan IKM Juara
│   └── ...
├── components/                 # Reusable components
│   ├── Layout.js              # Main layout with sidebar
│   ├── RealTimeIndicator.js   # Live status indicator
│   ├── AnimatedCounter.js     # Animated number counter
│   └── BukuTamuModal.js       # Guest book modal
├── hooks/                     # Custom React hooks
│   └── useDashboardData.js    # Real-time data hook
├── lib/                       # Utilities
│   └── supabase.js           # Database connection & helpers
├── docs/                      # Documentation
│   └── DASHBOARD_REALTIME.md  # Real-time dashboard docs
└── database-setup.sql         # Database schema
```

## 🔧 Cara Kerja Dashboard Real-Time

### 1. Auto-Refresh Mechanism
```javascript
// Custom hook dengan auto-refresh
const { data, loading, error, lastUpdated, refresh } = useRealTimeStats()

// Refresh setiap 15 detik
useEffect(() => {
  const interval = setInterval(fetchData, 15000)
  return () => clearInterval(interval)
}, [])
```

### 2. API Integration
```javascript
// API endpoint: /api/dashboard/stats
// Otomatis fallback ke simulasi jika database tidak tersedia
GET /api/dashboard/stats
```

### 3. Visual Feedback
- **Loading States**: Skeleton loading saat fetch data
- **Error Handling**: Pesan error dengan retry button
- **Success States**: Animasi smooth saat data berubah

## 🎯 Fitur Demo & Testing

### Real-Time Dashboard
- ✅ Auto-refresh setiap 15 detik
- ✅ Live connection indicator
- ✅ Animated counters dengan smooth transition
- ✅ Manual refresh button
- ✅ Error handling dengan retry

### Existing Features
- ✅ Login system dengan dual mode
- ✅ IKM Binaan CRUD operations
- ✅ HKI Merek management
- ✅ Penelusuran data (demo: NIB 1234567890123)
- ✅ Recycle bin functionality
- ✅ Responsive sidebar navigation

## 🔧 Konfigurasi Dashboard

### Mengubah Interval Refresh
```javascript
// Di pages/dashboard.js
const { data } = useDashboardData(30000) // 30 detik
```

### Menambah Statistik Baru
1. Update `pages/api/dashboard/stats.js`
2. Tambah query di `lib/supabase.js`
3. Update UI di `pages/dashboard.js`

## 🤝 Kontribusi

1. Fork repository
2. Buat feature branch (`git checkout -b feature/RealtimeDashboard`)
3. Commit perubahan (`git commit -m 'Add real-time dashboard'`)
4. Push ke branch (`git push origin feature/RealtimeDashboard`)
5. Buat Pull Request

## 📞 Support

Untuk bantuan teknis atau pertanyaan:
- Email: support@disnakermadiun.go.id
- WhatsApp: +62 xxx-xxxx-xxxx

---

**Database IKM JUARA** - Memajukan UMKM Kota Madiun melalui digitalisasi data dan layanan terpadu dengan teknologi real-time.