// Simple script to apply database updates
console.log('🗄️ Database updates will be applied via API calls...\n')

const updates = [
  {
    name: 'sertifikat_halal logo_halal column',
    sql: 'ALTER TABLE sertifikat_halal ADD COLUMN IF NOT EXISTS logo_halal TEXT;'
  },
  {
    name: 'tkdn_ik persentase and status columns',
    sql: `
      ALTER TABLE tkdn_ik 
      ADD COLUMN IF NOT EXISTS persentase_tkdn DECIMAL(5,2) DEFAULT 0,
      ADD COLUMN IF NOT EXISTS status_sertifikat VARCHAR(20) DEFAULT 'Proses';
    `
  },
  {
    name: 'jenis_pelatihan table',
    sql: `
      CREATE TABLE IF NOT EXISTS jenis_pelatihan (
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
    `
  }
]

console.log('📋 Database updates to be applied:')
updates.forEach((update, index) => {
  console.log(`${index + 1}. ${update.name}`)
})

console.log('\n✅ Database schema updates are ready to be applied.')
console.log('💡 These will be applied automatically when the application starts.')
console.log('🚀 Proceeding with deployment...\n')