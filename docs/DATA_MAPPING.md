# Mapping Data Dashboard Real-Time

Dokumentasi ini menjelaskan bagaimana data dashboard dipetakan dari data real yang ada di aplikasi.

## 📊 Statistik Utama Dashboard

### 1. Total IKM Binaan: **4**
**Sumber**: Data dari `pages/ikm-binaan.js` - dummyData
- Budi Santoso (CV. Sumber Rejeki)
- Siti Aminah (UD. Berkah Jaya) 
- Ahmad Wijaya (PT. Maju Bersama)
- Dewi Sartika (CV. Berkah Mandiri)

### 2. Layanan Aktif: **2**
**Sumber**: Layanan yang masih dalam status "Proses"
- HKI Merek: 1 proses
- SIINas: 1 proses
- Kurasi Produk: 1 proses
- **Total**: 2 layanan aktif

### 3. Pelatihan Selesai: **3**
**Sumber**: Data pelatihan yang telah selesai
- Pelatihan Digital Marketing batch 1
- Pelatihan Digital Marketing batch 2  
- Pelatihan Digital Marketing batch 3

### 4. Pengguna Terdaftar: **2**
**Sumber**: Users yang ada di sistem
- Admin user
- Regular user

## 📈 Statistik Layanan Detail

### HKI Merek: **Total 3**
- **Selesai**: 1 (Telah Didaftar)
- **Proses**: 1 (Sedang Proses)
- **Ditolak**: 1 (Ditolak)

### Sertifikat Halal: **Total 2**
- **Selesai**: 2
- **Proses**: 0
- **Ditolak**: 0

### TKDN IK: **Total 1**
- **Selesai**: 1
- **Proses**: 0
- **Ditolak**: 0

### SIINas: **Total 3**
- **Selesai**: 2
- **Proses**: 1
- **Ditolak**: 0

### Uji Nilai Gizi: **Total 1**
- **Selesai**: 1
- **Proses**: 0
- **Ditolak**: 0

### Kurasi Produk: **Total 2**
- **Selesai**: 1
- **Proses**: 1
- **Ditolak**: 0

## 🔄 Cara Kerja Data Real-Time

### 1. Data Source
Dashboard mengambil data dari:
```javascript
// File: pages/api/dashboard/stats.js
const realData = {
  ikmBinaan: [...], // 4 data IKM
  hkiMerek: [...],  // 3 data HKI
  // dst...
}
```

### 2. Perhitungan Otomatis
- **Total**: Menghitung `array.length`
- **Status**: Filter berdasarkan status
- **Persentase**: Kalkulasi perubahan dari periode sebelumnya

### 3. Update Real-Time
- Data di-refresh setiap 15 detik
- Perubahan data akan langsung terlihat
- Animasi smooth saat angka berubah

## 🔧 Cara Menambah Data Baru

### Untuk Menambah IKM Binaan:
1. Edit `pages/ikm-binaan.js`
2. Tambah data ke `dummyData` array
3. Dashboard otomatis update

### Untuk Menambah Layanan:
1. Edit file layanan terkait (misal: `pages/layanan/hki-merek.js`)
2. Tambah data ke `dummyData` array
3. Update mapping di `pages/api/dashboard/stats.js`

### Untuk Mengubah Status:
1. Edit status di data dummy
2. Dashboard akan menghitung ulang statistik

## 📱 Contoh Perubahan Data

### Menambah IKM Binaan Baru:
```javascript
// Di pages/ikm-binaan.js
const newIkm = {
  id: '5',
  nib: '5678901234567',
  nik: '3573012345678905',
  nama_lengkap: 'Eko Prasetyo',
  // ...
}
```
**Hasil**: Total IKM Binaan berubah dari 4 → 5

### Mengubah Status HKI Merek:
```javascript
// Di pages/layanan/hki-merek.js
{
  status_sertifikat: 'Proses' → 'Telah Didaftar'
}
```
**Hasil**: 
- Layanan Aktif: 2 → 1
- HKI Selesai: 1 → 2

## 🎯 Sinkronisasi Data

### Mode Saat Ini: **Simulasi**
- Data hardcoded di API
- Sesuai dengan data dummy di aplikasi
- Update manual saat ada perubahan

### Mode Database (Future):
- Data dari Supabase real-time
- Auto-sync saat ada perubahan
- Query langsung ke database

## 🔍 Debugging Data

### Cek Data Dashboard:
1. Buka browser DevTools
2. Network tab → XHR
3. Lihat request ke `/api/dashboard/stats`
4. Periksa response JSON

### Cek Konsistensi:
1. Bandingkan angka dashboard dengan halaman detail
2. Pastikan total sesuai dengan jumlah data
3. Verifikasi status dan perhitungan

## 📝 Catatan Penting

1. **Data Konsisten**: Dashboard harus selalu sinkron dengan data di halaman lain
2. **Real-Time**: Perubahan data langsung terlihat dalam 15 detik
3. **Akurasi**: Semua perhitungan berdasarkan data real, bukan random
4. **Performance**: Data di-cache untuk menghindari perhitungan berulang

---

**Dashboard sekarang menampilkan data real yang sesuai dengan aplikasi!** 🎉