// Script untuk menambahkan kolom status_sertifikat ke tabel tkdn_ik
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://xflxzpycfwopaupznlvu.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhmbHh6cHljZndvcGF1cHpubHZ1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Nzk3MzQ3NCwiZXhwIjoyMDgzNTQ5NDc0fQ.1GbJFh6zOyJnOMin_Rw5gQ6A88swldvCh1F0h4kRNbg'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function addStatusSertifikatColumn() {
  console.log('🔧 Menambahkan kolom status_sertifikat ke tabel tkdn_ik...')
  
  try {
    // Gunakan raw SQL untuk menambahkan kolom
    const { data, error } = await supabase.rpc('exec_sql', {
      sql: `
        -- Tambahkan kolom status_sertifikat
        ALTER TABLE tkdn_ik 
        ADD COLUMN IF NOT EXISTS status_sertifikat VARCHAR(20) DEFAULT 'Proses';
        
        -- Tambahkan constraint
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
        
        -- Update existing records
        UPDATE tkdn_ik 
        SET status_sertifikat = 'Proses' 
        WHERE status_sertifikat IS NULL;
        
        SELECT 'Schema updated successfully' as result;
      `
    })

    if (error) {
      console.error('❌ Error executing SQL:', error)
      
      // Coba metode alternatif
      console.log('🔄 Mencoba metode alternatif...')
      
      // Cek apakah kolom sudah ada
      const { data: checkData, error: checkError } = await supabase
        .from('information_schema.columns')
        .select('column_name')
        .eq('table_name', 'tkdn_ik')
        .eq('column_name', 'status_sertifikat')

      if (checkError) {
        console.log('⚠️  Tidak bisa mengecek kolom via information_schema')
      } else if (checkData && checkData.length > 0) {
        console.log('✅ Kolom status_sertifikat sudah ada')
      } else {
        console.log('❌ Kolom status_sertifikat belum ada')
        console.log('\n📋 Silakan jalankan SQL berikut di Supabase SQL Editor:')
        console.log(`
ALTER TABLE tkdn_ik 
ADD COLUMN IF NOT EXISTS status_sertifikat VARCHAR(20) DEFAULT 'Proses';

ALTER TABLE tkdn_ik 
ADD CONSTRAINT IF NOT EXISTS tkdn_ik_status_check 
CHECK (status_sertifikat IN ('Telah Didaftar', 'Proses', 'Ditolak'));

UPDATE tkdn_ik 
SET status_sertifikat = 'Proses' 
WHERE status_sertifikat IS NULL;
        `)
      }
    } else {
      console.log('✅ SQL berhasil dijalankan:', data)
    }

    // Test dengan mengambil data
    console.log('🧪 Testing dengan mengambil data...')
    const { data: testData, error: testError } = await supabase
      .from('tkdn_ik')
      .select('id, nomor_sertifikat, persentase_tkdn, status_sertifikat')
      .limit(3)

    if (testError) {
      console.error('❌ Error testing:', testError.message)
    } else {
      console.log('✅ Test berhasil, data:')
      console.table(testData)
    }

  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

addStatusSertifikatColumn()