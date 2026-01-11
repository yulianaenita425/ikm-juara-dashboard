-- Script untuk menjalankan semua update database
-- Jalankan script ini di Supabase SQL Editor

-- 1. Update sertifikat_halal schema
ALTER TABLE sertifikat_halal 
ADD COLUMN IF NOT EXISTS logo_halal TEXT;

COMMENT ON COLUMN sertifikat_halal.logo_halal IS 'Link ke file logo halal di Google Drive';

-- 2. Update tkdn_ik schema
ALTER TABLE tkdn_ik 
ADD COLUMN IF NOT EXISTS persentase_tkdn DECIMAL(5,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS status_sertifikat VARCHAR(20) DEFAULT 'Proses';

ALTER TABLE tkdn_ik 
DROP CONSTRAINT IF EXISTS tkdn_ik_status_sertifikat_check;

ALTER TABLE tkdn_ik 
ADD CONSTRAINT tkdn_ik_status_sertifikat_check 
CHECK (status_sertifikat IN ('Telah Didaftar', 'Proses', 'Ditolak'));

COMMENT ON COLUMN tkdn_ik.persentase_tkdn IS 'Persentase TKDN dalam bentuk desimal (0-100)';
COMMENT ON COLUMN tkdn_ik.status_sertifikat IS 'Status sertifikat TKDN: Telah Didaftar, Proses, Ditolak';

-- 3. Update pelatihan schema
CREATE TABLE IF NOT EXISTS jenis_pelatihan (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    jenis_pelatihan TEXT NOT NULL,
    sub_kegiatan TEXT NOT NULL,
    waktu_pelaksanaan TEXT NOT NULL,
    tempat TEXT NOT NULL,
    link_materi TEXT,
    tahun_pelaksanaan INTEGER NOT NULL,
    status VARCHAR(20) CHECK (status IN ('Aktif', 'Selesai', 'Ditunda')) DEFAULT 'Aktif',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE NULL
);

ALTER TABLE pelatihan 
ADD COLUMN IF NOT EXISTS jenis_pelatihan_id UUID REFERENCES jenis_pelatihan(id) ON DELETE CASCADE;

-- Index untuk performa
CREATE INDEX IF NOT EXISTS idx_jenis_pelatihan_tahun ON jenis_pelatihan(tahun_pelaksanaan);
CREATE INDEX IF NOT EXISTS idx_jenis_pelatihan_status ON jenis_pelatihan(status);
CREATE INDEX IF NOT EXISTS idx_pelatihan_jenis ON pelatihan(jenis_pelatihan_id);

-- Comment untuk dokumentasi
COMMENT ON TABLE jenis_pelatihan IS 'Master data jenis pelatihan yang tersedia';
COMMENT ON COLUMN jenis_pelatihan.waktu_pelaksanaan IS 'Waktu pelaksanaan pelatihan (tanggal dan jam)';
COMMENT ON COLUMN jenis_pelatihan.tempat IS 'Tempat pelaksanaan pelatihan';
COMMENT ON COLUMN jenis_pelatihan.link_materi IS 'Link ke materi pelatihan di Google Drive';

-- Insert sample data untuk jenis_pelatihan
INSERT INTO jenis_pelatihan (jenis_pelatihan, sub_kegiatan, waktu_pelaksanaan, tempat, tahun_pelaksanaan, status)
VALUES 
('Digital Marketing untuk UMKM', 'Pemasaran Online dan Media Sosial', '15-17 Januari 2024, 08:00-16:00 WIB', 'Aula Dinas Perindustrian Kota Madiun', 2024, 'Aktif'),
('Manajemen Keuangan UMKM', 'Pembukuan dan Laporan Keuangan', '20-22 Februari 2024, 08:00-16:00 WIB', 'Aula Dinas Perindustrian Kota Madiun', 2024, 'Aktif'),
('Pengembangan Produk', 'Inovasi dan Desain Produk', '10-12 Maret 2024, 08:00-16:00 WIB', 'Aula Dinas Perindustrian Kota Madiun', 2024, 'Selesai')
ON CONFLICT DO NOTHING;