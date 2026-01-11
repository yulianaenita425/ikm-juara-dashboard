-- Script untuk memperbaiki schema tabel tkdn_ik
-- Jalankan di Supabase SQL Editor

-- 1. Tambahkan kolom persentase_tkdn jika belum ada
ALTER TABLE tkdn_ik 
ADD COLUMN IF NOT EXISTS persentase_tkdn DECIMAL(5,2) DEFAULT 0;

-- 2. Tambahkan kolom status_sertifikat jika belum ada
ALTER TABLE tkdn_ik 
ADD COLUMN IF NOT EXISTS status_sertifikat VARCHAR(20) DEFAULT 'Proses';

-- 3. Tambahkan constraint untuk status_sertifikat
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'tkdn_ik_status_check' 
        AND table_name = 'tkdn_ik'
    ) THEN
        ALTER TABLE tkdn_ik 
        ADD CONSTRAINT tkdn_ik_status_check 
        CHECK (status_sertifikat IN ('Telah Didaftar', 'Proses', 'Ditolak'));
    END IF;
END $$;

-- 4. Update existing records to have default values
UPDATE tkdn_ik 
SET persentase_tkdn = 0 
WHERE persentase_tkdn IS NULL;

UPDATE tkdn_ik 
SET status_sertifikat = 'Proses' 
WHERE status_sertifikat IS NULL;

-- 5. Verifikasi struktur tabel
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'tkdn_ik' 
ORDER BY ordinal_position;