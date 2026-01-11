# 🧪 Panduan Testing Koneksi Supabase

## Langkah-langkah Testing

### 1. **Restart Development Server**
```bash
npm run dev
```

### 2. **Test Koneksi Supabase**
Buka browser dan akses:
```
http://localhost:3000/api/test-supabase
```

**Expected Response (Success):**
```json
{
  "success": true,
  "message": "Supabase connection successful!",
  "data": {
    "sampleIkm": [...],
    "totalIkm": 5,
    "timestamp": "2024-01-09T..."
  }
}
```

**Expected Response (Error):**
```json
{
  "success": false,
  "error": "Error message here",
  "details": {...}
}
```

### 3. **Test Dashboard dengan Data Real**
Buka dashboard:
```
http://localhost:3000/dashboard
```

Periksa console browser (F12) untuk melihat log:
- ✅ "Using real Supabase data" = Berhasil
- ❌ "Database connection failed" = Ada masalah
- ⚠️ "Using simulation data" = Environment variables belum diset

### 4. **Test CRUD Operations**

#### Test IKM Binaan:
```
http://localhost:3000/ikm-binaan
```
- Coba tambah data baru
- Edit data existing
- Hapus data (soft delete)

#### Test Layanan:
```
http://localhost:3000/layanan/hki-merek
```
- Tambah data HKI Merek
- Periksa status sertifikat

### 5. **Monitoring Real-time**
Dashboard akan update otomatis setiap 15 detik jika koneksi berhasil.

## Troubleshooting

### Error: "Supabase not configured"
**Solusi:**
1. Periksa file `.env.local`
2. Pastikan semua environment variables terisi
3. Restart development server

### Error: "Invalid API key"
**Solusi:**
1. Periksa kembali API keys di Supabase Dashboard
2. Pastikan menggunakan anon key untuk NEXT_PUBLIC_SUPABASE_ANON_KEY
3. Pastikan menggunakan service role key untuk SUPABASE_SERVICE_ROLE_KEY

### Error: "relation does not exist"
**Solusi:**
1. Jalankan `database-setup.sql` di Supabase SQL Editor
2. Jalankan `supabase-rls-setup.sql` untuk RLS policies

### Error: "Row Level Security"
**Solusi:**
1. Jalankan `supabase-rls-setup.sql`
2. Atau disable RLS sementara untuk testing:
```sql
ALTER TABLE table_name DISABLE ROW LEVEL SECURITY;
```

## Checklist Koneksi Berhasil

- [ ] Environment variables terisi dengan benar
- [ ] Database schema sudah dibuat
- [ ] RLS policies sudah disetup
- [ ] Test API `/api/test-supabase` return success
- [ ] Dashboard menampilkan data real
- [ ] CRUD operations berfungsi
- [ ] Real-time updates berjalan

## Next Steps

Setelah koneksi berhasil:
1. Setup authentication dengan Supabase Auth
2. Implement file upload dengan Supabase Storage
3. Setup real-time subscriptions
4. Deploy ke production dengan environment variables production