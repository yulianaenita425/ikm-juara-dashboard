-- Update schema untuk tabel sertifikat_halal
-- Menambahkan kolom logo_halal

ALTER TABLE sertifikat_halal 
ADD COLUMN IF NOT EXISTS logo_halal TEXT;

-- Update comment untuk tabel
COMMENT ON COLUMN sertifikat_halal.logo_halal IS 'Link ke file logo halal di Google Drive';