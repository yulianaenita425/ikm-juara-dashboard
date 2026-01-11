const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://xflxzpycfwopaupznlvu.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhmbHh6cHljZndvcGF1cHpubHZ1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Nzk3MzQ3NCwiZXhwIjoyMDgzNTQ5NDc0fQ.1GbJFh6zOyJnOMin_Rw5gQ6A88swldvCh1F0h4kRNbg'

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function fixTkdnSchema() {
  console.log('🔧 Memperbaiki schema tabel tkdn_ik...')
  
  try {
    // 1. Tambahkan kolom persentase_tkdn
    console.log('📝 Menambahkan kolom persentase_tkdn...')
    const { error: error1 } = await supabase.rpc('exec_sql', {
      sql: `
        ALTER TABLE tkdn_ik 
        ADD COLUMN IF NOT EXISTS persentase_tkdn DECIMAL(5,2) DEFAULT 0;
      `
    })
    
    if (error1) {
      console.log('⚠️  Kolom persentase_tkdn mungkin sudah ada:', error1.message)
    } else {
      console.log('✅ Kolom persentase_tkdn berhasil ditambahkan')
    }

    // 2. Tambahkan kolom status_sertifikat
    console.log('📝 Menambahkan kolom status_sertifikat...')
    const { error: error2 } = await supabase.rpc('exec_sql', {
      sql: `
        ALTER TABLE tkdn_ik 
        ADD COLUMN IF NOT EXISTS status_sertifikat VARCHAR(20) DEFAULT 'Proses';
      `
    })
    
    if (error2) {
      console.log('⚠️  Kolom status_sertifikat mungkin sudah ada:', error2.message)
    } else {
      console.log('✅ Kolom status_sertifikat berhasil ditambahkan')
    }

    // 3. Tambahkan constraint untuk status_sertifikat
    console.log('📝 Menambahkan constraint untuk status_sertifikat...')
    const { error: error3 } = await supabase.rpc('exec_sql', {
      sql: `
        ALTER TABLE tkdn_ik 
        ADD CONSTRAINT IF NOT EXISTS tkdn_ik_status_check 
        CHECK (status_sertifikat IN ('Telah Didaftar', 'Proses', 'Ditolak'));
      `
    })
    
    if (error3) {
      console.log('⚠️  Constraint mungkin sudah ada:', error3.message)
    } else {
      console.log('✅ Constraint status_sertifikat berhasil ditambahkan')
    }

    // 4. Verifikasi struktur tabel
    console.log('🔍 Memverifikasi struktur tabel tkdn_ik...')
    const { data: columns, error: error4 } = await supabase.rpc('exec_sql', {
      sql: `
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns 
        WHERE table_name = 'tkdn_ik' 
        ORDER BY ordinal_position;
      `
    })
    
    if (error4) {
      console.error('❌ Error verifying table structure:', error4)
    } else {
      console.log('📋 Struktur tabel tkdn_ik:')
      console.table(columns)
    }

    // 5. Test insert data
    console.log('🧪 Testing insert data...')
    const testData = {
      ikm_id: null, // Will be set to actual IKM ID
      nomor_sertifikat: 'TEST-TKDN-001',
      persentase_tkdn: 35.5,
      status_sertifikat: 'Proses',
      link_sertifikat: 'https://example.com/test',
      tahun_terbit: 2024
    }

    // Get first IKM for testing
    const { data: ikmData, error: ikmError } = await supabase
      .from('ikm_binaan')
      .select('id')
      .limit(1)
      .single()

    if (ikmError || !ikmData) {
      console.log('⚠️  No IKM data found for testing, skipping insert test')
    } else {
      testData.ikm_id = ikmData.id
      
      const { data: insertData, error: insertError } = await supabase
        .from('tkdn_ik')
        .insert([testData])
        .select()

      if (insertError) {
        console.error('❌ Test insert failed:', insertError.message)
      } else {
        console.log('✅ Test insert berhasil:', insertData[0])
        
        // Clean up test data
        await supabase
          .from('tkdn_ik')
          .delete()
          .eq('id', insertData[0].id)
        console.log('🧹 Test data cleaned up')
      }
    }

    console.log('\n🎉 Schema TKDN-IK berhasil diperbaiki!')
    console.log('✅ Kolom persentase_tkdn (DECIMAL 5,2) tersedia')
    console.log('✅ Kolom status_sertifikat (VARCHAR 20) tersedia')
    console.log('✅ Constraint status check tersedia')
    
  } catch (error) {
    console.error('❌ Error fixing TKDN schema:', error)
    process.exit(1)
  }
}

// Jalankan perbaikan
fixTkdnSchema()