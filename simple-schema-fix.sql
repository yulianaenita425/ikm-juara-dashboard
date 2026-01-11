-- Perbaikan Database Schema - Versi Sederhana
-- Copy dan paste ke Supabase SQL Editor

-- Tambah kolom jenis_pelatihan_id ke tabel pelatihan
ALTER TABLE pelatihan 
ADD COLUMN IF NOT EXISTS jenis_pelatihan_id UUID;

-- Tambah foreign key constraint
ALTER TABLE pelatihan 
ADD CONSTRAINT fk_pelatihan_jenis 
FOREIGN KEY (jenis_pelatihan_id) 
REFERENCES jenis_pelatihan(id) 
ON DELETE CASCADE;

-- Tambah index untuk performa
CREATE INDEX IF NOT EXISTS idx_pelatihan_jenis_id ON pelatihan(jenis_pelatihan_id);

-- Insert sample data jenis pelatihan
INSERT INTO jenis_pelatihan (jenis_pelatihan, sub_kegiatan, waktu_pelaksanaan, tempat, tahun_pelaksanaan, status) VALUES
('Digital Marketing untuk UMKM', 'Pemasaran Online dan Media Sosial', '2024-01-15 09:00:00', 'Aula DisnakerKUKM Kota Madiun', 2024, 'Aktif')
ON CONFLICT DO NOTHING;