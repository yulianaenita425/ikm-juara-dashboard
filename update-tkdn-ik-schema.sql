-- Update schema untuk tabel tkdn_ik
-- Menambahkan kolom persentase_tkdn dan status_sertifikat

ALTER TABLE tkdn_ik 
ADD COLUMN IF NOT EXISTS persentase_tkdn DECIMAL(5,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS status_sertifikat VARCHAR(20) DEFAULT 'Proses';

-- Update constraint untuk status_sertifikat
ALTER TABLE tkdn_ik 
DROP CONSTRAINT IF EXISTS tkdn_ik_status_sertifikat_check;

ALTER TABLE tkdn_ik 
ADD CONSTRAINT tkdn_ik_status_sertifikat_check 
CHECK (status_sertifikat IN ('Telah Didaftar', 'Proses', 'Ditolak'));

-- Update comment untuk kolom baru
COMMENT ON COLUMN tkdn_ik.persentase_tkdn IS 'Persentase TKDN dalam bentuk desimal (0-100)';
COMMENT ON COLUMN tkdn_ik.status_sertifikat IS 'Status sertifikat TKDN: Telah Didaftar, Proses, Ditolak';