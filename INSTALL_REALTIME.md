# Instalasi Dashboard Real-Time

Panduan lengkap untuk mengaktifkan fitur dashboard real-time pada aplikasi IKM JUARA.

## 📦 Dependencies Baru

Jalankan perintah berikut untuk menginstall dependencies yang diperlukan:

```bash
npm install @supabase/supabase-js@^2.39.0
```

## 🔧 Setup Environment Variables

### 1. Copy Environment Template
```bash
cp .env.local.example .env.local
```

### 2. Konfigurasi Supabase
Edit file `.env.local` dan tambahkan konfigurasi Supabase:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Dashboard Real-Time Configuration
NEXT_PUBLIC_DASHBOARD_REFRESH_INTERVAL=15000
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000

# Development
NODE_ENV=development
```

### 3. Mendapatkan Supabase Keys

1. **Buat Project Supabase**:
   - Kunjungi [supabase.com](https://supabase.com)
   - Klik "New Project"
   - Isi nama project dan password database

2. **Dapatkan API Keys**:
   - Buka project dashboard
   - Pergi ke Settings > API
   - Copy `Project URL` untuk `NEXT_PUBLIC_SUPABASE_URL`
   - Copy `anon public` key untuk `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Copy `service_role` key untuk `SUPABASE_SERVICE_ROLE_KEY`

## 🗄️ Setup Database

### 1. Jalankan SQL Script
1. Buka Supabase dashboard
2. Pergi ke SQL Editor
3. Copy seluruh isi file `database-setup.sql`
4. Paste dan jalankan script

### 2. Verifikasi Tabel
Pastikan tabel berikut telah dibuat:
- `ikm_binaan`
- `hki_merek`
- `sertifikat_halal`
- `tkdn_ik`
- `siinas`
- `uji_nilai_gizi`
- `kurasi_produk`
- `pelatihan`
- `buku_tamu`
- `users`

## 🚀 Menjalankan Aplikasi

### 1. Install Dependencies
```bash
npm install
```

### 2. Jalankan Development Server
```bash
npm run dev
```

### 3. Akses Dashboard
- Buka `http://localhost:3000`
- Login dengan `admin` / `admin123`
- Dashboard real-time akan aktif otomatis

## ✅ Verifikasi Instalasi

### 1. Cek Koneksi Database
- Dashboard menampilkan indikator "Live" (hijau)
- Data statistik muncul (bukan loading skeleton)
- Tidak ada error di browser console

### 2. Test Auto-Refresh
- Tunggu 15 detik
- Lihat countdown timer di dashboard
- Angka statistik mungkin berubah (simulasi)

### 3. Test Manual Refresh
- Klik tombol "Refresh Sekarang"
- Loading indicator muncul sebentar
- Data ter-update

## 🔧 Troubleshooting

### Error: "Supabase client not configured"
**Solusi**: Periksa environment variables di `.env.local`

### Error: "Database connection failed"
**Solusi**: 
1. Verifikasi Supabase URL dan keys
2. Pastikan database script sudah dijalankan
3. Cek koneksi internet

### Dashboard tidak auto-refresh
**Solusi**:
1. Cek browser console untuk error
2. Pastikan `NEXT_PUBLIC_DASHBOARD_REFRESH_INTERVAL` di-set
3. Refresh halaman browser

### Data tidak muncul
**Solusi**:
1. Jalankan script `database-setup.sql` lagi
2. Periksa RLS (Row Level Security) di Supabase
3. Cek permissions tabel

## 🎛️ Konfigurasi Lanjutan

### Mengubah Interval Refresh
Edit `pages/dashboard.js`:
```javascript
// Ganti 15000 dengan interval yang diinginkan (dalam ms)
const { data, loading, error, lastUpdated, refresh } = useDashboardData(30000)
```

### Mode Simulasi vs Database Real
Aplikasi otomatis menggunakan:
- **Database real** jika Supabase dikonfigurasi
- **Mode simulasi** jika tidak ada konfigurasi database

### Mengaktifkan Logging
Tambahkan di `.env.local`:
```env
NEXT_PUBLIC_DEBUG=true
```

## 📊 Fitur yang Tersedia

### ✅ Sudah Aktif
- Auto-refresh setiap 15 detik
- Live connection indicator
- Animated counters
- Manual refresh button
- Error handling dengan retry
- Loading states

### 🔄 Mode Fallback
Jika database tidak tersedia, aplikasi akan:
- Menggunakan data simulasi
- Tetap menampilkan animasi
- Memberikan pengalaman yang konsisten

## 🚀 Production Deployment

### Vercel Deployment
1. Push code ke GitHub
2. Connect repository di Vercel
3. Tambahkan environment variables di Vercel dashboard
4. Deploy otomatis

### Environment Variables di Vercel
Tambahkan semua variables dari `.env.local` ke Vercel:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_DASHBOARD_REFRESH_INTERVAL`

## 📞 Support

Jika mengalami masalah:
1. Cek dokumentasi di `docs/DASHBOARD_REALTIME.md`
2. Periksa browser console untuk error
3. Hubungi tim development

---

**Selamat!** Dashboard real-time Anda sudah siap digunakan! 🎉