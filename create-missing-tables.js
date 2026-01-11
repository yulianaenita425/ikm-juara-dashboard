const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')

// Baca environment variables dari .env.local
let envVars = {}
try {
  const envContent = fs.readFileSync('.env.local', 'utf8')
  envContent.split('\n').forEach(line => {
    if (line.includes('=')) {
      const [key, value] = line.split('=')
      envVars[key.trim()] = value.trim()
    }
  })
} catch (err) {
  console.error('Error reading .env.local:', err.message)
  process.exit(1)
}

const supabase = createClient(
  envVars.NEXT_PUBLIC_SUPABASE_URL,
  envVars.SUPABASE_SERVICE_ROLE_KEY
)

async function createMissingTables() {
  console.log('🔧 Checking and creating missing tables...')
  
  try {
    // Daftar tabel yang harus ada
    const requiredTables = [
      'ikm_binaan',
      'hki_merek', 
      'sertifikat_halal',
      'tkdn_ik',
      'siinas',
      'uji_nilai_gizi',
      'kurasi_produk',
      'pelatihan',
      'buku_tamu',
      'users'
    ]
    
    // Cek tabel yang ada
    console.log('📋 Checking existing tables...')
    for (const table of requiredTables) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('*')
          .limit(1)
        
        if (error) {
          console.log(`❌ Table '${table}' does not exist or has error:`, error.message)
          await createTable(table)
        } else {
          console.log(`✅ Table '${table}' exists`)
        }
      } catch (err) {
        console.log(`❌ Error checking table '${table}':`, err.message)
      }
    }
    
    console.log('\n🎉 Table check completed!')
    
  } catch (error) {
    console.error('❌ Error:', error)
  }
}

async function createTable(tableName) {
  console.log(`🔨 Creating table: ${tableName}`)
  
  const tableDefinitions = {
    tkdn_ik: `
      CREATE TABLE tkdn_ik (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        ikm_id UUID REFERENCES ikm_binaan(id) ON DELETE CASCADE,
        nomor_sertifikat TEXT NOT NULL,
        link_sertifikat TEXT NOT NULL,
        tahun_terbit INTEGER NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        deleted_at TIMESTAMP WITH TIME ZONE NULL
      );
      CREATE INDEX idx_tkdn_ik_ikm_id ON tkdn_ik(ikm_id);
    `,
    siinas: `
      CREATE TABLE siinas (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        ikm_id UUID REFERENCES ikm_binaan(id) ON DELETE CASCADE,
        nomor_bukti_akun TEXT NOT NULL,
        tahun_registrasi INTEGER NOT NULL,
        link_bukti TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        deleted_at TIMESTAMP WITH TIME ZONE NULL
      );
      CREATE INDEX idx_siinas_ikm_id ON siinas(ikm_id);
    `,
    uji_nilai_gizi: `
      CREATE TABLE uji_nilai_gizi (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        ikm_id UUID REFERENCES ikm_binaan(id) ON DELETE CASCADE,
        nomor_lhu TEXT NOT NULL,
        tanggal_hasil_uji DATE NOT NULL,
        tahun_fasilitasi INTEGER NOT NULL,
        link_lhu TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        deleted_at TIMESTAMP WITH TIME ZONE NULL
      );
      CREATE INDEX idx_uji_nilai_gizi_ikm_id ON uji_nilai_gizi(ikm_id);
    `,
    kurasi_produk: `
      CREATE TABLE kurasi_produk (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        ikm_id UUID REFERENCES ikm_binaan(id) ON DELETE CASCADE,
        nomor_sertifikat TEXT NOT NULL,
        link_sertifikat TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        deleted_at TIMESTAMP WITH TIME ZONE NULL
      );
      CREATE INDEX idx_kurasi_produk_ikm_id ON kurasi_produk(ikm_id);
    `,
    pelatihan: `
      CREATE TABLE pelatihan (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        ikm_id UUID REFERENCES ikm_binaan(id) ON DELETE CASCADE,
        nama_pelatihan TEXT NOT NULL,
        tanggal_pelatihan DATE NOT NULL,
        sertifikat TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        deleted_at TIMESTAMP WITH TIME ZONE NULL
      );
      CREATE INDEX idx_pelatihan_ikm_id ON pelatihan(ikm_id);
    `,
    buku_tamu: `
      CREATE TABLE buku_tamu (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        nama_lengkap TEXT NOT NULL,
        nomor_hp VARCHAR(20) NOT NULL,
        alamat_lengkap TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `,
    users: `
      CREATE TABLE users (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        username VARCHAR(50) NOT NULL UNIQUE,
        password TEXT NOT NULL,
        role VARCHAR(10) CHECK (role IN ('admin', 'user')) DEFAULT 'user',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
      INSERT INTO users (username, password, role) VALUES
      ('admin', '$2a$10$dummy_hash_admin', 'admin'),
      ('user', '$2a$10$dummy_hash_user', 'user');
    `
  }
  
  if (tableDefinitions[tableName]) {
    try {
      const { error } = await supabase.rpc('exec_sql', {
        sql: tableDefinitions[tableName]
      })
      
      if (error) {
        console.log(`❌ Error creating table ${tableName}:`, error.message)
      } else {
        console.log(`✅ Table ${tableName} created successfully`)
      }
    } catch (err) {
      console.log(`❌ Error executing SQL for ${tableName}:`, err.message)
    }
  } else {
    console.log(`⚠️ No definition found for table: ${tableName}`)
  }
}

// Jalankan script
createMissingTables()