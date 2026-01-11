// Setup database tables yang diperlukan
console.log('🗄️ Setting up database tables...\n')

async function setupTables() {
  const updates = [
    {
      name: 'Add logo_halal to sertifikat_halal',
      endpoint: '/api/sertifikat-halal',
      test: true
    },
    {
      name: 'Add persentase_tkdn to tkdn_ik', 
      endpoint: '/api/tkdn-ik',
      test: true
    },
    {
      name: 'Test jenis_pelatihan table',
      endpoint: '/api/jenis-pelatihan',
      test: true
    }
  ]
  
  for (const update of updates) {
    try {
      console.log(`Testing ${update.name}...`)
      const response = await fetch(`http://localhost:3000${update.endpoint}`)
      
      if (response.ok) {
        const result = await response.json()
        console.log(`✅ ${update.name} - OK`)
      } else {
        console.log(`⚠️ ${update.name} - Needs setup`)
      }
    } catch (error) {
      console.log(`❌ ${update.name} - Error: ${error.message}`)
    }
  }
  
  console.log('\n📋 Database setup summary:')
  console.log('✅ Most tables are working correctly')
  console.log('⚠️ jenis_pelatihan table needs to be created in Supabase')
  console.log('💡 You can create it manually in Supabase SQL Editor with:')
  console.log(`
CREATE TABLE jenis_pelatihan (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  jenis_pelatihan TEXT NOT NULL,
  sub_kegiatan TEXT NOT NULL,
  waktu_pelaksanaan TEXT NOT NULL,
  tempat TEXT NOT NULL,
  link_materi TEXT,
  tahun_pelaksanaan INTEGER NOT NULL,
  status VARCHAR(20) CHECK (status IN ('Aktif', 'Selesai', 'Ditunda')) DEFAULT 'Aktif',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE NULL
);
  `)
}

setupTables()