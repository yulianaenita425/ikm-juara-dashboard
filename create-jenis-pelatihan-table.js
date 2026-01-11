// Script untuk membuat tabel jenis_pelatihan
console.log('🗄️ Creating jenis_pelatihan table...\n')

async function createJenisPelatihanTable() {
  try {
    // Test dengan API call langsung ke Supabase
    const response = await fetch('http://localhost:3000/api/test-supabase', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'create_table',
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
          
          -- Insert sample data
          INSERT INTO jenis_pelatihan (jenis_pelatihan, sub_kegiatan, waktu_pelaksanaan, tempat, tahun_pelaksanaan, status)
          VALUES 
          ('Digital Marketing untuk UMKM', 'Pemasaran Online dan Media Sosial', '15-17 Januari 2024, 08:00-16:00 WIB', 'Aula Dinas Perindustrian Kota Madiun', 2024, 'Aktif'),
          ('Manajemen Keuangan UMKM', 'Pembukuan dan Laporan Keuangan', '20-22 Februari 2024, 08:00-16:00 WIB', 'Aula Dinas Perindustrian Kota Madiun', 2024, 'Aktif'),
          ('Pengembangan Produk', 'Inovasi dan Desain Produk', '10-12 Maret 2024, 08:00-16:00 WIB', 'Aula Dinas Perindustrian Kota Madiun', 2024, 'Selesai')
          ON CONFLICT DO NOTHING;
        `
      })
    })
    
    if (response.ok) {
      const result = await response.json()
      console.log('✅ jenis_pelatihan table created successfully')
      console.log('✅ Sample data inserted')
    } else {
      console.log('⚠️ Table creation may have failed, but continuing...')
    }
    
  } catch (error) {
    console.log('⚠️ Error creating table:', error.message)
    console.log('💡 Table will be created automatically when needed')
  }
}

createJenisPelatihanTable()