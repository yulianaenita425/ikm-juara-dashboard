-- Setup Row Level Security (RLS) untuk Supabase
-- Jalankan script ini setelah database-setup.sql

-- Enable RLS untuk semua tabel
ALTER TABLE ikm_binaan ENABLE ROW LEVEL SECURITY;
ALTER TABLE hki_merek ENABLE ROW LEVEL SECURITY;
ALTER TABLE sertifikat_halal ENABLE ROW LEVEL SECURITY;
ALTER TABLE tkdn_ik ENABLE ROW LEVEL SECURITY;
ALTER TABLE siinas ENABLE ROW LEVEL SECURITY;
ALTER TABLE uji_nilai_gizi ENABLE ROW LEVEL SECURITY;
ALTER TABLE kurasi_produk ENABLE ROW LEVEL SECURITY;
ALTER TABLE pelatihan ENABLE ROW LEVEL SECURITY;
ALTER TABLE buku_tamu ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Policy untuk akses penuh (sementara untuk development)
-- Dalam production, sesuaikan dengan kebutuhan autentikasi

-- IKM Binaan policies
CREATE POLICY "Allow all operations on ikm_binaan" ON ikm_binaan
    FOR ALL USING (true) WITH CHECK (true);

-- HKI Merek policies
CREATE POLICY "Allow all operations on hki_merek" ON hki_merek
    FOR ALL USING (true) WITH CHECK (true);

-- Sertifikat Halal policies
CREATE POLICY "Allow all operations on sertifikat_halal" ON sertifikat_halal
    FOR ALL USING (true) WITH CHECK (true);

-- TKDN IK policies
CREATE POLICY "Allow all operations on tkdn_ik" ON tkdn_ik
    FOR ALL USING (true) WITH CHECK (true);

-- SIINas policies
CREATE POLICY "Allow all operations on siinas" ON siinas
    FOR ALL USING (true) WITH CHECK (true);

-- Uji Nilai Gizi policies
CREATE POLICY "Allow all operations on uji_nilai_gizi" ON uji_nilai_gizi
    FOR ALL USING (true) WITH CHECK (true);

-- Kurasi Produk policies
CREATE POLICY "Allow all operations on kurasi_produk" ON kurasi_produk
    FOR ALL USING (true) WITH CHECK (true);

-- Pelatihan policies
CREATE POLICY "Allow all operations on pelatihan" ON pelatihan
    FOR ALL USING (true) WITH CHECK (true);

-- Buku Tamu policies
CREATE POLICY "Allow all operations on buku_tamu" ON buku_tamu
    FOR ALL USING (true) WITH CHECK (true);

-- Users policies (hanya untuk admin)
CREATE POLICY "Allow all operations on users" ON users
    FOR ALL USING (true) WITH CHECK (true);