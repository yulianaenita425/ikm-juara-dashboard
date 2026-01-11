// Script sederhana untuk memperbaiki schema TKDN
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://xflxzpycfwopaupznlvu.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhmbHh6cHljZndvcGF1cHpubHZ1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Nzk3MzQ3NCwiZXhwIjoyMDgzNTQ5NDc0fQ.1GbJFh6zOyJnOMin_Rw5gQ6A88swldvCh1F0h4kRNbg'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function fixTkdnSchema() {
  console.log('🔧 Memperbaiki schema tabel tkdn_ik...')
  
  try {
    // 1. Tambahkan kolom persentase_tkdn
    console.log('📝 Menambahkan kolom persentase_tkdn...')
    const { error: error1 } = await supabase
      .from('tkdn_ik')
      .select('persentase_tkdn')
      .limit(1)
    
    if (error1 && error1.message.includes('persentase_tkdn')) {
      console.log('❌ Kolom persentase_tkdn tidak ada, perlu ditambahkan via SQL Editor')
    } else {
      console.log('✅ Kolom persentase_tkdn sudah ada')
    }

    // 2. Tambahkan kolom status_sertifikat
    console.log('📝 Mengecek kolom status_sertifikat...')
    const { error: error2 } = await supabase
      .from('tkdn_ik')
      .select('status_sertifikat')
      .limit(1)
    
    if (error2 && error2.message.includes('status_sertifikat')) {
      console.log('❌ Kolom status_sertifikat tidak ada, perlu ditambahkan via SQL Editor')
    } else {
      console.log('✅ Kolom status_sertifikat sudah ada')
    }

    // 3. Test dengan data yang ada
    console.log('🔍 Mengecek data yang ada...')
    const { data: existingData, error: error3 } = await supabase
      .from('tkdn_ik')
      .select('*')
      .limit(5)

    if (error3) {
      console.error('❌ Error mengecek data:', error3.message)
      console.log('\n📋 SQL yang perlu dijalankan di Supabase SQL Editor:')
      console.log(`
-- Tambahkan kolom yang hilang
ALTER TABLE tkdn_ik ADD COLUMN IF NOT EXISTS persentase_tkdn DECIMAL(5,2) DEFAULT 0;
ALTER TABLE tkdn_ik ADD COLUMN IF NOT EXISTS status_sertifikat VARCHAR(20) DEFAULT 'Proses';

-- Tambahkan constraint
ALTER TABLE tkdn_ik ADD CONSTRAINT IF NOT EXISTS tkdn_ik_status_check 
CHECK (status_sertifikat IN ('Telah Didaftar', 'Proses', 'Ditolak'));
      `)
    } else {
      console.log('✅ Data berhasil diambil:', existingData?.length || 0, 'records')
      if (existingData && existingData.length > 0) {
        console.log('📋 Sample data:', existingData[0])
      }
    }

  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

fixTkdnSchema()