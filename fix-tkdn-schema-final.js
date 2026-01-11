// Script untuk memperbaiki TKDN schema secara final
const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')

// Read environment variables manually
const envContent = fs.readFileSync('.env.local', 'utf8')
const envVars = {}
envContent.split('\n').forEach(line => {
  const [key, value] = line.split('=')
  if (key && value) {
    envVars[key.trim()] = value.trim()
  }
})

const supabase = createClient(
  envVars.NEXT_PUBLIC_SUPABASE_URL,
  envVars.SUPABASE_SERVICE_ROLE_KEY
)

console.log('🔧 FIXING TKDN SCHEMA - FINAL FIX')
console.log('='.repeat(50))

async function fixTkdnSchema() {
  try {
    console.log('1. 🔍 Checking current TKDN table structure...')
    
    // Check if table exists and get structure
    const { data: tableInfo, error: tableError } = await supabase
      .from('tkdn_ik')
      .select('*')
      .limit(1)
    
    if (tableError) {
      console.log('❌ Table access error:', tableError.message)
      console.log('🔧 Creating TKDN table with proper schema...')
      
      // Create table with proper schema
      const createTableSQL = `
        CREATE TABLE IF NOT EXISTS tkdn_ik (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          ikm_id UUID REFERENCES ikm_binaan(id),
          nomor_sertifikat TEXT NOT NULL,
          persentase_tkdn DECIMAL(5,2) DEFAULT 0.00,
          status_sertifikat VARCHAR(50) DEFAULT 'Proses',
          link_sertifikat TEXT,
          tahun_terbit INTEGER,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          deleted_at TIMESTAMP WITH TIME ZONE NULL
        );
        
        -- Add indexes for better performance
        CREATE INDEX IF NOT EXISTS idx_tkdn_ik_ikm_id ON tkdn_ik(ikm_id);
        CREATE INDEX IF NOT EXISTS idx_tkdn_ik_deleted_at ON tkdn_ik(deleted_at);
        
        -- Add RLS policies
        ALTER TABLE tkdn_ik ENABLE ROW LEVEL SECURITY;
        
        CREATE POLICY "Allow all operations for authenticated users" ON tkdn_ik
        FOR ALL USING (true);
      `
      
      console.log('📝 SQL to execute in Supabase SQL Editor:')
      console.log(createTableSQL)
      
    } else {
      console.log('✅ Table exists, checking for persentase_tkdn column...')
      
      // Try to add the column if it doesn't exist
      const alterTableSQL = `
        -- Add persentase_tkdn column if it doesn't exist
        DO $$ 
        BEGIN
          IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'tkdn_ik' AND column_name = 'persentase_tkdn'
          ) THEN
            ALTER TABLE tkdn_ik ADD COLUMN persentase_tkdn DECIMAL(5,2) DEFAULT 0.00;
          END IF;
        END $$;
        
        -- Update existing records to have default value
        UPDATE tkdn_ik SET persentase_tkdn = 0.00 WHERE persentase_tkdn IS NULL;
      `
      
      console.log('📝 SQL to execute in Supabase SQL Editor:')
      console.log(alterTableSQL)
    }
    
    console.log('\n2. 🧪 Testing TKDN API after schema fix...')
    
    // Test the API
    const testData = {
      ikm_id: 'e8d44eb5-2ebe-4e7e-8004-348ab4031566', // HERLIN PURNAWATI
      nomor_sertifikat: 'TKDN-TEST-001',
      persentase_tkdn: 75.50,
      status_sertifikat: 'Aktif',
      tahun_terbit: 2024
    }
    
    console.log('📊 Test data:', testData)
    
    // Try to insert test data
    const { data: insertData, error: insertError } = await supabase
      .from('tkdn_ik')
      .insert([testData])
      .select(`
        *,
        ikm_binaan (
          nib,
          nik,
          nama_lengkap,
          nama_usaha
        )
      `)
    
    if (insertError) {
      console.log('❌ Insert test failed:', insertError.message)
      console.log('🔧 Manual schema fix required in Supabase')
    } else {
      console.log('✅ Insert test successful!')
      console.log('📊 Inserted data:', insertData[0])
      
      // Clean up test data
      await supabase
        .from('tkdn_ik')
        .delete()
        .eq('nomor_sertifikat', 'TKDN-TEST-001')
      
      console.log('🧹 Test data cleaned up')
    }
    
    console.log('\n3. 📋 SUMMARY:')
    console.log('✅ TKDN schema fix prepared')
    console.log('✅ SQL scripts ready for execution')
    console.log('✅ API test completed')
    
    return {
      status: 'SCHEMA_FIX_READY',
      requiresManualSQL: true,
      sqlProvided: true
    }
    
  } catch (error) {
    console.error('❌ Error fixing TKDN schema:', error)
    return {
      status: 'ERROR',
      error: error.message
    }
  }
}

fixTkdnSchema().then(result => {
  console.log('\n🎯 RESULT:', result)
})