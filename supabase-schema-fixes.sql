-- Database Schema Fixes untuk IKM JUARA
-- Jalankan di Supabase SQL Editor

-- 1. Update tabel pelatihan untuk mendukung jenis_pelatihan_id
ALTER TABLE pelatihan 
ADD COLUMN IF NOT EXISTS jenis_pelatihan_id UUID REFERENCES jenis_pelatihan(id) ON DELETE CASCADE;

-- 2. Update tabel sertifikat_halal untuk menambahkan kolom yang hilang
ALTER TABLE sertifikat_halal 
ADD COLUMN IF NOT EXISTS status_sertifikat VARCHAR(20) CHECK (status_sertifikat IN ('Telah Didaftar', 'Proses', 'Ditolak')) DEFAULT 'Proses',
ADD COLUMN IF NOT EXISTS link_logo TEXT;

-- 3. Update tabel tkdn_ik untuk menambahkan kolom yang hilang
ALTER TABLE tkdn_ik 
ADD COLUMN IF NOT EXISTS tkdn_percentage VARCHAR(10),
ADD COLUMN IF NOT EXISTS status_sertifikat VARCHAR(20) CHECK (status_sertifikat IN ('Telah Didaftar', 'Proses', 'Ditolak')) DEFAULT 'Proses',
ADD COLUMN IF NOT EXISTS tahun_fasilitasi INTEGER;

-- 4. Update tabel hki_merek untuk menambahkan kolom yang hilang
ALTER TABLE hki_merek 
ADD COLUMN IF NOT EXISTS link_sertifikat TEXT;

-- 5. Update tabel siinas untuk menambahkan kolom yang hilang
ALTER TABLE siinas 
ADD COLUMN IF NOT EXISTS link_dokumen TEXT;

-- 6. Update tabel uji_nilai_gizi untuk menambahkan kolom yang hilang
ALTER TABLE uji_nilai_gizi 
ADD COLUMN IF NOT EXISTS link_dokumen TEXT;

-- 7. Update tabel kurasi_produk untuk menambahkan kolom yang hilang
ALTER TABLE kurasi_produk 
ADD COLUMN IF NOT EXISTS link_dokumen TEXT;

-- 8. Buat index untuk performa yang lebih baik
CREATE INDEX IF NOT EXISTS idx_pelatihan_jenis_id ON pelatihan(jenis_pelatihan_id);
CREATE INDEX IF NOT EXISTS idx_pelatihan_ikm_id ON pelatihan(ikm_id);
CREATE INDEX IF NOT EXISTS idx_hki_merek_ikm_id ON hki_merek(ikm_id);
CREATE INDEX IF NOT EXISTS idx_sertifikat_halal_ikm_id ON sertifikat_halal(ikm_id);
CREATE INDEX IF NOT EXISTS idx_tkdn_ik_ikm_id ON tkdn_ik(ikm_id);
CREATE INDEX IF NOT EXISTS idx_siinas_ikm_id ON siinas(ikm_id);
CREATE INDEX IF NOT EXISTS idx_uji_nilai_gizi_ikm_id ON uji_nilai_gizi(ikm_id);
CREATE INDEX IF NOT EXISTS idx_kurasi_produk_ikm_id ON kurasi_produk(ikm_id);

-- 9. Insert sample data untuk testing
INSERT INTO jenis_pelatihan (jenis_pelatihan, sub_kegiatan, waktu_pelaksanaan, tempat, tahun_pelaksanaan, status) VALUES
('Digital Marketing untuk UMKM', 'Pemasaran Online dan Media Sosial', '2024-01-15 09:00:00', 'Aula DisnakerKUKM Kota Madiun', 2024, 'Aktif'),
('Manajemen Keuangan UMKM', 'Pembukuan dan Laporan Keuangan', '2024-02-20 09:00:00', 'Aula DisnakerKUKM Kota Madiun', 2024, 'Aktif'),
('Pengembangan Produk', 'Inovasi dan Desain Produk', '2024-03-25 09:00:00', 'Aula DisnakerKUKM Kota Madiun', 2024, 'Selesai')
ON CONFLICT DO NOTHING;

-- 10. Update existing data untuk memastikan konsistensi
UPDATE ikm_binaan SET database_indicator = FALSE WHERE database_indicator IS NULL;