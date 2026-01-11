-- Fix TKDN database schema
-- Execute this in Supabase SQL Editor

-- 1. Add persentase_tkdn column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'tkdn_ik' AND column_name = 'persentase_tkdn'
  ) THEN
    ALTER TABLE tkdn_ik ADD COLUMN persentase_tkdn DECIMAL(5,2) DEFAULT 0.00;
    RAISE NOTICE 'Added persentase_tkdn column';
  ELSE
    RAISE NOTICE 'persentase_tkdn column already exists';
  END IF;
END $$;

-- 2. Update existing records to have default value
UPDATE tkdn_ik SET persentase_tkdn = 0.00 WHERE persentase_tkdn IS NULL;

-- 3. Ensure proper data types and constraints
ALTER TABLE tkdn_ik ALTER COLUMN persentase_tkdn SET DEFAULT 0.00;
ALTER TABLE tkdn_ik ADD CONSTRAINT check_persentase_tkdn CHECK (persentase_tkdn >= 0 AND persentase_tkdn <= 100);

-- 4. Add sample data for testing
INSERT INTO tkdn_ik (ikm_id, nomor_sertifikat, persentase_tkdn, status_sertifikat, tahun_terbit)
VALUES 
  ('e8d44eb5-2ebe-4e7e-8004-348ab4031566', 'TKDN-001-2024', 85.50, 'Aktif', 2024),
  ('5743adff-40ae-4f74-9094-123456789012', 'TKDN-002-2024', 92.75, 'Aktif', 2024)
ON CONFLICT (nomor_sertifikat) DO NOTHING;

-- 5. Refresh schema cache
SELECT pg_notify('pgrst', 'reload schema');

-- 6. Verify the fix
SELECT 
  column_name, 
  data_type, 
  is_nullable, 
  column_default
FROM information_schema.columns 
WHERE table_name = 'tkdn_ik' 
  AND column_name = 'persentase_tkdn';

-- 7. Test query
SELECT 
  t.*,
  i.nama_lengkap,
  i.nama_usaha,
  i.nib
FROM tkdn_ik t
LEFT JOIN ikm_binaan i ON t.ikm_id = i.id
WHERE t.deleted_at IS NULL
ORDER BY t.created_at DESC;