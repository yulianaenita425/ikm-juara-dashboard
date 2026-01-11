// Script untuk memperbaiki schema TKDN secara manual
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://xflxzpycfwopaupznlvu.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhmbHh6cHljZndvcGF1cHpubHZ1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Nzk3MzQ3NCwiZXhwIjoyMDgzNTQ5NDc0fQ.1GbJFh6zOyJnOMin_Rw5gQ6A88swldvCh1F0h4kRNbg'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function manualSchemaFix() {
  console.log('🔧 Memperbaiki schema TKDN secara manual...')
  
  try {
    // 1. Ambil semua data TKDN yang ada
    console.log('📋 Mengambil data TKDN yang ada...')
    const { data: existingData, error: fetchError } = await supabase
      .from('tkdn_ik')
      .select('*')

    if (fetchError) {
      console.error('❌ Error mengambil data:', fetchError.message)
      return
    }

    console.log(`✅ Ditemukan ${existingData.length} record TKDN`)

    // 2. Buat tabel baru dengan schema yang benar
    console.log('🏗️  Membuat tabel tkdn_ik_new dengan schema yang benar...')
    
    // Karena tidak bisa ALTER TABLE, kita akan menggunakan workaround
    // dengan membuat view atau mengupdate API untuk handle missing columns
    
    console.log('📋 Schema yang diperlukan:')
    console.log('- id (UUID)')
    console.log('- ikm_id (UUID)')
    console.log('- nomor_sertifikat (TEXT)')
    console.log('- persentase_tkdn (DECIMAL) ✅ Sudah ada')
    console.log('- status_sertifikat (VARCHAR) ❌ Belum ada')
    console.log('- link_sertifikat (TEXT)')
    console.log('- tahun_terbit (INTEGER)')
    console.log('- created_at, updated_at, deleted_at')

    console.log('\n🔧 Solusi sementara: Update API untuk handle missing column')
    
    // Test insert dengan data lengkap
    console.log('🧪 Testing insert data dengan semua field...')
    
    // Ambil IKM pertama untuk testing
    const { data: ikmData, error: ikmError } = await supabase
      .from('ikm_binaan')
      .select('id')
      .limit(1)
      .single()

    if (ikmError || !ikmData) {
      console.log('⚠️  No IKM data for testing')
      return
    }

    // Test insert tanpa status_sertifikat dulu
    const testData = {
      ikm_id: ikmData.id,
      nomor_sertifikat: 'TEST-MANUAL-001',
      persentase_tkdn: 45.5,
      link_sertifikat: 'https://example.com/test-manual',
      tahun_terbit: 2024
    }

    const { data: insertData, error: insertError } = await supabase
      .from('tkdn_ik')
      .insert([testData])
      .select()

    if (insertError) {
      console.error('❌ Test insert failed:', insertError.message)
    } else {
      console.log('✅ Test insert berhasil (tanpa status_sertifikat):', insertData[0])
      
      // Clean up
      await supabase
        .from('tkdn_ik')
        .delete()
        .eq('id', insertData[0].id)
      console.log('🧹 Test data cleaned up')
    }

    console.log('\n📋 INSTRUKSI MANUAL:')
    console.log('1. Buka Supabase Dashboard: https://supabase.com/dashboard')
    console.log('2. Pilih project: xflxzpycfwopaupznlvu')
    console.log('3. Buka SQL Editor')
    console.log('4. Jalankan SQL berikut:')
    console.log(`
-- Tambahkan kolom status_sertifikat
ALTER TABLE tkdn_ik 
ADD COLUMN status_sertifikat VARCHAR(20) DEFAULT 'Proses';

-- Tambahkan constraint
ALTER TABLE tkdn_ik 
ADD CONSTRAINT tkdn_ik_status_check 
CHECK (status_sertifikat IN ('Telah Didaftar', 'Proses', 'Ditolak'));

-- Update existing records
UPDATE tkdn_ik 
SET status_sertifikat = 'Proses' 
WHERE status_sertifikat IS NULL OR status_sertifikat = '';
    `)

  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

manualSchemaFix()