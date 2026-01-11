# IKM Juara Dashboard - Deployment Guide

## Environment Variables yang Diperlukan di Vercel

Setelah deploy ke Vercel, Anda perlu menambahkan environment variables berikut di dashboard Vercel:

### Supabase Configuration
```
NEXT_PUBLIC_SUPABASE_URL=https://xflxzpycfwopaupznlvu.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhmbHh6cHljZndvcGF1cHpubHZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc5NzM0NzQsImV4cCI6MjA4MzU0OTQ3NH0.-Q3rY20J9j5HaU9XZChdTa_nW4tQvwN2-3ltXPywlI8
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhmbHh6cHljZndvcGF1cHpubHZ1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Nzk3MzQ3NCwiZXhwIjoyMDgzNTQ5NDc0fQ.1GbJFh6zOyJnOMin_Rw5gQ6A88swldvCh1F0h4kRNbg
```

### Dashboard Configuration
```
NEXT_PUBLIC_DASHBOARD_REFRESH_INTERVAL=15000
NODE_ENV=production
```

### URL Configuration
```
NEXT_PUBLIC_API_BASE_URL=https://ikm-juara-dashboard.vercel.app
```

## Langkah Deploy ke Vercel

1. Push kode ke GitHub repository
2. Connect repository ke Vercel
3. Set environment variables
4. Deploy!

## Fitur yang Tersedia

- ✅ Dashboard real-time dengan statistik
- ✅ Manajemen layanan (SIINAS, TKDN, HKI, dll)
- ✅ Sistem pelatihan dan sertifikasi
- ✅ Export PDF laporan
- ✅ Buku tamu digital
- ✅ Log aktivitas
- ✅ Recycle bin
- ✅ Penelusuran data
- ✅ Mode admin dan user
- ✅ Integrasi Supabase
- ✅ Real-time updates