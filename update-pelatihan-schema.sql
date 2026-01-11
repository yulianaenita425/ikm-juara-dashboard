-- Update schema untuk sistem pelatihan
-- Membuat tabel jenis_pelatihan dan memperbarui tabel pelatihan

-- Tabel Jenis Pelatihan (Master)
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

-- Update tabel pelatihan untuk referensi ke jenis_pelatihan
ALTER TABLE pelatihan 
ADD COLUMN IF NOT EXISTS jenis_pelatihan_id UUID REFERENCES jenis_pelatihan(id) ON DELETE CASCADE;

-- Jika kolom nama_pelatihan masih ada, kita bisa mempertahankannya untuk backward compatibility
-- atau menghapusnya jika sudah tidak diperlukan

-- Index untuk performa
CREATE INDEX IF NOT EXISTS idx_jenis_pelatihan_tahun ON jenis_pelatihan(tahun_pelaksanaan);
CREATE INDEX IF NOT EXISTS idx_jenis_pelatihan_status ON jenis_pelatihan(status);
CREATE INDEX IF NOT EXISTS idx_pelatihan_jenis ON pelatihan(jenis_pelatihan_id);

-- Comment untuk dokumentasi
COMMENT ON TABLE jenis_pelatihan IS 'Master data jenis pelatihan yang tersedia';
COMMENT ON COLUMN jenis_pelatihan.waktu_pelaksanaan IS 'Waktu pelaksanaan pelatihan (tanggal dan jam)';
COMMENT ON COLUMN jenis_pelatihan.tempat IS 'Tempat pelaksanaan pelatihan';
COMMENT ON COLUMN jenis_pelatihan.link_materi IS 'Link ke materi pelatihan di Google Drive';